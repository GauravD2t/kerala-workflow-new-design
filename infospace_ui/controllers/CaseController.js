var db = require('../models');
var CaseService = require('../service/CaseService');
var DigitizationApiService = require('../service/DigitizationApiService');
var httpService = require('../service/httpService.js');

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
            casetype: caseDetails.typeName != null ? String(caseDetails.typeName) : null,
            caseno: caseDetails.filNo != null ? String(caseDetails.filNo) : null,
            year: caseDetails.regYear != null ? caseDetails.regYear: null,
            pagecount: 0
        };
        if (req.body.fir && typeof req.body.fir === 'object') {
            Object.assign(firBody, req.body.fir);
            firBody.batch = req.session.batch.id;
            firBody.crn = firBody.crn || caseDetails.cino;
        }
        console.log('firBody.........', firBody);
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


function findFirByCrn(cino) {
    return new Promise(function (resolve) {
        httpService.get(encodeURI("/firs?crn_eq=" + cino), {}, function (node) {
            try {
                node = JSON.parse(node);
                resolve(Array.isArray(node) && node.length ? node[0] : null);
            } catch (e) {
                resolve(null);
            }
        });
    });
}

function CaseController() {
}

var MASTERS = DigitizationApiService.MASTER_RESOURCES;

function filterRows(rows, query) {
    var keys = Object.keys(query).filter(function (k) {
        return query[k] !== undefined && query[k] !== '';
    });
    if (!keys.length) return rows;
    return rows.filter(function (row) {
        return keys.every(function (k) {
            return row[k] !== undefined && String(row[k]) === String(query[k]);
        });
    });
}

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
    if (MASTERS.indexOf(masterName) === -1) {
        return res.send({ success: false, error: 'Unknown master: ' + masterName });
    }
    try {
        var cached = await db.MasterCache.findOne({ where: { master_name: masterName } });
        if (cached && Array.isArray(cached.data) && cached.data.length) {
            return res.send({ success: true, data: filterRows(cached.data, req.query), source: 'cache', synced_at: cached.synced_at });
        }
        var live = await DigitizationApiService.fetchMaster(masterName);
        if (live && live.success && Array.isArray(live.data)) {
            await db.MasterCache.findOrCreate({
                where: { master_name: masterName },
                defaults: { data: live.data, synced_at: new Date() }
            });
            return res.send({ success: true, data: filterRows(live.data, req.query), source: 'live' });
        }
        res.send({ success: true, data: [] });
    } catch (err) {
        console.error('CaseController.master error:', err);
        res.send({ success: false, error: err.message });
    }
};

CaseController.prototype.syncMasters = async function (req, res) {
    try {
        var results = await DigitizationApiService.syncAllMasters(db);
        var failed = results.filter(function (r) { return !r.success; }).length;
        res.send({ status: true, failed: failed, results: results });
    } catch (err) {
        console.error('CaseController.syncMasters error:', err);
        res.send({ status: false, error: err.message });
    }
};

CaseController.prototype.fetchCaseByCino = async function (req, res) {
    try {
        var cino = req.query.cino;
        if (!cino) return res.send({ success: false, error: 'cino query param is required' });
        var data = await DigitizationApiService.fetchCaseByCino(cino);
        res.send(data);
    } catch (err) {
        console.error('CaseController.fetchCaseByCino error:', err);
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

CaseController.prototype.checkFirBundle = async function (req, res) {
    try {
        var cino = req.query.cino;
        if (!cino) return res.send({ status: false, error: 'cino query param is required' });
        var fir = await findFirByCrn(cino);
        res.send({
            status: true,
            data: {
                firId: fir ? fir.id : null,
                bundlenumber: (fir && fir.batch && fir.batch.bundlenumber) ? fir.batch.bundlenumber : null
            }
        });
    } catch (err) {
        console.error('CaseController.checkFirBundle error:', err);
        res.send({ status: false, error: err.message });
    }
};

CaseController.prototype.digitizedEntryByFir = async function (req, res) {
    try {
        var firId = req.query.firId;
        if (!firId) return res.send({ success: false, error: 'firId query param is required' });
        var detail = await CaseService.getCaseByFir(parseInt(firId, 10));
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
        console.error('CaseController.digitizedEntryByFir error:', err);
        res.send({ success: false, error: err.message });
    }
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
