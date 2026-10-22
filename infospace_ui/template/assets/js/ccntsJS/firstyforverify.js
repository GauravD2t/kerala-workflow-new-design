/* First Verification - batch > file > pdf + case detail edit > approve/reject */

var FV = {
    selectedFir: null,
    selectedCrn: null,
    caseId: null,
    dirty: false,
    masters: {}
};

var FV_FIELDS = [
    { key: 'efilno', label: 'e-Filing No' },
    { key: 'dateOfEfiling', label: 'Date of e-Filing', date: true },
    { key: 'filNo', label: 'Filing No', num: true },
    { key: 'filYear', label: 'Filing Year', num: true },
    { key: 'dateOfFiling', label: 'Date of Filing', date: true },
    { key: 'dateOfScrutiny', label: 'Date of Scrutiny', date: true },
    { key: 'regNo', label: 'Registration No', num: true },
    { key: 'regYear', label: 'Registration Year', num: true },
    { key: 'dtRegis', label: 'Date of Registration', date: true },
    { key: 'caseType', label: 'Case Type', master: 'casetype', val: 'case_type', labelTpl: '{type_name} - {full_form}', num: true },
    { key: 'typeName', label: 'Type Name' },
    { key: 'status', label: 'Status', options: ['Draft', 'Pending', 'Disposed'] },
    { key: 'dateFirstList', label: 'Date of First List', date: true },
    { key: 'dateNextList', label: 'Date of Next List', date: true },
    { key: 'dateLastList', label: 'Date of Last List', date: true },
    { key: 'dateOfDecision', label: 'Date of Decision', date: true },
    { key: 'dateFilingDisp', label: 'Filing to Disposal Date', date: true },
    { key: 'dateFilingDispO', label: 'Filing to Disposal Date (Other)', date: true },
    { key: 'dispNature', label: 'Disposal Nature', master: 'disposal_nature', val: 'disp_type', labelTpl: '{disp_name}', num: true },
    { key: 'courtNo', label: 'Court No', num: true },
    { key: 'policeStCode', label: 'Police Station', master: 'police_stn', val: 'police_st_code', labelTpl: '{police_st_name}', num: true },
    { key: 'subject', label: 'Subject', master: 'subject', val: 'subject_code', labelTpl: '{subject_name}', num: true },
    { key: 'caseNo', label: 'Case No' },
    { key: 'mainCaseNo', label: 'Main Case No' },
    { key: 'mainMatterCino', label: 'Main Matter CINO' }
];

var FV_MASTERS = ['casetype', 'disposal_nature', 'police_stn', 'subject'];

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

/* ---------------- masters ---------------- */

function renderLabel(template, row) {
    return template.replace(/\{([^}]+)\}/g, function (m, key) {
        return row[key] !== undefined && row[key] !== null ? row[key] : '';
    });
}

function loadMasters(done) {
    var pending = FV_MASTERS.length;
    FV_MASTERS.forEach(function (m) {
        $.getJSON('/api/digitization/master/' + m, function (res) {
            FV.masters[m] = (res && res.success) ? res.data : [];
        }).always(function () {
            if (--pending === 0 && done) done();
        });
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
        if (remarks.length) { /* keep tooltip-init consistent */ }
        $('[data-toggle="tooltip"]').tooltip();
    });
}

/* ---------------- file workspace ---------------- */

function openFile($btn) {
    FV.selectedFir = parseInt($btn.data('id'), 10);
    FV.selectedCrn = $btn.data('crn');
    FV.caseId = null;
    FV.dirty = false;

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

    $('#pdfPlaceholder .py-20').show();
    $('#pdfiream').hide().attr('src', '');
    $('#verifyTextarea').val('');

    $('.batchsection').hide(300);
    $('.filesection').show(300);
    window.scrollTo(0, 0);

    loadDocuments(FV.selectedFir);
    loadCaseDetail(FV.selectedFir);
}

function closefile() {
    if (FV.dirty && !confirm('You have unsaved case detail changes. Leave anyway?')) return;
    resetverify();
}

function resetverify() {
    FV.selectedFir = null;
    FV.selectedCrn = null;
    FV.caseId = null;
    FV.dirty = false;
    $('#verifyTextarea').val('');
    $('#fvUnsaved').hide();
    $('#pdfiream').hide().attr('src', '');
    $('#pdfPlaceholder .py-20').show();
    $('#docList').html('');
    $('.filesection').hide(300);
    $('.batchsection').show(300);
    findfirs($('#batches').val());
    
}

function toggleExpand() {
    if ($('#pdfdiv').hasClass('col-lg-5')) {
        $('#pdfdiv').removeClass('col-lg-5').addClass('col-lg-8');
        $('#casePanel').hide(300);
        $('.changeicon').removeClass('fa-expand').addClass('fa-compress');
    } else {
        $('#pdfdiv').removeClass('col-lg-8').addClass('col-lg-5');
        $('#casePanel').show(300);
        $('.changeicon').removeClass('fa-compress').addClass('fa-expand');
    }
}

/* ---------------- documents / pdf ---------------- */

function loadDocuments(firId) {
    $('#docList').html('<div class="text-muted font-weight-bold p-4">Loading...</div>');
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
                '<span class="navi-text py-2 border-bottom">' +
                '<i class="far fa-file-pdf text-danger mr-2"></i>' + name +
                '</span></a>';
        });
        if (!html) html = '<div class="text-muted font-weight-bold p-4">No documents</div>';
        $('#docList').html(html);
    });
}

$(document).on('click', '.fv-doc', function () {
    $('.fv-doc').removeClass('bg-light');
    $(this).addClass('bg-light');
    var id = $(this).data('id');
    $('#pdfTitle').html('<i class="far fa-file-pdf text-primary mr-2"></i>' + $(this).data('name'));
    $('#pdfPlaceholder .py-20').hide();
    $('#pdfiream').show().attr('src', '/getpdf.dwf?id=' + id);
});

/* ---------------- case details ---------------- */

function buildFieldHtml(f, value) {
    var v = (value === null || value === undefined) ? '' : value;
    if (f.options) {
        var html = '<select class="form-control form-control-sm" id="fv_' + f.key + '"><option value=""></option>';
        f.options.forEach(function (o) {
            html += '<option value="' + o + '"' + (String(v) === o ? ' selected' : '') + '>' + o + '</option>';
        });
        return html + '</select>';
    }
    if (f.master) {
        var rows = FV.masters[f.master] || [];
        var out = '<select class="form-control form-control-sm" id="fv_' + f.key + '"><option value=""></option>';
        rows.forEach(function (row) {
            out += '<option value="' + row[f.val] + '"' + (String(row[f.val]) === String(v) ? ' selected' : '') + '>' + renderLabel(f.labelTpl, row) + '</option>';
        });
        return out + '</select>';
    }
    if (f.date) {
        var dv = v ? String(v).substring(0, 10) : '';
        return '<input type="text" class="form-control form-control-sm fv-date" placeholder="YYYY-MM-DD" id="fv_' + f.key + '" value="' + dv + '" maxlength="10">';
    }
    return '<input type="text" class="form-control form-control-sm" id="fv_' + f.key + '" value="' + String(v).replace(/"/g, '&quot;') + '">';
}

function loadCaseDetail(firId) {
    $('#fvNoCase').hide();
    $('#fvCaseWrap').hide();
    $('#fvCaseFooter').hide();
    $.getJSON('/api/digitization/digitizedEntryByFir?firId=' + firId, function (res) {
        if (!res.success || !res.data || !res.data.caseDetails) {
            $('#fvNoCase').show();
            $('#fvCaseStatus').text('');
            return;
        }
        FV.caseId = res.data.id;
        var cd = res.data.caseDetails;
        $('#fvCaseStatus').text(cd.status || '');

        var parties = '';
        (cd.main_parties || []).forEach(function (p) {
            var side = p.partytype === 1 ? 'Petitioner' : 'Respondent';
            var cls = p.partytype === 1 ? 'label-light-success' : 'label-light-warning';
            if (p.name) {
                parties += '<div class="d-flex align-items-center mb-2">' +
                    '<span class="label ' + cls + ' label-inline font-weight-bold mr-3">' + side + '</span>' +
                    '<span class="font-weight-bold text-dark">' + p.name + '</span></div>';
            }
        });
        $('#fvParties').html(parties);

        var html = '';
        FV_FIELDS.forEach(function (f) {
            html += '<div class="col-6 mb-3">' +
                '<label class="font-size-sm font-weight-bolder text-muted mb-1">' + f.label + '</label>' +
                buildFieldHtml(f, cd[f.key]) +
                '</div>';
        });
        $('#fvCaseFields').html(html);
        FV.dirty = false;
        $('#fvUnsaved').hide();
        $('#fvCaseWrap').show();
        $('#fvCaseFooter').show();
    });
}

function fvIsValidYmd(value) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!m) return false;
    var year = parseInt(m[1], 10), month = parseInt(m[2], 10), day = parseInt(m[3], 10);
    if (year < 1900 || year > 2100 || month < 1 || month > 12) return false;
    var daysInMonth = [31, (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return day >= 1 && day <= daysInMonth[month - 1];
}

$(document).on('input', '.fv-date', function () {
    var digits = this.value.replace(/\D/g, '').slice(0, 8);
    var out = digits.slice(0, 4);
    if (digits.length > 4) out += '-' + digits.slice(4, 6);
    if (digits.length > 6) out += '-' + digits.slice(6, 8);
    this.value = out;
});

$(document).on('blur', '.fv-date', function () {
    $(this).removeClass('is-invalid');
    if (this.value !== '' && !fvIsValidYmd(this.value)) {
        $(this).addClass('is-invalid');
        this.value = '';
        toastr.error('Invalid date. Please enter a valid date in YYYY-MM-DD format.');
    }
});

$(document).on('change input', '#fvCaseFields :input', function () {
    FV.dirty = true;
    $('#fvUnsaved').show();
});

function saveCaseDetail() {
    if (!FV.caseId) return;
    var payload = {};
    FV_FIELDS.forEach(function (f) {
        var raw = $('#fv_' + f.key).val();
        if (raw === '' || raw === null) {
            payload[f.key] = f.num || f.date ? null : null;
        } else if (f.num) {
            payload[f.key] = parseInt(raw, 10);
        } else {
            payload[f.key] = raw;
        }
    });
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '/verifyCaseUpdate.dwf/' + FV.caseId,
        data: payload,
        success: function (res) {
            if (res.status) {
                toastr.success('Case details saved successfully!');
                FV.dirty = false;
                $('#fvUnsaved').hide();
                if (payload.status) $('#fvCaseStatus').text(payload.status);
            } else {
                toastr.error(res.error || 'Save failed');
            }
        },
        error: function () { toastr.error('Save failed'); }
    });
}

/* ---------------- approve / reject ---------------- */

function approveFile() {
    if (!FV.selectedFir) { toastr.error('Select one file !'); return; }
    if (FV.dirty && !confirm('You have unsaved case detail changes. Approve without saving them?')) return;
    if (!confirm('Are you sure you want to Approve this file?')) return;
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
    loadMasters();
    getBatches();
});
