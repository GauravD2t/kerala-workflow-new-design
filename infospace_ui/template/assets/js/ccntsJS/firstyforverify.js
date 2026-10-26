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
            var remarks = buildPrevRemarks(f).replace(/"/g, '&quot;').replace(/\n/g, '<br>');
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

function buildPrevRemarks(f) {
    var parts = [];
    if (f.verifyremarks) parts.push('L1 Remarks: ' + f.verifyremarks);
    if (f.secondverifyremarks) parts.push('L2 Remarks: ' + f.secondverifyremarks);
    if (f.thirdverifyremarks) parts.push('L3 Remarks: ' + f.thirdverifyremarks);
    return parts.join('\n');
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
    if ($pdf.hasClass('col-lg-6')) {
        $pdf.removeClass('col-lg-6').addClass('col-lg-8');
        $case.removeClass('col-lg-6').addClass('col-lg-4');
        $('.changeicon').removeClass('fa-expand').addClass('fa-compress');
    } else {
        $pdf.removeClass('col-lg-8').addClass('col-lg-6');
        $case.removeClass('col-lg-4').addClass('col-lg-6');
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
    var iaMap = fvMappedEntry('ia');
    var ordMap = fvMappedEntry('order');
    $('#fvMapIa').val(iaMap ? String(iaMap.id) : '');
    $('#fvMapOrder').val(ordMap ? String(ordMap.id) : '');
    syncMapUi();
    $('#mapBar').css('display', 'flex');
    $('#pdfTitle').html('<i class="far fa-file-pdf text-primary mr-2"></i>' + $(this).data('name'));
    $('#docMetaDate').val($(this).attr('data-date') || '');
    $('#docMetaDesc').val($(this).attr('data-desc') || '');
    $('#docMetaRemark').val($(this).attr('data-remark') || '');
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
        var prevIa = $('#fvMapIa').val();
        var prevOrd = $('#fvMapOrder').val();
        $('#fvMapIa').html(iaOpt);
        $('#fvMapOrder').html(ordOpt);
        if (FV.pendingSelect) {
            $(FV.pendingSelect.type === 'order' ? '#fvMapOrder' : '#fvMapIa').val(FV.pendingSelect.id);
            FV.pendingSelect = null;
        } else {
            if (prevIa && $('#fvMapIa option[value="' + prevIa + '"]').length) $('#fvMapIa').val(prevIa);
            if (prevOrd && $('#fvMapOrder option[value="' + prevOrd + '"]').length) $('#fvMapOrder').val(prevOrd);
        }
        var iaMap = fvMappedEntry('ia');
        var ordMap = fvMappedEntry('order');
        if (iaMap && !$('#fvMapIa').val()) $('#fvMapIa').val(iaMap.id);
        if (ordMap && !$('#fvMapOrder').val()) $('#fvMapOrder').val(ordMap.id);
        markMappedDocs();
        syncMapUi();
    });
}

function fvMappedEntry(type) {
    var p = normPath(FV.selectedDocPath);
    if (!p) return null;
    var list = (type === 'order') ? FV.orderList : FV.iaList;
    var hit = null;
    list.forEach(function (r) {
        if (normPath(r.documentPath) === p) hit = r;
    });
    return hit;
}

function syncMapUi() {
    ['ia', 'order'].forEach(function (type) {
        var mapped = fvMappedEntry(type);
        var selId = parseInt($(type === 'order' ? '#fvMapOrder' : '#fvMapIa').val(), 10);
        var $btn = $(type === 'order' ? '#fvMapOrderBtn' : '#fvMapIaBtn');
        if (mapped && selId === mapped.id) {
            $btn.data('mode', 'unmap')
                .removeClass('btn-primary').addClass('btn-light-danger')
                .html('<i class="fas fa-unlink mr-1"></i>Unmap');
        } else {
            $btn.data('mode', 'map')
                .removeClass('btn-light-danger').addClass('btn-primary')
                .html('Map ' + (type === 'order' ? 'Order' : 'IA'));
        }
    });
}

function mapBtnAction(type) {
    var mode = $(type === 'order' ? '#fvMapOrderBtn' : '#fvMapIaBtn').data('mode');
    if (mode === 'unmap') { unmapSelectedDoc(); } else { mapSelectedDoc(type); }
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
        if (!w || !w.LISTS) return;
        ['iaFilings', 'orderDetails'].forEach(function (key) {
            w.LISTS[key].getItems().forEach(function (it) {
                if (normPath(it.documentPath) === normPath(path) && parseInt(it.id, 10) !== entryId) {
                    it.documentPath = null;
                }
            });
        });
        w.LISTS[type === 'order' ? 'orderDetails' : 'iaFilings'].getItems().forEach(function (it) {
            if (parseInt(it.id, 10) === entryId) it.documentPath = path;
        });
    } catch (e) { /* iframe not ready */ }
}

function syncIframeUnmap(path) {
    try {
        var w = document.getElementById('caseFrame').contentWindow;
        if (!w || !w.LISTS) return;
        ['iaFilings', 'orderDetails'].forEach(function (key) {
            w.LISTS[key].getItems().forEach(function (it) {
                if (normPath(it.documentPath) === normPath(path)) it.documentPath = null;
            });
        });
    } catch (e) { /* iframe not ready */ }
}

function mapSelectedDoc(type) {
    var isOrder = (type === 'order');
    var entryId = parseInt($(isOrder ? '#fvMapOrder' : '#fvMapIa').val(), 10);
    var label = isOrder ? 'Order' : 'IA';
    if (!FV.selectedDocPath) { toastr.warning('Select a document first.'); return; }
    if (!entryId) { toastr.warning('Select an ' + label + ' from the list first.'); return; }
    if (!confirm('Map this PDF to the selected ' + label + '? Any existing mapping of this PDF will be moved.')) return;
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

function unmapSelectedDoc() {
    if (!FV.selectedDocPath) { toastr.warning('Select a document first.'); return; }
    var p = normPath(FV.selectedDocPath);
    var isMapped = FV.iaList.concat(FV.orderList).some(function (r) {
        return normPath(r.documentPath) === p;
    });
    if (!isMapped) { toastr.info('This document is not mapped to any IA or Order.'); return; }
    if (!confirm('Remove the IA / Order mapping for this PDF?')) return;
    $.blockUI();
    pushtoServer({ fir: FV.selectedFir, path: FV.selectedDocPath }, '/verifyUnmapPdf.dwf', 'POST', function (node) {
        $.unblockUI();
        if (node && node.status) {
            toastr.success('Mapping removed.');
            syncIframeUnmap(FV.selectedDocPath);
            refreshCaseRefs();
        } else {
            toastr.error((node && node.error) || 'Unmap failed. Please try again.');
        }
    });
}

function syncIframeNewItem(type, row) {
    try {
        var w = document.getElementById('caseFrame').contentWindow;
        var list = w && w.LISTS && w.LISTS[type === 'order' ? 'orderDetails' : 'iaFilings'];
        if (!list || !row || !row.id) return;
        var items = list.getItems();
        if (!items.some(function (it) { return parseInt(it.id, 10) === parseInt(row.id, 10); })) {
            items.push(row);
            list.setItems(items, true);
        }
    } catch (e) { /* iframe not ready */ }
}

var FV_IA_FIELDS = ['iaType', 'iaNumber', 'iaYear', 'iaNature', 'filingDate', 'applicantName',
    'applicantAdvocate', 'respondentName', 'respondentAdvocate', 'status', 'dateOfDecision', 'nextdate'];
var FV_IA_NUM = ['iaType', 'iaYear', 'iaNature', 'applicantAdvocate', 'respondentAdvocate'];
var FV_ORDER_FIELDS = ['documentType', 'orderDate', 'judgeCode', 'jocode', 'iaNumber', 'iaType'];
var FV_ORDER_NUM = ['documentType', 'judgeCode', 'iaType'];

function collectFvModal(prefix, fields, numFields) {
    var item = {};
    fields.forEach(function (f) {
        var el = document.getElementById(prefix + f);
        if (!el) return;
        var v = el.value;
        item[f] = (v === '') ? null : (numFields.indexOf(f) !== -1 ? parseInt(v, 10) : v);
    });
    return item;
}

function openNewEntry(type) {
    if (!FV.selectedFir) { toastr.warning('Open a file first.'); return; }
    var $modal = $(type === 'order' ? '#fvOrderModal' : '#fvIaModal');
    $modal.find('input').val('');
    $modal.find('select').val('');
    $modal.modal('show');
}

function fvSaveNewEntry(type) {
    var isOrder = (type === 'order');
    var fields = collectFvModal(isOrder ? 'fv_ord_' : 'fv_ia_', isOrder ? FV_ORDER_FIELDS : FV_IA_FIELDS, isOrder ? FV_ORDER_NUM : FV_IA_NUM);
    if (!isOrder && !fields.iaNumber) { toastr.warning('IA Number is required.'); return; }
    if (isOrder && !fields.orderDate) { toastr.warning('Order Date is required.'); return; }
    $.blockUI();
    pushtoServer({ type: type, fir: FV.selectedFir, fields: JSON.stringify(fields) }, '/verifyCreateEntry.dwf', 'POST', function (node) {
        $.unblockUI();
        if (node && node.status && node.data) {
            toastr.success((isOrder ? 'Order' : 'IA') + ' created successfully.');
            $(isOrder ? '#fvOrderModal' : '#fvIaModal').modal('hide');
            syncIframeNewItem(type, node.data);
            FV.pendingSelect = { type: type, id: node.data.id };
            refreshCaseRefs();
        } else {
            toastr.error((node && node.error) || 'Create failed. Please try again.');
        }
    });
}

function fvInitMasterSelects() {
    $('#fvIaModal select[data-master], #fvOrderModal select[data-master]').each(function () {
        var $el = $(this);
        pushtoServer(null, '/api/digitization/master/' + $el.data('master'), 'GET', function (res) {
            var valKey = $el.data('val');
            var labelTpl = String($el.data('label'));
            $el.empty().append('<option value="">Select</option>');
            if (res && res.success && res.data) {
                res.data.forEach(function (row) {
                    var label = labelTpl.replace(/\{([^}]+)\}/g, function (m, k) { return row[k] !== undefined ? row[k] : ''; });
                    $el.append('<option value="' + row[valKey] + '">' + label + '</option>');
                });
            }
        });
    });
}

function navigateDoc(dir) {
    var $docs = $('#docList .fv-doc');
    if (!$docs.length) return;
    var idx = $docs.index($docs.filter('.fv-active'));
    var next = idx + dir;
    if (idx === -1) next = (dir > 0) ? 0 : $docs.length - 1;
    if (next < 0 || next >= $docs.length) {
        toastr.info(dir > 0 ? 'No more documents.' : 'This is the first document.');
        return;
    }
    $docs.eq(next).trigger('click');
}

function saveDocMeta() {
    if (!FV.selectedDocId) { toastr.warning('Select a document first.'); return; }
    var body = {
        documentdate: $('#docMetaDate').val().trim(),
        documentdesc: $('#docMetaDesc').val().trim(),
        documentremark: $('#docMetaRemark').val().trim()
    };
    $.blockUI();
    pushtoServer(body, '/updatedocumentclassficationByfir.dwf?id=' + FV.selectedDocId, 'POST', function (node) {
        $.unblockUI();
        if (node && node.status) {
            toastr.success('Document details saved.');
            $('.fv-doc.fv-active')
                .attr('data-date', body.documentdate)
                .attr('data-desc', body.documentdesc)
                .attr('data-remark', body.documentremark);
        } else {
            toastr.error('Save failed. Please try again.');
        }
    });
}

/* ---------------- approve / reject ---------------- */

function approveFile() {
    if (!FV.selectedFir) { toastr.error('Select one file !'); return; }
    if (!confirm('Save case detail changes and approve this file now?')) return;
    var frame = document.getElementById('caseFrame');
    var w = frame && frame.contentWindow;
    if (w && w.currentCaseId && typeof w.saveAll === 'function') {
        $.blockUI();
        try {
            w.saveAll(function (ok) {
                if (ok) {
                    doApproveFile();
                } else {
                    $.unblockUI();
                    toastr.error('Case details save failed — file not approved.');
                }
            });
            return;
        } catch (e) {
            $.unblockUI();
        }
    }
    doApproveFile();
}

function doApproveFile() {
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
    // collapse the left menu on this page
    $('body').addClass('aside-minimize').removeClass('aside-minimize-hover');
    $('#kt_aside_toggle').addClass('active');
    try {
        var _at = KTLayoutAsideToggle.getToggle();
        if (_at) _at.state = 'on';
    } catch (e) { }

    $('#batches').select2({ placeholder: 'Select Batch', allowClear: true });
    $('#batches').on('change', function () { findfirs($(this).val()); });
    $(document).on('click', '.fv-open', function () { openFile($(this)); });
    $(document).on('click', '#fvPrevRemarksBtn', function () { $('.remakrsshowbody').toggle(200); });
    $(document).on('change', '#fvMapIa, #fvMapOrder', syncMapUi);
    fvInitMasterSelects();
    getBatches();
});
