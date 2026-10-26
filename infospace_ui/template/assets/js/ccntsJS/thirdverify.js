/* Third Verification - batch > file > pdf + case details (readonly) > digital sign > approve/reject
   No IA/Order mapping — mapped docs only show their IA/Order badge.
   Approve sends unsigned PDFs to the local signing service first, then approves. */

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
    pushtoServer(null, '/getbstchethirdverify.dwf', 'GET', function (node) {
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

function buildPrevRemarks(f) {
    var parts = [];
    if (f.verifyremarks) parts.push('L1 Verify: ' + f.verifyremarks);
    if (f.secondverifyremarks) parts.push('L2 Verify: ' + f.secondverifyremarks);
    if (f.thirdverifyremarks) parts.push('L3 Verify: ' + f.thirdverifyremarks);
    return parts.join('\n');
}

function findfirs(batch) {
    if (batch === null || batch === '' || batch === undefined) {
        $('#firTableWrap').hide();
        $('#firEmpty').hide();
        return;
    }
    pushtoServer(null, '/findFIrsbybathcthidverify.dwf?batch=' + batch, 'GET', function (node) {
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
            var l1By = (f.verify_by && f.verify_by.name) ? f.verify_by.name : '';
            var l2By = (f.secondverify_by && f.secondverify_by.name) ? f.secondverify_by.name : '';
            $('.searchcasenotable').append(
                '<tr>' +
                '<td class="font-weight-bold">' + batchNo + '</td>' +
                '<td class="font-weight-bold text-primary">' + fileLabel + '</td>' +
                '<td>' + (f.crn || '') + '</td>' +
                '<td>' + (f.pdfpagecount || 0) + '</td>' +
                '<td>' + l1By + '</td>' +
                '<td>' + l2By + '</td>' +
                '<td>' +
                '<button type="button" class="btn btn-sm btn-light-primary font-weight-bold fv-open" ' +
                'data-id="' + f.id + '" data-crn="' + (f.crn || '') + '" data-pages="' + (f.pdfpagecount || 0) + '" ' +
                'data-l1by="' + l1By + '" data-l2by="' + l2By + '" ' +
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
    $('#fvL1By').text($btn.attr('data-l1by') || '-');
    $('#fvL2By').text($btn.attr('data-l2by') || '-');

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
    $('#verifyTextarea').val('');

    // embedded case filing form — read-only at this stage (no Update button)
    $('#caseFrameSpinner').show();
    $('#caseFrame').attr('src', '/caseFilingEmbed.dwf?fir=' + FV.selectedFir + '&embed=1&readonly=1');

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
            var name = d.documenttypename;
            var signTag = d.secondsign
                ? ' <span class="label label-sm label-inline label-light-info font-weight-bolder">Signed</span>' : '';
            html += '<a href="javascript:;" class="btn btn-sm btn-outline-secondary font-weight-bold fv-doc" ' +
                'data-id="' + d.id + '" data-name="' + fvEscape(name) + '" ' +
                'data-path="' + fvEscape(d.ocrpdfpath) + '" ' +
                'data-date="' + fvEscape(d.documentdate) + '" ' +
                'data-desc="' + fvEscape(d.documentdesc) + '" ' +
                'data-remark="' + fvEscape(d.documentremark) + '">' +
                '<i class="far fa-file-pdf mr-1"></i>' + name + signTag +
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
    $('#pdfTitle').html('<i class="far fa-file-pdf text-primary mr-2"></i>' + $(this).data('name'));
    $('#docMetaDate').val($(this).attr('data-date') || '');
    $('#docMetaDesc').val($(this).attr('data-desc') || '');
    $('#docMetaRemark').val($(this).attr('data-remark') || '');
    $('#docMeta').css('display', 'flex');
    $('#pdfPlaceholder').hide();
    $('#pdfiream').show().attr('src', '/getpdf.dwf?id=' + $(this).data('id'));
});

/* ---------------- mapped IA / Order badges (read-only) ---------------- */

function normPath(p) {
    return String(p || '').replace(/\\/g, '/').toLowerCase();
}

function refreshCaseRefs() {
    if (!FV.selectedFir) return;
    pushtoServer(null, '/api/digitization/digitizedEntryByFir?firId=' + FV.selectedFir, 'GET', function (node) {
        var cd = (node && node.data && node.data.caseDetails) || {};
        FV.iaList = cd.ia_filings || [];
        FV.orderList = cd.order_details || [];
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

/* ---------------- document meta / navigation ---------------- */

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

/* ---------------- digital sign + approve ---------------- */

function approveFile() {
    if (!FV.selectedFir) { toastr.error('Select one file !'); return; }
    $.blockUI();
    $.ajax({
        url: 'http://localhost:8087/api/getProvider',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            $.unblockUI();
            var token = (response && response.data) || [];
            if (!token.length) { toastr.error('Dongle not detected, Attach dongle to get certificate'); return; }
            var option = '';
            token.forEach(function (t) { option += '<option value="' + t + '">' + t + '</option>'; });
            $('#digitalsign').html(option);
            $('.listfilenotsing').html('');
            $('#DigitalSignModal').modal('show');
        },
        error: function () {
            $.unblockUI();
            toastr.error('Problem calling local signing service');
        }
    });
}

function signAndApprove() {
    var alias = $('#digitalsign').val();
    if (!alias) { toastr.error('Select certificate !'); return; }
    $.blockUI();
    pushtoServer({ selectedfile: FV.selectedFir.toString() }, '/getpdfwithstatusSecondVerification.dwf', 'POST', function (node) {
        var files = (node && node.data) || [];
        if (!files.length) {
            $.unblockUI();
            $('#DigitalSignModal').modal('hide');
            doApproveFile();
            return;
        }
        $.ajax({
            url: 'http://localhost:8087/api/signPDF',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ alias: alias, files: files, isFirstverification: false }),
            success: function (response) {
                var signedIds = [];
                var failedHtml = '';
                ((response && response.data) || []).forEach(function (r) {
                    if (!r.status) {
                        failedHtml += '</br><span class="text-danger">' + r.filepath + '</span>';
                    } else {
                        signedIds.push(r.fileid);
                    }
                });
                if (!signedIds.length) {
                    $('.listfilenotsing').html(failedHtml);
                    $.unblockUI();
                    toastr.error('Problem in Sign PDF');
                    return;
                }
                pushtoServer({ classficationlist: signedIds.toString() }, '/updateclassficationSecondSign.dwf', 'POST', function () {
                    if (failedHtml) {
                        $('.listfilenotsing').html(failedHtml);
                        $.unblockUI();
                        toastr.error('Some PDFs could not be signed — file not approved.');
                        return;
                    }
                    $.unblockUI();
                    $('#DigitalSignModal').modal('hide');
                    doApproveFile();
                });
            },
            error: function () {
                $.unblockUI();
                toastr.error('Problem calling local signing service');
            }
        });
    });
}

function doApproveFile() {
    $.blockUI();
    pushtoServer({ selectedfile: [FV.selectedFir], imagestatus: 6, Verifyremarks: '' }, '/thirdverifybulkwithupload.dwf', 'POST', function (node) {
        $.unblockUI();
        if (node.status) {
            toastr.success('File verified successfully!');
            resetverify();
        } else {
            toastr.error('Approve failed. Please try again.');
        }
    });
}

/* ---------------- reject ---------------- */

function rejectFile(imagestatus) {
    if (!FV.selectedFir) { toastr.error('Select one file !'); return; }
    var remarks = $('#verifyTextarea').val().trim();
    if (!remarks.length) { toastr.error('Reject remarks required!'); return; }
    if (!confirm('Are you sure you want to Reject this file?')) return;
    $.blockUI();
    pushtoServer({ selectedfile: [FV.selectedFir], imagestatus: imagestatus, Verifyremarks: remarks }, '/thirdverifybulkwithupload.dwf', 'POST', function (node) {
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

function rejectMetadataFile() {
    if (!FV.selectedFir) { toastr.error('Select one file !'); return; }
    var remarks = $('#verifyTextarea').val().trim();
    if (!remarks.length) { toastr.error('Reject remarks required!'); return; }
    if (!confirm('Reject this file back to Metadata stage?')) return;
    $.blockUI();
    pushtoServer({ id: FV.selectedFir, thirdverifyremarks: remarks, readyforverify: false, secondverify: false, imagestatus: 5 }, '/rejectforMetadatathidverify.dwf', 'POST', function (node) {
        $.unblockUI();
        if (node && node.status) {
            $('#rejectModal').modal('hide');
            toastr.success('File rejected to metadata successfully!');
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
    getBatches();
});
