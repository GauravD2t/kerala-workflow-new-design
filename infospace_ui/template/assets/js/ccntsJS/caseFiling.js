var currentCaseId = null;
var additionalSubjects = [];

var CASE_FIELDS = ['efilno', 'dateOfEfiling', 'filNo', 'filYear', 'dateOfFiling', 'dateOfScrutiny',
    'regNo', 'regYear', 'dtRegis', 'typeName', 'caseType', 'status', 'dateFirstList', 'dateNextList',
    'dateLastList', 'dateOfDecision', 'dateFilingDisp', 'dateFilingDispO', 'dispNature', 'courtNo',
    'policeStCode', 'subject', 'caseNo', 'mainCaseNo', 'mainMatterCino'];
var CASE_NUM = ['filNo', 'filYear', 'regNo', 'regYear', 'caseType', 'dispNature', 'courtNo', 'policeStCode', 'subject'];

$(document).ready(function () {
    initMasterSelects();
    initCascades();
    wirePdpToggle();
    $('#cf_cino').keypress(function (e) { if (e.which === 13) searchCase(); });
});

/* ---------------- master dropdowns ---------------- */

function renderLabel(template, row) {
    return template.replace(/\{([^}]+)\}/g, function (m, key) { return row[key] !== undefined ? row[key] : ''; });
}

function loadSelect($el, params, done) {
    var master = $el.data('master');
    axios.get('/api/digitization/master/' + master, { params: params || {} })
        .then(function (res) {
            var valKey = $el.data('val');
            var labelTpl = String($el.data('label'));
            var current = $el.data('keep');
            $el.empty().append('<option value="">Select</option>');
            if (res.data.success && res.data.data) {
                res.data.data.forEach(function (row) {
                    $el.append('<option value="' + row[valKey] + '">' + renderLabel(labelTpl, row) + '</option>');
                });
            }
            if (current !== undefined) { $el.val(current); $el.removeData('keep'); }
            if (done) done();
        })
        .catch(function (err) { console.error('master load failed:', master, err); if (done) done(); });
}

function initMasterSelects() {
    $('select[data-master]').each(function () {
        loadSelect($(this));
    });
}

function initCascades() {
    $('select[data-filter-from]').each(function () {
        var $target = $(this);
        $('#' + $target.data('filter-from')).on('change', function () {
            var filterKey = $target.data('filter-key');
            var params = {};
            params[filterKey] = $(this).val();
            $target.empty().append('<option value="">Select</option>');
            if (params[filterKey] !== '' && params[filterKey] !== null) {
                loadSelect($target, params);
            }
        });
    });
}

/* ---------------- fixed form helpers ---------------- */

function collectPrefix(prefix, fields, numFields, boolFields) {
    var obj = {};
    fields.forEach(function (f) {
        var el = document.getElementById(prefix + f);
        if (!el) return;
        if (boolFields && boolFields.indexOf(f) !== -1) {
            obj[f] = el.checked;
            return;
        }
        var raw = el.value;
        if (raw === '' || raw === undefined) {
            obj[f] = null;
        } else if (numFields && numFields.indexOf(f) !== -1) {
            obj[f] = parseInt(raw, 10);
        } else {
            obj[f] = raw;
        }
    });
    return obj;
}

function fillPrefix(prefix, fields, obj, boolFields) {
    obj = obj || {};
    fields.forEach(function (f) {
        var el = document.getElementById(prefix + f);
        if (!el) return;
        if (boolFields && boolFields.indexOf(f) !== -1) {
            el.checked = !!obj[f];
            return;
        }
        var val = obj[f];
        if (val !== null && val !== undefined && String(el.value) !== String(val)) {
            $(el).data('keep', val);
        }
        el.value = (val === null || val === undefined) ? '' : val;
    });
}

function hasAnyValue(prefix, fields, boolFields) {
    for (var i = 0; i < fields.length; i++) {
        var el = document.getElementById(prefix + fields[i]);
        if (!el) continue;
        if (boolFields && boolFields.indexOf(fields[i]) !== -1) {
            if (el.checked) return true;
        } else if (el.value && el.value !== '') {
            return true;
        }
    }
    return false;
}

/* ---------------- advocate mini-rows ---------------- */

function addAdvRow(tbodyId, data) {
    data = data || {};
    var row = '<tr>' +
        '<td><input type="text" class="form-control form-control-sm adv-name" value="' + (data.name || '') + '"></td>' +
        '<td><input type="text" class="form-control form-control-sm adv-code" value="' + (data.code || '') + '"></td>' +
        '<td><input type="text" class="form-control form-control-sm adv-reg" value="' + (data.regNo || '') + '"></td>' +
        '<td><button type="button" class="btn btn-sm btn-danger" onclick="$(this).closest(\'tr\').remove()">x</button></td>' +
        '</tr>';
    $('#' + tbodyId).append(row);
}

function collectAdvRows(tbodyId) {
    var out = [];
    $('#' + tbodyId + ' tr').each(function () {
        var name = $(this).find('.adv-name').val();
        var code = $(this).find('.adv-code').val();
        var regNo = $(this).find('.adv-reg').val();
        if (name || code || regNo) {
            out.push({ name: name || null, code: code ? parseInt(code, 10) : null, regNo: regNo || null });
        }
    });
    return out;
}

function fillAdvRows(tbodyId, list) {
    $('#' + tbodyId).empty();
    (list || []).forEach(function (a) { addAdvRow(tbodyId, a); });
}

/* ---------------- generic list manager ---------------- */

function collectModalFlat(cfg) {
    var item = {};
    cfg.fields.forEach(function (f) {
        var el = document.getElementById(cfg.prefix + '_' + f);
        if (!el) return;
        if (cfg.num && cfg.num.indexOf(f) !== -1) {
            item[f] = el.value === '' ? null : parseInt(el.value, 10);
        } else if (cfg.bool && cfg.bool.indexOf(f) !== -1) {
            item[f] = el.checked;
        } else {
            item[f] = el.value === '' ? null : el.value;
        }
    });
    return item;
}

function fillModalFlat(cfg, item) {
    cfg.fields.forEach(function (f) {
        var el = document.getElementById(cfg.prefix + '_' + f);
        if (!el) return;
        var val = item ? item[f] : null;
        if (cfg.bool && cfg.bool.indexOf(f) !== -1) {
            el.checked = !!val;
        } else {
            el.value = (val === null || val === undefined) ? '' : val;
        }
    });
}

function makeListManager(cfg) {
    var items = [];

    function renderRows() {
        var html = '';
        items.forEach(function (item, i) {
            html += '<tr>';
            cfg.cols.forEach(function (col) {
                html += '<td>' + (col(item, i) === null || col(item, i) === undefined ? '' : col(item, i)) + '</td>';
            });
            html += '<td>' +
                '<button type="button" class="btn btn-sm btn-light-primary" onclick="LISTS.' + cfg.listKey + '.open(' + i + ')">Edit</button> ' +
                '<button type="button" class="btn btn-sm btn-light-danger" onclick="LISTS.' + cfg.listKey + '.remove(' + i + ')">Del</button>' +
                '</td></tr>';
        });
        $('#' + cfg.tbodyId).html(html);
    }

    return {
        open: function (index) {
            var item = (index === undefined) ? {} : items[index];
            if (cfg.fill) { cfg.fill(item); } else { fillModalFlat(cfg, item); }
            $(cfg.modalId).data('edit-index', (index === undefined) ? -1 : index).modal('show');
        },
        save: function () {
            var flat = collectModalFlat(cfg);
            var item = cfg.build ? cfg.build(flat) : flat;
            if (cfg.validate && !cfg.validate(item)) return;
            var idx = $(cfg.modalId).data('edit-index');
            if (idx === -1 || idx === undefined) { items.push(item); } else { items[idx] = item; }
            $(cfg.modalId).modal('hide');
            renderRows();
        },
        remove: function (i) {
            items.splice(i, 1);
            renderRows();
        },
        getItems: function () { return items.slice(); },
        setItems: function (arr) {
            items = (arr || []).map(cfg.unbuild || function (x) { return x; });
            renderRows();
        },
        clear: function () { items = []; renderRows(); }
    };
}

/* ---------------- list configs ---------------- */

function partyTypeLabel(v) {
    if (String(v) === '1') return 'Petitioner';
    if (String(v) === '2') return 'Respondent';
    return v || '';
}

var LISTS = {
    extraParties: makeListManager({
        listKey: 'extraParties', tbodyId: 'cf_ep_rows', modalId: '#extraPartyModal', prefix: 'cfm_ep',
        fields: ['partyType', 'partyNo', 'partyId', 'isPartyInPerson', 'firstName', 'lastName', 'rank', 'age',
            'dateOfBirth', 'gender', 'email', 'mobile', 'fullAddress', 'pincode', 'villageCode', 'talukaCode',
            'districtCode', 'stateId', 'orgName', 'orgType', 'advName', 'advCode', 'advReg', 'legalHeir',
            'isNameHidden', 'status'],
        num: ['partyType', 'partyNo', 'partyId', 'age', 'villageCode', 'talukaCode', 'districtCode', 'stateId', 'advCode'],
        bool: ['isPartyInPerson', 'isNameHidden'],
        build: function (f) {
            return {
                partyType: f.partyType, partyNo: f.partyNo, partyId: f.partyId, isPartyInPerson: f.isPartyInPerson,
                personalDetails: {
                    firstName: f.firstName, lastName: f.lastName, rank: f.rank, age: f.age,
                    dateOfBirth: f.dateOfBirth, gender: f.gender, email: f.email, mobile: f.mobile
                },
                address: {
                    fullAddress: f.fullAddress, pincode: f.pincode, villageCode: f.villageCode,
                    talukaCode: f.talukaCode, districtCode: f.districtCode, stateId: f.stateId
                },
                organizationDetails: { name: f.orgName, type: f.orgType },
                advocate: { name: f.advName, code: f.advCode, regNo: f.advReg },
                legalHeir: f.legalHeir, isNameHidden: f.isNameHidden, status: f.status || 'Y'
            };
        },
        fill: function (item) {
            var p = item.personalDetails || {};
            var a = item.address || {};
            var o = item.organizationDetails || {};
            var adv = item.advocate || {};
            var flat = {
                partyType: item.partyType, partyNo: item.partyNo, partyId: item.partyId,
                isPartyInPerson: item.isPartyInPerson,
                firstName: p.firstName, lastName: p.lastName, rank: p.rank, age: p.age,
                dateOfBirth: p.dateOfBirth, gender: p.gender, email: p.email, mobile: p.mobile,
                fullAddress: a.fullAddress, pincode: a.pincode, villageCode: a.villageCode,
                talukaCode: a.talukaCode, districtCode: a.districtCode, stateId: a.stateId,
                orgName: o.name, orgType: o.type,
                advName: adv.name, advCode: adv.code, advReg: adv.regNo,
                legalHeir: item.legalHeir, isNameHidden: item.isNameHidden, status: item.status || 'Y'
            };
            fillModalFlat(LISTS_CONFIG_EXTRA_FLAT, flat);
        },
        unbuild: function (row) {
            return {
                partyType: row.partyType, partyNo: row.partyNo, partyId: row.partyId, isPartyInPerson: row.isPartyInPerson,
                personalDetails: {
                    firstName: row.firstName, lastName: row.lastName, rank: row.rank, age: row.age,
                    dateOfBirth: row.dateOfBirth, gender: row.gender, email: row.email, mobile: row.mobile
                },
                address: {
                    fullAddress: row.fullAddress, pincode: row.pincode, villageCode: row.villageCode,
                    talukaCode: row.talukaCode, districtCode: row.districtCode, stateId: row.stateId
                },
                organizationDetails: { name: row.orgName, type: row.orgType },
                advocate: { name: row.advName, code: row.advCode, regNo: row.advReg },
                legalHeir: row.legalHeir, isNameHidden: row.isNameHidden, status: row.status || 'Y'
            };
        },
        cols: [
            function (it) { return it.partyNo; },
            function (it) { return partyTypeLabel(it.partyType); },
            function (it) { var p = it.personalDetails || {}; return ((p.firstName || '') + ' ' + (p.lastName || '')).trim(); },
            function (it) { return (it.personalDetails || {}).mobile; },
            function (it) { return it.status; }
        ]
    }),

    additionalAdvocates: makeListManager({
        listKey: 'additionalAdvocates', tbodyId: 'cf_aa_rows', modalId: '#additionalAdvocateModal', prefix: 'cfm_aa',
        fields: ['partyNo', 'partyId', 'partyType'],
        num: ['partyNo', 'partyId', 'partyType'],
        build: function (f) {
            return { partyNo: f.partyNo, partyId: f.partyId, partyType: f.partyType, advocates: collectAdvRows('cfm_aa_adv_rows') };
        },
        fill: function (item) {
            fillModalFlat({ prefix: 'cfm_aa', fields: ['partyNo', 'partyId', 'partyType'] }, item);
            fillAdvRows('cfm_aa_adv_rows', item ? item.advocates : []);
        },
        unbuild: function (row) { return row; },
        cols: [
            function (it) { return it.partyNo; },
            function (it) { return it.partyId; },
            function (it) { return partyTypeLabel(it.partyType); },
            function (it) { return (it.advocates || []).map(function (a) { return a.name; }).join(', '); }
        ]
    }),

    witnesses: makeListManager({
        listKey: 'witnesses', tbodyId: 'cf_wit_rows', modalId: '#witnessModal', prefix: 'cfm_wit',
        fields: ['partyNo', 'witnessNo', 'witnessFlag', 'benchWitnessType', 'benchWitnessNo', 'witnessName',
            'address', 'stateCode', 'districtCode', 'talukCode', 'villageCode', 'age', 'mobile', 'email',
            'fatherName', 'pincode', 'hideParty'],
        num: ['partyNo', 'witnessNo', 'witnessFlag', 'benchWitnessNo', 'stateCode', 'districtCode', 'talukCode', 'villageCode', 'age', 'pincode'],
        build: function (f) {
            f.advocates = collectAdvRows('cfm_wit_adv_rows');
            return f;
        },
        fill: function (item) {
            fillModalFlat(LISTS.witnesses._cfg, item);
            fillAdvRows('cfm_wit_adv_rows', item ? item.advocates : []);
        },
        cols: [
            function (it) { return it.witnessNo; },
            function (it) { return it.witnessFlag; },
            function (it) { return it.witnessName; },
            function (it) { return it.age; },
            function (it) { return it.mobile; }
        ]
    }),

    victims: makeListManager({
        listKey: 'victims', tbodyId: 'cf_vic_rows', modalId: '#victimModal', prefix: 'cfm_vic',
        fields: ['partyNo', 'victimName', 'address', 'districtCode', 'talukCode', 'villageCode', 'age',
            'mobile', 'email', 'pincode', 'hideParty'],
        num: ['partyNo', 'districtCode', 'talukCode', 'villageCode', 'age', 'pincode'],
        build: function (f) {
            f.advocates = collectAdvRows('cfm_vic_adv_rows');
            return f;
        },
        fill: function (item) {
            fillModalFlat({ prefix: 'cfm_vic', fields: ['partyNo', 'victimName', 'address', 'districtCode', 'talukCode', 'villageCode', 'age', 'mobile', 'email', 'pincode', 'hideParty'] }, item);
            fillAdvRows('cfm_vic_adv_rows', item ? item.advocates : []);
        },
        cols: [
            function (it) { return it.partyNo; },
            function (it) { return it.victimName; },
            function (it) { return it.age; },
            function (it) { return it.mobile; }
        ]
    }),

    acts: makeListManager({
        listKey: 'acts', tbodyId: 'cf_act_rows', modalId: '#actModal', prefix: 'cfm_act',
        fields: ['actcode', 'section'],
        num: ['actcode'],
        cols: [
            function (it) { return it.actcode; },
            function (it) { return it.section; }
        ]
    }),

    iaFilings: makeListManager({
        listKey: 'iaFilings', tbodyId: 'cf_ia_rows', modalId: '#iaModal', prefix: 'cfm_ia',
        fields: ['iaType', 'iaNumber', 'iaYear', 'iaNature', 'filingDate', 'applicantName', 'applicantAdvocate',
            'respondentName', 'respondentAdvocate', 'documentPath', 'status', 'dateOfDecision', 'nextdate'],
        num: ['iaType', 'iaYear', 'iaNature', 'applicantAdvocate', 'respondentAdvocate'],
        cols: [
            function (it) { return (it.iaNumber || '') + '/' + (it.iaYear || ''); },
            function (it) { return it.iaType; },
            function (it) { return it.iaNature; },
            function (it) { return it.filingDate; },
            function (it) { return it.status; }
        ]
    }),

    caseHistories: makeListManager({
        listKey: 'caseHistories', tbodyId: 'cf_ch_rows', modalId: '#caseHistoryModal', prefix: 'cfm_ch',
        fields: ['courtNo', 'judgeCode', 'jocode', 'desgCode', 'hearingDate', 'nextdate', 'purposeCode',
            'businessOnDate', 'remarks', 'disposal', 'decisionDate', 'contestedUnContested', 'disposalNature',
            'dormantSineDie', 'admissionStageDisposed', 'witnessCount'],
        num: ['courtNo', 'judgeCode', 'desgCode', 'purposeCode', 'disposalNature', 'witnessCount'],
        build: function (f) {
            if (document.getElementById('cfm_ch_pdp_enable').checked) {
                f.postDisposalProceedings = collectModalFlat({
                    prefix: 'cfm_ch_pdp',
                    fields: ['orderRemark', 'nextDate', 'todaysDate', 'courtNo', 'judgeCode', 'jocode', 'desgCode'],
                    num: ['courtNo', 'judgeCode', 'desgCode']
                });
            } else {
                f.postDisposalProceedings = null;
            }
            return f;
        },
        fill: function (item) {
            fillModalFlat({ prefix: 'cfm_ch', fields: LISTS.caseHistories._cfgFields }, item);
            var pdp = item ? item.postDisposalProceedings : null;
            document.getElementById('cfm_ch_pdp_enable').checked = !!pdp;
            $('#cfm_ch_pdp_block').toggle(!!pdp);
            fillModalFlat({
                prefix: 'cfm_ch_pdp',
                fields: ['orderRemark', 'nextDate', 'todaysDate', 'courtNo', 'judgeCode', 'jocode', 'desgCode']
            }, pdp || {});
        },
        cols: [
            function (it) { return it.hearingDate; },
            function (it) { return it.nextdate; },
            function (it) { return it.purposeCode; },
            function (it) { return it.disposal; },
            function (it) { return it.judgeCode; }
        ]
    }),

    iaHistories: makeListManager({
        listKey: 'iaHistories', tbodyId: 'cf_iah_rows', modalId: '#iaHistoryModal', prefix: 'cfm_iah',
        fields: ['courtNo', 'judgeCode', 'jocode', 'desgCode', 'iaNumber', 'hearingDate', 'nextdate',
            'purposeCode', 'businessOnDate', 'remarks', 'disposal', 'decisionDate', 'contestedUnContested',
            'disposalNature', 'dormantSineDie'],
        num: ['courtNo', 'judgeCode', 'desgCode', 'purposeCode', 'disposalNature'],
        cols: [
            function (it) { return it.iaNumber; },
            function (it) { return it.hearingDate; },
            function (it) { return it.nextdate; },
            function (it) { return it.disposal; }
        ]
    }),

    documents: makeListManager({
        listKey: 'documents', tbodyId: 'cf_doc_rows', modalId: '#documentModal', prefix: 'cfm_doc',
        fields: ['partyNo', 'partyType', 'documentType', 'documentName', 'documentTitle', 'description',
            'remarks', 'documentPath', 'advReg', 'advCode', 'filedDate', 'documentOrder', 'fileSize', 'fileExtension'],
        num: ['partyNo', 'documentType', 'advCode', 'documentOrder', 'fileSize'],
        cols: [
            function (it) { return it.documentOrder; },
            function (it) { return it.partyType; },
            function (it) { return it.documentName; },
            function (it) { return it.filedDate; },
            function (it) { return it.documentPath; }
        ]
    }),

    orderDetails: makeListManager({
        listKey: 'orderDetails', tbodyId: 'cf_ord_rows', modalId: '#orderModal', prefix: 'cfm_ord',
        fields: ['documentType', 'orderDate', 'documentPath', 'judgeCode', 'jocode', 'iaNumber', 'iaType'],
        num: ['documentType', 'judgeCode', 'iaType'],
        cols: [
            function (it) { return it.orderDate; },
            function (it) { return it.documentType; },
            function (it) { return it.iaNumber; },
            function (it) { return it.documentPath; }
        ]
    })
};

var LISTS_CONFIG_EXTRA_FLAT = {
    prefix: 'cfm_ep',
    fields: ['partyType', 'partyNo', 'partyId', 'isPartyInPerson', 'firstName', 'lastName', 'rank', 'age',
        'dateOfBirth', 'gender', 'email', 'mobile', 'fullAddress', 'pincode', 'villageCode', 'talukaCode',
        'districtCode', 'stateId', 'orgName', 'orgType', 'advName', 'advCode', 'advReg', 'legalHeir',
        'isNameHidden', 'status'],
    bool: ['isPartyInPerson', 'isNameHidden']
};

LISTS.witnesses._cfg = { prefix: 'cfm_wit', fields: LISTS.witnesses ? [] : [] };
LISTS.witnesses._cfg.fields = ['partyNo', 'witnessNo', 'witnessFlag', 'benchWitnessType', 'benchWitnessNo',
    'witnessName', 'address', 'stateCode', 'districtCode', 'talukCode', 'villageCode', 'age', 'mobile',
    'email', 'fatherName', 'pincode', 'hideParty'];
LISTS.caseHistories._cfgFields = ['courtNo', 'judgeCode', 'jocode', 'desgCode', 'hearingDate', 'nextdate',
    'purposeCode', 'businessOnDate', 'remarks', 'disposal', 'decisionDate', 'contestedUnContested',
    'disposalNature', 'dormantSineDie', 'admissionStageDisposed', 'witnessCount'];

/* ---------------- additional subject chips ---------------- */

function addSubjectChip() {
    var code = $('#cf_as_input').val();
    if (!code) return;
    if (additionalSubjects.indexOf(code) !== -1) {
        toastr.warning('Subject already added');
        return;
    }
    additionalSubjects.push(code);
    renderSubjectChips();
    $('#cf_as_input').val('');
}

function renderSubjectChips() {
    var html = '';
    additionalSubjects.forEach(function (code, i) {
        var label = $('#cf_as_input option[value="' + code + '"]').text() || code;
        html += '<span class="label label-inline label-light-primary font-weight-bold mr-2 p-3">' + label +
            ' <a href="javascript:void(0)" onclick="removeSubjectChip(' + i + ')">x</a></span>';
    });
    $('#cf_as_chips').html(html);
}

function removeSubjectChip(i) {
    additionalSubjects.splice(i, 1);
    renderSubjectChips();
}

/* ---------------- PDP toggle ---------------- */

function wirePdpToggle() {
    $(document).on('change', '#cfm_ch_pdp_enable', function () {
        $('#cfm_ch_pdp_block').toggle(this.checked);
    });
}

/* ---------------- fixed sections ---------------- */

var PET_FIELDS = ['name', 'address', 'mobileNumber', 'legalHeir', 'advName', 'advCode', 'advReg'];
var PET_BOOL = ['isPartyInPerson', 'isHidden'];
var RES_FIELDS = PET_FIELDS;
var OP_FIELDS = ['otherPartyId', 'otherPartyNo', 'orgId', 'partyName', 'address', 'age', 'mobile', 'email',
    'pincode', 'stateId', 'districtCode', 'talukCode', 'villageCode', 'hideParty', 'display'];
var OP_NUM = ['otherPartyId', 'otherPartyNo', 'orgId', 'age', 'pincode', 'stateId', 'districtCode', 'talukCode', 'villageCode'];
var CAV_FIELDS = ['caveatNumber', 'caveatfilNo', 'subject', 'dtRegis', 'dtFiling', 'caveatorName',
    'caveatorOrgName', 'caveateeeName', 'caveateeOrgName'];
var CAV_NUM = ['subject', 'caveatorOrgName', 'caveateeOrgName'];
var FACT_FIELDS = ['factOfCause', 'dateTimeOfFact', 'issueReportedAt'];
var COA_FIELDS = ['dateOfCause', 'state', 'district', 'taluka', 'village', 'policeStationCode'];
var COA_NUM = ['state', 'district', 'taluka', 'village', 'policeStationCode'];
var CRIME_FIELDS = ['crno', 'firNo', 'firTypeCode', 'firYear', 'firDate', 'policeStName', 'policeStCode',
    'state', 'district', 'taluka', 'investofficer', 'rank', 'occurrenceDatetime', 'placeOfOccurrence',
    'detailsOfIncident', 'dateOfFilingChargesheet', 'chargesheetReceivedDate', 'subsequentDocType',
    'subsequentDocReceivedDate'];
var CRIME_NUM = ['firTypeCode', 'firYear'];
var PP_FIELDS = ['complainantName', 'complainantAdvocate', 'accusedName', 'accusedAdvocate',
    'complainantOtherPresentee', 'accusedOtherPresentee'];
var TCD_FIELDS = ['caseType', 'caseTypeNo', 'caseNumber', 'caseYear', 'lcourtName', 'courtCode', 'lcnrNumber',
    'dateOfDecision', 'certifiedCopyAppliedDate', 'certifiedCopyReadyDate', 'certifiedCopyReceivedDate'];
var TCD_NUM = ['caseTypeNo', 'caseYear'];
var TD_FIELDS = ['mainCaseType', 'mainCaseNumber', 'mainCaseYear', 'transfereeCourtName', 'transfereeCourtCode',
    'transfereeCourtCnr', 'transfereeLastPosting', 'transferorCourtName', 'transferorCourtCode',
    'transferorCourtCnr', 'transferorLastPosting'];
var TD_NUM = ['mainCaseYear', 'transfereeCourtCode', 'transferorCourtCode'];

function buildParty(prefix) {
    var fields = PET_FIELDS.concat(PET_BOOL);
    var obj = collectPrefix(prefix, fields, ['advCode'], PET_BOOL);
    return {
        name: obj.name, address: obj.address, isPartyInPerson: obj.isPartyInPerson,
        mobileNumber: obj.mobileNumber, isHidden: obj.isHidden, legalHeir: obj.legalHeir,
        advocate: { name: obj.advName, code: obj.advCode, regNo: obj.advReg }
    };
}

function fillParty(prefix, item) {
    item = item || {};
    var adv = item.advocate || {};
    fillPrefix(prefix, PET_FIELDS.concat(PET_BOOL), {
        name: item.name, address: item.address, mobileNumber: item.mobileNumber,
        legalHeir: item.legalHeir, advName: adv.name, advCode: adv.code, advReg: adv.regNo,
        isPartyInPerson: item.isPartyInPerson, isHidden: item.isHidden
    }, PET_BOOL);
}

/* ---------------- search / populate / save ---------------- */

function searchCase() {
    var cino = $('#cf_cino').val().trim();
    if (!cino) { toastr.warning('Enter CINO number'); return; }
    $('#cf_search_spinner').show();
    axios.get('/api/digitization/digitizedEntry', { params: { cino: cino } })
        .then(function (res) {
            if (res.data.success && res.data.data) {
                currentCaseId = res.data.data.id;
                populateAll(res.data.data.caseDetails);
                showStatusBadge(res.data.data.status);
                toastr.success('Record loaded');
            } else {
                toastr.info(res.data.error === 'Record not found'
                    ? 'Record not found. Fill in the tabs and Save All to create a new entry.'
                    : (res.data.error || 'Search failed'));
                clearAll(false);
            }
        })
        .catch(function (err) { console.error('searchCase error:', err); toastr.error('Search failed'); })
        .finally(function () { $('#cf_search_spinner').hide(); });
}

function showStatusBadge(status) {
    var badge = $('#cf_status_badge');
    if (!status) { badge.hide(); return; }
    var cls = status === 'Disposed' ? 'label-light-danger' : (status === 'Pending' ? 'label-light-warning' : 'label-light-info');
    badge.removeClass('label-light-info label-light-warning label-light-danger').addClass(cls)
        .text('Status: ' + status).show();
}

function populateAll(json) {
    json = json || {};
    fillPrefix('cf_cd_', CASE_FIELDS, json);

    additionalSubjects = (json.additional_subjects || []).map(function (r) { return String(r.subjectcode); });
    renderSubjectChips();

    var mains = json.main_parties || [];
    fillParty('cf_pet_', mains.filter(function (m) { return m.partytype === 1; })[0]);
    fillParty('cf_res_', mains.filter(function (m) { return m.partytype === 2; })[0]);

    LISTS.extraParties.setItems(json.extra_parties);

    var aa = {};
    (json.additional_advocates || []).forEach(function (r) {
        var key = r.partyNo + '_' + r.partyId + '_' + r.partyType;
        if (!aa[key]) aa[key] = { partyNo: r.partyNo, partyId: r.partyId, partyType: r.partyType, advocates: [] };
        aa[key].advocates.push({ name: r.advName, code: r.advCode, regNo: r.advReg });
    });
    LISTS.additionalAdvocates.setItems(Object.keys(aa).map(function (k) { return aa[k]; }));

    LISTS.witnesses.setItems(json.witnesses);
    LISTS.victims.setItems(json.victims);

    var cav = (json.caveats || [])[0];
    fillPrefix('cf_cav_', CAV_FIELDS, cav || {});

    LISTS.acts.setItems(json.case_acts);

    fillPrefix('cf_fact_', FACT_FIELDS, (json.fact_details || [])[0] || {});
    fillPrefix('cf_coa_', COA_FIELDS, (json.cause_of_actions || [])[0] || {});
    fillPrefix('cf_crime_', CRIME_FIELDS, (json.crime_details || [])[0] || {});

    LISTS.iaFilings.setItems(json.ia_filings);
    LISTS.caseHistories.setItems(json.case_histories);
    LISTS.iaHistories.setItems(json.ia_histories);

    fillPrefix('cf_pp_', PP_FIELDS, (json.proceedings_presences || [])[0] || {});

    LISTS.documents.setItems(json.case_documents);
    LISTS.orderDetails.setItems(json.order_details);

    fillPrefix('cf_tcd_', TCD_FIELDS, (json.trial_court_details || [])[0] || {});
    fillPrefix('cf_td_', TD_FIELDS, (json.transfer_details || [])[0] || {});

    var op = json.other_parties || [];
    var opRow = op[0] || null;
    if (opRow) {
        fillPrefix('cf_op_', OP_FIELDS, opRow);
        fillAdvRows('cf_op_adv_rows', opRow.advocates);
    } else {
        fillPrefix('cf_op_', OP_FIELDS, {});
        fillAdvRows('cf_op_adv_rows', []);
    }
}

function buildPayload() {
    var payload = {};

    var caseDetails = collectPrefix('cf_cd_', CASE_FIELDS, CASE_NUM);
    caseDetails.cino = $('#cf_cino').val().trim();
    payload.caseDetails = caseDetails;

    payload.additionalSubjects = additionalSubjects.map(function (code) {
        return { subjectcode: parseInt(code, 10) };
    });

    payload.mainparties = {
        petitioner: buildParty('cf_pet_'),
        respondent: buildParty('cf_res_')
    };

    payload.extraParties = LISTS.extraParties.getItems();
    payload.additionalAdvocates = LISTS.additionalAdvocates.getItems();
    payload.witnesses = LISTS.witnesses.getItems();
    payload.victims = LISTS.victims.getItems();

    if (hasAnyValue('cf_cav_', CAV_FIELDS.filter(function (f) { return ['caveatNumber', 'caveatorName'].indexOf(f) !== -1; }))) {
        payload.caveats = [collectPrefix('cf_cav_', CAV_FIELDS, CAV_NUM)];
    } else {
        payload.caveats = [];
    }

    payload.acts = LISTS.acts.getItems();

    if (hasAnyValue('cf_fact_', FACT_FIELDS)) payload.factDetail = collectPrefix('cf_fact_', FACT_FIELDS);
    if (hasAnyValue('cf_coa_', COA_FIELDS)) payload.causeofaction = collectPrefix('cf_coa_', COA_FIELDS, COA_NUM);
    if (hasAnyValue('cf_crime_', CRIME_FIELDS)) payload.crimeDetails = collectPrefix('cf_crime_', CRIME_FIELDS, CRIME_NUM);

    payload.iaFilings = LISTS.iaFilings.getItems();
    payload.caseHistories = LISTS.caseHistories.getItems();
    payload.iaHistories = LISTS.iaHistories.getItems();

    if (hasAnyValue('cf_pp_', PP_FIELDS)) payload.proceedingsPresence = collectPrefix('cf_pp_', PP_FIELDS);

    payload.documents = LISTS.documents.getItems();
    payload.orderDetails = LISTS.orderDetails.getItems();

    if (hasAnyValue('cf_tcd_', TCD_FIELDS)) payload.trialCourtDetail = collectPrefix('cf_tcd_', TCD_FIELDS, TCD_NUM);
    if (hasAnyValue('cf_td_', TD_FIELDS)) payload.transferDetail = collectPrefix('cf_td_', TD_FIELDS, TD_NUM);

    if (hasAnyValue('cf_op_', OP_FIELDS)) {
        var op = collectPrefix('cf_op_', OP_FIELDS, OP_NUM);
        op.advocates = collectAdvRows('cf_op_adv_rows');
        payload.otherParty = op;
    }

    return payload;
}

function saveAll() {
    var payload = buildPayload();
    if (!payload.caseDetails.cino) { toastr.warning('CINO is required'); return; }
    $('#cf_save_btn, #cf_save_top').prop('disabled', true);

    var request = currentCaseId
        ? axios.put('/caseUpdate.dwf/' + currentCaseId, payload)
        : axios.post('/caseSave.dwf', payload);

    request
        .then(function (res) {
            if (res.data.status) {
                currentCaseId = res.data.data.id || currentCaseId;
                showStatusBadge(payload.caseDetails.status || 'Draft');
                toastr.success('Case saved successfully.');
            } else {
                toastr.error(res.data.error || 'Save failed');
            }
        })
        .catch(function (err) { console.error('saveAll error:', err); toastr.error('Save failed'); })
        .finally(function () { $('#cf_save_btn, #cf_save_top').prop('disabled', false); });
}

/* ---------------- reset ---------------- */

function clearAll(clearCino) {
    if (clearCino !== false) $('#cf_cino').val('');
    currentCaseId = null;
    showStatusBadge(null);
    fillPrefix('cf_cd_', CASE_FIELDS, {});
    additionalSubjects = [];
    renderSubjectChips();
    fillParty('cf_pet_', null);
    fillParty('cf_res_', null);
    fillPrefix('cf_op_', OP_FIELDS, {});
    fillAdvRows('cf_op_adv_rows', []);
    fillPrefix('cf_cav_', CAV_FIELDS, {});
    fillPrefix('cf_fact_', FACT_FIELDS, {});
    fillPrefix('cf_coa_', COA_FIELDS, {});
    fillPrefix('cf_crime_', CRIME_FIELDS, {});
    fillPrefix('cf_pp_', PP_FIELDS, {});
    fillPrefix('cf_tcd_', TCD_FIELDS, {});
    fillPrefix('cf_td_', TD_FIELDS, {});
    ['extraParties', 'additionalAdvocates', 'witnesses', 'victims', 'acts', 'iaFilings',
        'caseHistories', 'iaHistories', 'documents', 'orderDetails'].forEach(function (k) {
        LISTS[k].clear();
    });
}

function resetAll() {
    clearAll(true);
    toastr.info('Form cleared');
}
