var db = require('../models');
var CaseService = require('../service/CaseService');
var axios = require('axios');
var httpService = require('../service/httpService.js');
var env = process.env.NODE_ENV || 'development';
var config = require('../config/config.js')[env];

function createFir(req, caseDetails) {
    return new Promise(function (resolve, reject) {
        var firBody = {
            inwardstatus: 1,
            imagestatus: -1,
            returnstatus: 0,
            firvalidate: false,
            qcreject: false,
            isupload: false,
            readyforverify: false,
            readyforupload: false,
            secondverify: false,
            thirdverify: false,
            batch: req.session.batch.id,
            crn: caseDetails.cino,
            casetype: caseDetails.caseType != null ? String(caseDetails.caseType) : null,
            caseno: caseDetails.caseNo,
            year: caseDetails.regYear,
            pagecount: 0
        };
        if (req.body.fir && typeof req.body.fir === 'object') {
            Object.assign(firBody, req.body.fir);
            firBody.batch = req.session.batch.id;
            firBody.crn = firBody.crn || caseDetails.cino;
        }
        httpService.post("/firs", firBody, function (node) {
            try {
                var fir = JSON.parse(node.data);
                if (!fir || !fir.id) return reject(new Error('FIR creation failed'));
                resolve(fir);
            } catch (e) {
                reject(e);
            }
        });
    });
}


function CaseController() {
}

var MASTERS = {
    state: { model: 'State', attrs: ['state_id', 'state'] },
    district: { model: 'District', attrs: ['dist_code', 'dist_name'] },
    taluka: { model: 'Taluka', attrs: ['dist_code', 'taluka_code', 'taluka_name'] },
    village: { model: 'Village', attrs: ['dist_code', 'taluka_code', 'village_code', 'village_name'] },
    casetype: { model: 'CaseType', attrs: ['case_type', 'type_name', 'full_form'] },
    ia_casetype: { model: 'IaCaseType', attrs: ['ia_case_type', 'ia_type_name', 'ia_full_form'] },
    purpose: { model: 'Purpose', attrs: ['purpose_code', 'purpose_name'] },
    act: { model: 'ActMaster', attrs: ['actcode', 'actname'] },
    ia_nature: { model: 'IaNature', attrs: ['iacls_code', 'iacls_name'] },
    docutype: { model: 'DocumentType', attrs: ['docu_type', 'docu_name'] },
    police_stn: { model: 'PoliceStationMaster', attrs: ['police_st_code', 'police_st_name'] },
    firtype: { model: 'FirType', attrs: ['fir_type_code', 'fir_type_name'] },
    subject: { model: 'Subject', attrs: ['subject_code', 'subject_name'] },
    advocate: { model: 'Advocate', attrs: ['adv_code', 'adv_name', 'adv_reg'] },
    organization: { model: 'Organization', attrs: ['orgid', 'orgname'] },
    courtdetails: { model: 'CourtMaster', attrs: ['court_no', 'judge_code', 'from_dt', 'to_dt', 'jocode', 'desg_code', 'judge_name'] },
    disposal_nature: { model: 'DisposalNature', attrs: ['disp_type', 'disp_name'] }
};

function parsePayload(req) {
    if (typeof req.body.data === 'string') return JSON.parse(req.body.data);
    return req.body;
}

CaseController.prototype.save = async function (req, res) {
    try {
        var payload = parsePayload(req);
        if (!payload.caseDetails || !payload.caseDetails.cino) {
            return res.send({ status: false, error: 'caseDetails.cino is required' });
        }
        var fir = null;
        if (req.session.batch != null) {
            fir = await createFir(req, payload.caseDetails);
            payload.caseDetails.fir = fir.id;
            
        }
        var detail = await CaseService.saveCase(payload);
        var responseData = detail.toJSON ? detail.toJSON() : detail;
        responseData.fir = fir ? fir.id : payload.caseDetails.fir || null;
        res.send({ status: true, data: responseData });
    } catch (err) {
        console.error('CaseController.save error:', err);
        res.send({ status: false, error: err.message });
    }
};

CaseController.prototype.update = async function (req, res) {
    try {
        var payload = parsePayload(req);
        var detail = await CaseService.updateCase(req.params.id, payload);
        if (!detail) return res.send({ status: false, error: 'Case not found' });
        res.send({ status: true, data: detail });
    } catch (err) {
        console.error('CaseController.update error:', err);
        res.send({ status: false, error: err.message });
    }
};

CaseController.prototype.get = async function (req, res) {
    try {
        var detail = await CaseService.getCaseByCino(req.params.cino);
        if (!detail) return res.send({ status: false, error: 'Case not found' });
        res.send({ status: true, data: detail });
    } catch (err) {
        console.error('CaseController.get error:', err);
        res.send({ status: false, error: err.message });
    }
};

CaseController.prototype.delete = async function (req, res) {
    try {
        await CaseService.deleteCase(req.params.id);
        res.send({ status: true });
    } catch (err) {
        console.error('CaseController.delete error:', err);
        res.send({ status: false, error: err.message });
    }
};

CaseController.prototype.master = async function (req, res) {
    var masterName = req.params.master;
    try {
        var response = await axios.get(config.masterApiBaseUrl + 'api/digitization/master/' + masterName, {
            params: req.query,
            timeout: 15000
        });
        return res.send(response.data);
    } catch (proxyErr) {
        console.warn('Master proxy failed (' + masterName + '):', proxyErr.message, '— falling back to local table');
    }

    try {
        var m = MASTERS[masterName];
        if (!m) return res.send({ success: false, error: 'Unknown master: ' + masterName });
        var filters = {};
        ['dist_code', 'taluka_code', 'state_id', 'case_type'].forEach(function (f) {
            if (req.query[f] !== undefined) filters[f] = req.query[f];
        });
        var data = await db[m.model].findAll({ attributes: m.attrs, where: filters, raw: true });
        res.send({ success: true, data: data });
    } catch (err) {
        console.error('CaseController.master error:', err);
        res.send({ success: false, error: err.message });
    }
};

CaseController.prototype.digitizedEntryPage = function (req, res) {
    res.render('digitizedentry', { title: 'Digitized Entry', locals: res.locals });
};

CaseController.prototype.caseFilingPage = function (req, res) {

    let user = req.session.user;
    httpService.get("/batchesfindOnebycreatedby?created_by_d2=" + parseInt(user.user.id) + "&batchstatus=" + BatchStatusEnum.batchstatus.createbatch, req.body, function (node1) {
        node1 = JSON.parse(node1)
        if (node1.status != false) {
            //Already Exirts
            req.session.batch = { id: node1.id };
            res.render('casefiling', { title: 'Batch Management – Create Batch', batch: node1, locals: res.locals });
        } else {
            //create batch
            req.body.created_by_d2 = user.user.id;
            req.body.islock = true;
            req.body.bundlenumber = "";
            req.body.batchstatus = BatchStatusEnum.batchstatus.createbatch;
            httpService.post("/batches", req.body, function (returnnode) {
                returnnode = JSON.parse(returnnode.data)
                if (returnnode != null) {
                    req.session.batch = { id: returnnode.id };
                    res.render('casefiling', { title: 'Batch Management – Create Batch', batch: returnnode, locals: res.locals });
                } else {
                    res.render('casefiling', { title: 'Batch Management – Create Batch', batch: null, locals: res.locals });
                }
            });
        }
    })


};

CaseController.prototype.digitizedEntry = async function (req, res) {
    try {
        var cino = req.query.cino;
        if (!cino) return res.send({ success: false, error: 'cino query param is required' });
        var detail = await CaseService.getCaseByCino(cino);
        if (!detail) return res.send({ success: false, error: 'Record not found' });
        var json = detail.toJSON();
        res.send({
            success: true,
            data: {
                id: json.id,
                cino: json.cino,
                status: json.status,
                caseDetails: json
            }
        });
    } catch (err) {
        console.error('CaseController.digitizedEntry error:', err);
        res.send({ success: false, error: err.message });
    }
};

module.exports = new CaseController();
