/* First Verification - batch > file > 40% pdf + 60% embedded case editor > approve/reject */

var FV = {
    selectedFir: null,
    selectedCrn: null,
    selectedDocId: null,
    selectedDocPath: null,
    iaList: [],
    orderList: []
};

function pushtoServer(pushObject, url, method, callback) {
    $.ajax({
        async: true,
        type: method,
        dataType: 'json',
        url: url,
        data: pushObject,
        success: function (response) { callback(response); },
        error: function (response) { callback(response && response.responseJSON ? response.responseJSON : { status: false }); }
    });
}

/* ---------------- batch & file list ---------------- */

function getBatches() {
    pushtoServer(null, '/getbstchesforvirfyReady.dwf', 'GET', function (node) {
        var list = node.data || [];
        var option = '';
        for (var i = 0; i < list.length; i++) {
            option += '<option value="' + list[i].id + '">' + list[i].bundlenumber + '</option>';
        }
        $('#batches').html(option);
        $('#batches').val('').trigger('change');
        $('#firTableWrap').hide();
        $('#firEmpty').hide();
    });
}

function findfirs(batch) {
    if (batch === null || batch === '' || batch === undefined) {
        $('#firTableWrap').hide();
        $('#firEmpty').hide();
        return;
    }
    pushtoServer(null, '/findFIrsbybathcReadyforVerify.dwf?batch=' + batch, 'GET', function (node) {
        var firs = node.data || [];
        $('.searchcasenotable').html('');
        if (!firs.length) {
            $('#firTableWrap').hide();
            $('#firEmpty').show();
             getBatches();
            return;
        }
        $('#firEmpty').hide();
        $('#firTableWrap').show();
        var batchNo = $('#batches option:selected').text().trim();
        for (var i = 0; i < firs.length; i++) {
            var f = firs[i];
            var fileLabel = (f.casetype || '') + '/' + (f.caseno || '') + '/' + (f.year || '');
            var remarks = (f.verifyremarks || '').replace(/"/g, '&quot;').replace(/\n/g, '<br>');
            $('.searchcasenotable').append(
                '<tr>' +
                '<td class="font-weight-bold">' + batchNo + '</td>' +
                '<td class="font-weight-bold text-primary">' + fileLabel + '</td>' +
                '<td>' + (f.crn || '') + '</td>' +
                '<td>' + (f.pdfpagecount || 0) + '</td>' +
                '<td>' +
                '<button type="button" class="btn btn-sm btn-light-primary font-weight-bold fv-open" ' +
                'data-id="' + f.id + '" data-crn="' + (f.crn || '') + '" data-pages="' + (f.pdfpagecount || 0) + '" ' +
                'data-file="' + fileLabel + '" data-remarks="' + remarks + '">' +
                '<i class="fas fa-folder-open mr-1"></i>Open</button>' +
                '</td></tr>'
            );
        }
        $('[data-toggle="tooltip"]').tooltip();
    });
}

/* ---------------- file workspace ---------------- */

function openFile($btn) {
    FV.selectedFir = parseInt($btn.data('id'), 10);
    FV.selectedCrn = String($btn.data('crn') || '');
    FV.selectedDocId = null;
    FV.selectedDocPath = null;
    FV.iaList = [];
    FV.orderList = [];

    $('#firTable tbody tr').removeClass('table-active');
    $btn.closest('tr').addClass('table-active');

    $('#fvFileTitle').text($btn.data('file'));
    $('#fvCrn').text($btn.data('crn'));
    $('#fvPages').text($btn.data('pages'));

    var remarks = String($btn.attr('data-remarks') || '');
    if (remarks) {
        $('.remakrsshow').show();
        $('.remakrsdata').html(remarks);
        $('.remakrsshowbody').show();
    } else {
        $('.remakrsshow').hide();
        $('.remakrsdata').html('');
        $('.remakrsshowbody').hide();
    }

    $('#pdfPlaceholder').show();
    $('#pdfTitle').html('<i class="far fa-file-pdf text-primary mr-2"></i>Document Preview');
    $('#pdfiream').hide().attr('src', '');
    $('#docMeta').hide();
    $('#mapBar').css('display', 'none');
    $('#fvMapIa').html('<option value="">Select IA</option>');
    $('#fvMapOrder').html('<option value="">Select Order</option>');
    $('#verifyTextarea').val('');

    // embedded full case filing form (auto-loads this FIR in edit mode)
    $('#caseFrameSpinner').show();
    $('#caseFrame').attr('src', '/caseFilingEmbed.dwf?fir=' + FV.selectedFir + '&embed=1');

    $('.batchsection').hide(300);
    $('.filesection').show(300);
    window.scrollTo(0, 0);

    loadDocuments(FV.selectedFir);
}

$('#caseFrame').on('load', function () {
    if ($('#caseFrame').attr('src')) $('#caseFrameSpinner').hide();
});

function closefile() {
    if (confirm('Close this file and go back to the list?')) {
        resetverify();
    }
}

function resetverify() {
    FV.selectedFir = null;
    FV.selectedCrn = null;
    FV.selectedDocId = null;
    FV.selectedDocPath = null;
    FV.iaList = [];
    FV.orderList = [];
    $('#verifyTextarea').val('');
    $('#pdfiream').hide().attr('src', '');
    $('#docMeta').hide();
    $('#mapBar').css('display', 'none');
    $('#pdfPlaceholder').show();
    $('#pdfTitle').html('<i class="far fa-file-pdf text-primary mr-2"></i>Document Preview');
    $('#docList').html('');
    $('#caseFrame').attr('src', '');
    $('.filesection').hide(300);
    $('.batchsection').show(300);
    findfirs($('#batches').val());
   
}

function toggleExpand() {
    var $pdf = $('#pdfcol');
    var $case = $('#casecol');
    if ($pdf.hasClass('col-lg-5')) {
        $pdf.removeClass('col-lg-5').addClass('col-lg-8');
        $case.removeClass('col-lg-7').addClass('col-lg-4');
        $('.changeicon').removeClass('fa-expand').addClass('fa-compress');
    } else {
        $pdf.removeClass('col-lg-8').addClass('col-lg-5');
        $case.removeClass('col-lg-4').addClass('col-lg-7');
        $('.changeicon').removeClass('fa-compress').addClass('fa-expand');
    }
}

/* ---------------- documents / pdf ---------------- */

function fvEscape(s) {
    return String(s === null || s === undefined ? '' : s).replace(/"/g, '&quot;');
}

function loadDocuments(firId) {
    $('#docList').html('<div class="text-muted font-weight-bold p-3">Loading...</div>');
    pushtoServer(null, '/getdocumentclassficationByfir.dwf?fir=' + firId, 'GET', function (node) {
        var docs = node.data || [];
        docs.sort(function (a, b) { return a.id - b.id; });
        var seen = {};
        var html = '';
        docs.forEach(function (d) {
            if (!d.ocrpdfpath || seen[d.ocrpdfpath]) return;
            seen[d.ocrpdfpath] = true;
            var parts = String(d.ocrpdfpath).split(/[\\/]/);
           // var name = parts[parts.length - 1];
           var name=d.documenttypename;
            html += '<a href="javascript:;" class="btn btn-sm btn-outline-secondary font-weight-bold fv-doc" ' +
                'data-id="' + d.id + '" data-name="' + fvEscape(name) + '" ' +
                'data-path="' + fvEscape(d.ocrpdfpath) + '" ' +
                'data-date="' + fvEscape(d.documentdate) + '" ' +
                'data-desc="' + fvEscape(d.documentdesc) + '" ' +
                'data-remark="' + fvEscape(d.documentremark) + '">' +
                '<i class="far fa-file-pdf mr-1"></i>' + name +
                '</a>';
        });
        if (!html) html = '<span class="text-muted font-weight-bold">No documents</span>';
        $('#docList').html(html);
        markMappedDocs();
    });
    refreshCaseRefs();
}

$(document).on('click', '.fv-doc', function () {
    $('.fv-doc').removeClass('fv-active');
    $(this).addClass('fv-active');
    FV.selectedDocId = parseInt($(this).data('id'), 10);
    FV.selectedDocPath = String($(this).attr('data-path') || '');
    $('#mapBar').css('display', 'flex');
    $('#pdfTitle').html('<i class="far fa-file-pdf text-primary mr-2"></i>' + $(this).data('name'));
    $('#docMetaDate').text($(this).attr('data-date') || '-');
    $('#docMetaDesc').text($(this).attr('data-desc') || '-');
    $('#docMetaRemark').text($(this).attr('data-remark') || '-');
    $('#docMeta').css('display', 'flex');
    $('#pdfPlaceholder').hide();
    $('#pdfiream').show().attr('src', '/getpdf.dwf?id=' + $(this).data('id'));
});

/* ---------------- map pdf to IA / Order ---------------- */

function normPath(p) {
    return String(p || '').replace(/\\/g, '/').toLowerCase();
}

function refreshCaseRefs() {
    if (!FV.selectedFir) return;
    pushtoServer(null, '/api/digitization/digitizedEntryByFir?firId=' + FV.selectedFir, 'GET', function (node) {
        var cd = (node && node.data && node.data.caseDetails) || {};
        FV.iaList = cd.ia_filings || [];
        FV.orderList = cd.order_details || [];

        var iaOpt = '<option value="">Select IA</option>';
        FV.iaList.forEach(function (r) {
            var lbl = 'IA ' + (r.iaNumber || '?') + '/' + (r.iaYear || '');
            if (r.documentPath) lbl += ' (mapped)';
            iaOpt += '<option value="' + r.id + '">' + lbl + '</option>';
        });
        var ordOpt = '<option value="">Select Order</option>';
        FV.orderList.forEach(function (r) {
            var lbl = 'Order ' + (r.orderDate || ('#' + r.id)) + (r.iaNumber ? ' / IA ' + r.iaNumber : '');
            if (r.documentPath) lbl += ' (mapped)';
            ordOpt += '<option value="' + r.id + '">' + lbl + '</option>';
        });
        $('#fvMapIa').html(iaOpt);
        $('#fvMapOrder').html(ordOpt);
        markMappedDocs();
    });
}

function markMappedDocs() {
    var mapped = {};
    FV.iaList.forEach(function (r) {
        if (r.documentPath) mapped[normPath(r.documentPath)] = 'IA ' + (r.iaNumber || '') + '/' + (r.iaYear || '');
    });
    FV.orderList.forEach(function (r) {
        if (r.documentPath) mapped[normPath(r.documentPath)] = 'Order ' + (r.orderDate || '');
    });
    $('.fv-doc').each(function () {
        var lbl = mapped[normPath($(this).attr('data-path'))];
        $(this).find('.fv-map-tag').remove();
        $(this).toggleClass('fv-mapped', !!lbl);
        if (lbl) {
            $(this).attr('title', 'Mapped to ' + lbl)
                .append(' <span class="fv-map-tag label label-sm label-inline label-light-success font-weight-bolder">' + lbl + '</span>');
        } else {
            $(this).removeAttr('title');
        }
    });
}

function syncIframeListItem(type, entryId, path) {
    try {
        var w = document.getElementById('caseFrame').contentWindow;
        var list = w && w.LISTS && w.LISTS[type === 'order' ? 'orderDetails' : 'iaFilings'];
        if (!list) return;
        list.getItems().forEach(function (it) {
            if (parseInt(it.id, 10) === entryId) it.documentPath = path;
        });
    } catch (e) { /* iframe not ready */ }
}

function mapSelectedDoc(type) {
    var isOrder = (type === 'order');
    var entryId = parseInt($(isOrder ? '#fvMapOrder' : '#fvMapIa').val(), 10);
    var label = isOrder ? 'Order' : 'IA';
    if (!FV.selectedDocPath) { toastr.warning('Select a document first.'); return; }
    if (!entryId) { toastr.warning('Select an ' + label + ' from the list first.'); return; }
    if (!confirm('Map this PDF to the selected ' + label + '?')) return;
    $.blockUI();
    pushtoServer({ type: type, id: entryId, path: FV.selectedDocPath }, '/verifyMapPdf.dwf', 'POST', function (node) {
        $.unblockUI();
        if (node && node.status) {
            toastr.success('PDF mapped to ' + label + ' successfully.');
            syncIframeListItem(type, entryId, FV.selectedDocPath);
            refreshCaseRefs();
        } else {
            toastr.error((node && node.error) || 'Mapping failed. Please try again.');
        }
    });
}

function openNewEntry(type) {
    var isOrder = (type === 'order');
    var frame = document.getElementById('caseFrame');
    var w = frame && frame.contentWindow;
    if (!w || !w.LISTS) {
        toastr.warning('Case details form is still loading. Please wait and try again.');
        return;
    }
    if (!w.currentCaseId) {
        toastr.warning('Case details are not saved yet. Save the case first, then add ' + (isOrder ? 'an Order' : 'an IA') + '.');
        return;
    }
    w.$(isOrder ? 'a[href="#cf_tab_orders"]' : 'a[href="#cf_tab_iafiling"]').tab('show');
    (isOrder ? w.LISTS.orderDetails : w.LISTS.iaFilings).open();
    toastr.info('Fill the ' + (isOrder ? 'Order' : 'IA') + ' details, Save the entry and click Update. The list will refresh automatically.');
}

/* ---------------- approve / reject ---------------- */

function approveFile() {
    if (!FV.selectedFir) { toastr.error('Select one file !'); return; }
    if (!confirm('Did you save all case detail changes? Approve this file now?')) return;
    $.blockUI();
    pushtoServer({ selectedfile: [FV.selectedFir], imagestatus: 5, Verifyremarks: '' }, '/bulkReadyForVerify.dwf', 'POST', function (node) {
        $.unblockUI();
        if (node.status) {
            toastr.success('File verified successfully!');
            resetverify();
        } else {
            toastr.error('Approve failed. Please try again.');
        }
    });
}

function rejectFile(imagestatus) {
    if (!FV.selectedFir) { toastr.error('Select one file !'); return; }
    var remarks = $('#verifyTextarea').val().trim();
    if (!remarks.length) { toastr.error('Reject remarks required!'); return; }
    if (!confirm('Are you sure you want to Reject this file?')) return;
    $.blockUI();
    pushtoServer({ selectedfile: [FV.selectedFir], imagestatus: imagestatus, Verifyremarks: remarks }, '/bulkReadyForVerifyReject.dwf', 'POST', function (node) {
        $.unblockUI();
        if (node.status) {
            $('#rejectModal').modal('hide');
            toastr.success('File rejected successfully!');
            resetverify();
        } else {
            toastr.error('Reject failed. Please try again.');
        }
    });
}

/* ---------------- init ---------------- */

$(document).ready(function () {
    $('#batches').select2({ placeholder: 'Select Batch', allowClear: true });
    $('#batches').on('change', function () { findfirs($(this).val()); });
    $(document).on('click', '.fv-open', function () { openFile($(this)); });
    $(document).on('click', '#fvPrevRemarksBtn', function () { $('.remakrsshowbody').toggle(200); });
    getBatches();
});
