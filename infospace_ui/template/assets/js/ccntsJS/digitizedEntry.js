var currentCaseId = null;

var DE_FIELDS = [
    'efilno', 'dateOfEfiling', 'filNo', 'filYear', 'dateOfFiling', 'dateOfScrutiny',
    'regNo', 'regYear', 'dtRegis', 'typeName', 'caseType', 'status',
    'dateFirstList', 'dateNextList', 'dateLastList', 'dateOfDecision',
    'dateFilingDisp', 'dateFilingDispO', 'dispNature', 'courtNo',
    'policeStCode', 'subject', 'caseNo', 'mainCaseNo', 'mainMatterCino'
];

var DE_NUM_FIELDS = ['filNo', 'filYear', 'regNo', 'regYear', 'caseType', 'dispNature', 'courtNo', 'policeStCode', 'subject'];

$(document).ready(function () {
    loadMasterDropdown('casetype', 'de_caseType', 'case_type', function (x) {
        return x.type_name + ' - ' + x.full_form;
    });
    loadMasterDropdown('subject', 'de_subject', 'subject_code', function (x) {
        return x.subject_name;
    });
    $('#de_cino').keypress(function (e) {
        if (e.which === 13) searchByCino();
    });
});

function loadMasterDropdown(master, elementId, valueKey, labelFn) {
    axios.get('/api/digitization/master/' + master)
        .then(function (res) {
            var $el = $('#' + elementId);
            $el.empty().append('<option value="">Select</option>');
            if (res.data.success) {
                res.data.data.forEach(function (row) {
                    $el.append('<option value="' + row[valueKey] + '">' + labelFn(row) + '</option>');
                });
            }
        })
        .catch(function (err) {
            console.error('master load failed:', master, err);
        });
}

function searchByCino() {
    var cino = $('#de_cino').val().trim();
    if (!cino) {
        toastr.warning('Enter CINO number');
        return;
    }
    $('#de_search_spinner').show();
    axios.get('/api/digitization/digitizedEntry', { params: { cino: cino } })
        .then(function (res) {
            if (res.data.success && res.data.data) {
                currentCaseId = res.data.data.id;
                populateForm(res.data.data.caseDetails);
                showStatusBadge(res.data.data.status);
                toastr.success('Record found');
            } else {
                currentCaseId = null;
                resetFormFields();
                showStatusBadge(null);
                toastr.info((res.data.error || 'Record not found') + '. Fill in the details and Save to create a new entry.');
            }
            $('#de_form_area').show();
        })
        .catch(function (err) {
            console.error('searchByCino error:', err);
            toastr.error('Search failed');
        })
        .finally(function () {
            $('#de_search_spinner').hide();
        });
}

function populateForm(caseDetails) {
    DE_FIELDS.forEach(function (f) {
        var val = caseDetails[f];
        $('#de_' + f).val(val === null || val === undefined ? '' : val);
    });
}

function showStatusBadge(status) {
    var $badge = $('#de_status_badge');
    if (!status) {
        $badge.hide();
        return;
    }
    var cls = status === 'Disposed' ? 'label-light-danger' : (status === 'Pending' ? 'label-light-warning' : 'label-light-info');
    $badge.removeClass('label-light-info label-light-warning label-light-danger')
        .addClass(cls)
        .text('Status: ' + status)
        .show();
}

function resetFormFields() {
    DE_FIELDS.forEach(function (f) {
        $('#de_' + f).val('');
    });
    $('#de_status').val('Draft');
}

function resetEntryForm() {
    resetFormFields();
    currentCaseId = null;
    $('#de_cino').val('').focus();
    showStatusBadge(null);
    $('#de_form_area').hide();
}

function collectFormData() {
    var caseDetails = { cino: $('#de_cino').val().trim() };
    DE_FIELDS.forEach(function (f) {
        var raw = $('#de_' + f).val();
        if (raw === '' || raw === null || raw === undefined) {
            caseDetails[f] = null;
        } else if (DE_NUM_FIELDS.indexOf(f) !== -1) {
            caseDetails[f] = parseInt(raw, 10);
        } else {
            caseDetails[f] = raw;
        }
    });
    return caseDetails;
}

function saveEntry() {
    var caseDetails = collectFormData();
    if (!caseDetails.cino) {
        toastr.warning('CINO is required');
        return;
    }
    $('#de_save_btn').prop('disabled', true);

    var request;
    if (currentCaseId) {
        request = axios.put('/caseUpdate.dwf/' + currentCaseId, { caseDetails: caseDetails });
    } else {
        request = axios.post('/caseSave.dwf', { caseDetails: caseDetails });
    }

    request
        .then(function (res) {
            if (res.data.status) {
                currentCaseId = res.data.data.id || currentCaseId;
                showStatusBadge(caseDetails.status || 'Draft');
                toastr.success(currentCaseId ? 'Case details saved successfully.' : 'Case created successfully.');
            } else {
                toastr.error(res.data.error || 'Save failed');
            }
        })
        .catch(function (err) {
            console.error('saveEntry error:', err);
            toastr.error('Save failed');
        })
        .finally(function () {
            $('#de_save_btn').prop('disabled', false);
        });
}
