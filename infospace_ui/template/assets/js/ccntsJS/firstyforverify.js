/* First Verification - batch > file > 40% pdf + 60% embedded case editor > approve/reject */

var FV = {
    selectedFir: null,
    selectedCrn: null
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

    $('#firTable tbody tr').removeClass('table-active');
    $btn.closest('tr').addClass('table-active');

    $('#fvFileTitle').text($btn.data('file'));
    $('#fvCrn').text($btn.data('crn'));
    $('#fvPages').text($btn.data('pages'));

    var remarks = String($btn.attr('data-remarks') || '');
    if (remarks) {
        $('.remakrsshow').show();
        $('#fvPrevRemarks').attr('title', remarks);
        $('#fvPrevRemarks').tooltip({ html: true });
    } else {
        $('.remakrsshow').hide();
    }

    $('#pdfPlaceholder').show();
    $('#pdfTitle').html('<i class="far fa-file-pdf text-primary mr-2"></i>Document Preview');
    $('#pdfiream').hide().attr('src', '');
    $('#verifyTextarea').val('');

    // embedded full case filing form (auto-loads this CINO in edit mode)
    $('#caseFrameSpinner').show();
    $('#caseFrame').attr('src', '/caseFiling.dwf?cino=' + encodeURIComponent(FV.selectedCrn) + '&embed=1');

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
    $('#verifyTextarea').val('');
    $('#pdfiream').hide().attr('src', '');
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
            var name = parts[parts.length - 1];
            html += '<a href="javascript:;" class="navi-item fv-doc" data-id="' + d.id + '" data-name="' + name + '">' +
                '<span class="navi-text py-2">' +
                '<i class="far fa-file-pdf text-danger mr-2"></i>' + name +
                '</span></a>';
        });
        if (!html) html = '<div class="text-muted font-weight-bold p-3">No documents</div>';
        $('#docList').html(html);
    });
}

$(document).on('click', '.fv-doc', function () {
    $('.fv-doc').removeClass('bg-light');
    $(this).addClass('bg-light');
    $('#pdfTitle').html('<i class="far fa-file-pdf text-primary mr-2"></i>' + $(this).data('name'));
    $('#pdfPlaceholder').hide();
    $('#pdfiream').show().attr('src', '/getpdf.dwf?id=' + $(this).data('id'));
});

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
    getBatches();
});
