var httpService = require('../service/httpService.js')
var db = require('../models');
var moment = require('moment');
var fs = require('fs');
const path = require('path');
var CIPAService = require("../service/CIPAService");


function ReadyForverifyController() {
}
ReadyForverifyController.prototype.readyforverify = function (req, res) {
    // console.log(res.locals)
    res.render('firstforverify', { title: 'Document Verify', locals: res.locals });
}
ReadyForverifyController.prototype.getbstchesforvirfyReady = function (req, res) {

    var dc = req.session.user && req.session.user.user && req.session.user.user.digitizationcenter
        ? req.session.user.user.digitizationcenter.id : null;
    var query;
    if (dc) {
        query = 'select b.id,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join "users-permissions_user" u on u.id=b.created_by_d2 where u.digitizationcenter=' + dc + ' and f.imagestatus=5 and readyforverify=false  group by b.id,b.bundlenumber order by b.bundlenumber';
    } else {
        query = 'select b.id,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch where f.imagestatus=5 and readyforverify=false group by b.id,b.bundlenumber order by b.bundlenumber';
    }
    CIPAService.executeSQL(query, function (batchdata) {
        var resultbat = batchdata[0];
        res.send({ status: true, data: resultbat });
    })


}

ReadyForverifyController.prototype.findFIrsbybathcReadyforVerify = function (req, res) {
    // console.log("===============", req.body.selectedBatch)
    // console.log("****************", req.body.selectedBatch.toString())
    var query = "select * from firs where imagestatus=5 and readyforverify=false and batch in(" + req.query.batch + " ) ";

    CIPAService.executeSQL(query, function (batchdata) {
        var resultbat = batchdata[0];
        res.send({ status: true, data: resultbat });
    })
    // httpService.get("/firs?imagestatus=5&readyforverify=false&batch=" + req.query.batch + "&_limit=-1", req.body, function (node1) {
    //     res.send({ status: true, data: JSON.parse(node1) });
    // })
}
ReadyForverifyController.prototype.bulkReadyForVerify = async function (req, res) {
if(req.session.user.user.id==89 || req.session.user.user.id=='89'){
            res.send({ status: false });
}else{
      var deletequery = "update firs set imagestatus=" + req.body.imagestatus + ",first_verify_at=NOW(),first_verify_by=" + req.session.user.user.id + ",readyforverify=true where id in (" + req.body.selectedfile.toString() + ")";
    console.log(deletequery)
    CIPAService.UpdateexecuteSQL(deletequery, function (data) {
        if (data != null) {
            res.send({ status: true });
        } else {
            res.send({ status: false });
        }
    })
}
  

}
ReadyForverifyController.prototype.bulkReadyForVerifyReject = async function (req, res) {

    var deletequery = "update firs set first_verify_at=NOW(),first_verify_by=" + req.session.user.user.id + ",imagestatus=" + req.body.imagestatus + ",readyforverify=false,verifyremarks='" + req.body.Verifyremarks + "' where id in (" + req.body.selectedfile.toString() + ")";
   
    letfldid = req.body.selectedfile.toString().split(",")[0];
    
    httpService.get("/firs/" + letfldid, req.body, function (node1) {
        let firdata = JSON.parse(node1);

        queryinsert = "INSERT INTO filereturnlogs(fir, users_by, action_at, pagecount, fromstage, tostage,remarks,pdfcount,scancount,qccount,metadatacount) VALUES (" + letfldid + "," + req.session.user.user.id + ",now()," + firdata.classficationpagecount + ",'IM Rejected','Scan','" + req.body.Verifyremarks + "'," + firdata.pdfpagecount + "," + firdata.scanpagecount + "," + firdata.qcpagecount + "," + firdata.metadatapage +")";
        console.log("queryinsert.............", queryinsert)
        CIPAService.InsertexecuteSQL(queryinsert, function (batchdata) {
            CIPAService.UpdateexecuteSQL(deletequery, function (data) {
                if (data != null) {
                    res.send({ status: true });
                } else {
                    res.send({ status: false });
                }
            })
        })
    })

}

var VERIFY_EDIT_FIELDS = ['efilno', 'dateOfEfiling', 'filNo', 'filYear', 'dateOfFiling', 'dateOfScrutiny',
    'regNo', 'regYear', 'dtRegis', 'caseType', 'typeName', 'status', 'dateFirstList', 'dateNextList',
    'dateLastList', 'dateOfDecision', 'dateFilingDisp', 'dateFilingDispO', 'dispNature', 'courtNo',
    'policeStCode', 'subject', 'caseNo', 'mainCaseNo', 'mainMatterCino'];

ReadyForverifyController.prototype.updateCaseDetail = async function (req, res) {
    try {
        var id = parseInt(req.params.id, 10);
        if (!id) return res.send({ status: false, error: 'Case id is required' });
        var fields = req.body || {};
        var data = {};
        VERIFY_EDIT_FIELDS.forEach(function (f) {
            if (fields[f] !== undefined) data[f] = (fields[f] === '' || fields[f] === 'null') ? null : fields[f];
        });
        if (!Object.keys(data).length) return res.send({ status: false, error: 'Nothing to update' });
        await db.CaseDetail.update(data, { where: { id: id } });
        res.send({ status: true });
    } catch (err) {
        console.error('updateCaseDetail error:', err);
        res.send({ status: false, error: err.message });
    }
};

ReadyForverifyController.prototype.mapPdfToEntry = async function (req, res) {
    try {
        var type = req.body.type;
        var id = parseInt(req.body.id, 10);
        var path = req.body.path;
        if (!id || !path) return res.send({ status: false, error: 'id and path are required' });
        if (type !== 'ia' && type !== 'order') return res.send({ status: false, error: 'Invalid type' });
        var model = (type === 'order') ? db.OrderDetail : db.IaFiling;
        var row = await model.findOne({ where: { id: id } });
        if (!row) return res.send({ status: false, error: 'Entry not found' });
        await db.sequelize.transaction(async function (t) {
            var opts = { where: { documentPath: path, case_detail_id: row.case_detail_id }, transaction: t };
            await db.IaFiling.update({ documentPath: null }, opts);
            await db.OrderDetail.update({ documentPath: null }, opts);
            await row.update({ documentPath: path }, { transaction: t });
        });
        res.send({ status: true });
    } catch (err) {
        console.error('mapPdfToEntry error:', err);
        res.send({ status: false, error: err.message });
    }
};

ReadyForverifyController.prototype.unmapPdf = async function (req, res) {
    try {
        var path = req.body.path;
        var firId = parseInt(req.body.fir, 10);
        if (!path || !firId) return res.send({ status: false, error: 'fir and path are required' });
        var detail = await db.CaseDetail.findOne({ where: { fir: firId }, order: [['id', 'DESC']] });
        if (!detail) return res.send({ status: false, error: 'Case not found' });
        var opts = { where: { documentPath: path, case_detail_id: detail.id } };
        await db.IaFiling.update({ documentPath: null }, opts);
        await db.OrderDetail.update({ documentPath: null }, opts);
        res.send({ status: true });
    } catch (err) {
        console.error('unmapPdf error:', err);
        res.send({ status: false, error: err.message });
    }
};

var VERIFY_ENTRY_FIELDS = {
    ia: {
        model: 'IaFiling',
        fields: ['iaType', 'iaNumber', 'iaYear', 'iaNature', 'filingDate', 'applicantName',
            'applicantAdvocate', 'respondentName', 'respondentAdvocate', 'documentPath',
            'status', 'dateOfDecision', 'nextdate']
    },
    order: {
        model: 'OrderDetail',
        fields: ['documentType', 'orderDate', 'documentPath', 'judgeCode', 'jocode',
            'iaNumber', 'iaType']
    }
};

ReadyForverifyController.prototype.createCaseEntry = async function (req, res) {
    try {
        var cfg = VERIFY_ENTRY_FIELDS[req.body.type];
        var firId = parseInt(req.body.fir, 10);
        if (!cfg || !firId) return res.send({ status: false, error: 'type and fir are required' });
        var fields = req.body.fields;
        if (typeof fields === 'string') {
            try { fields = JSON.parse(fields); } catch (e) { fields = {}; }
        }
        fields = fields || {};
        var detail = await db.CaseDetail.findOne({ where: { fir: firId }, order: [['id', 'DESC']] });
        if (!detail) return res.send({ status: false, error: 'Case details not saved yet. Save the case first.' });
        var data = { case_detail_id: detail.id };
        cfg.fields.forEach(function (f) {
            if (fields[f] !== undefined) data[f] = (fields[f] === '' || fields[f] === 'null') ? null : fields[f];
        });
        var row = await db[cfg.model].create(data);
        res.send({ status: true, data: row });
    } catch (err) {
        console.error('createCaseEntry error:', err);
        res.send({ status: false, error: err.message });
    }
};

////////////////////// REady for UPLOAD


ReadyForverifyController.prototype.readyforUpload = function (req, res) {
    // console.log(res.locals)
    res.render('readyforupload', { title: 'Document Uploaded Verify List', locals: res.locals });
}
ReadyForverifyController.prototype.getbstchesforUploadReady = function (req, res) {

    query = 'select b.id,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join "users-permissions_user" u on u.id=b.created_by_d2 where u.digitizationcenter=' + req.session.user.user.digitizationcenter.id + ' and f.imagestatus=6 and readyforupload=false  and isupload=false group by b.id,b.bundlenumber order by b.bundlenumber'
    CIPAService.executeSQL(query, function (batchdata) {
        var resultbat = batchdata[0];
        res.send({ status: true, data: resultbat });
    })


}
ReadyForverifyController.prototype.getmetadatabffile = function (req, res) {

    httpService.get(encodeURI("/metadatavalues?fir=" + req.query.fileid + "&_sort=id:asc&_limit=-1"), req.body, function (node) {

        res.send({ status: true, data: JSON.parse(node) });
    })
}





ReadyForverifyController.prototype.findFIrsbybathcReadyforUpload = function (req, res) {

    var query = "select * from firs where imagestatus=6 and readyforupload=false and isupload=false and batch in(" + req.body.selectedBatch + " ) ";

    CIPAService.executeSQL(query, function (batchdata) {
        var resultbat = batchdata[0];
        res.send({ status: true, data: resultbat });
    })

}

ReadyForverifyController.prototype.bulkReadyForUpload = function (req, res) {
    var deletequery = "update firs set readyforupload=true where id in (" + req.body.selectedfile.toString() + ")";
    console.log(deletequery)
    CIPAService.UpdateexecuteSQL(deletequery, function (data) {
        if (data != null) {
            res.send({ status: true });
        } else {
            res.send({ status: false });
        }
    })

}




module.exports = new ReadyForverifyController();