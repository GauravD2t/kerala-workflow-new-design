var httpService = require('../service/httpService.js')
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

    query = 'select b.id,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join "users-permissions_user" u on u.id=b.created_by_d2 where u.digitizationcenter=' + req.session.user.user.digitizationcenter.id + ' and f.imagestatus=5 and readyforverify=false  group by b.id,b.bundlenumber order by b.bundlenumber'
    CIPAService.executeSQL(query, function (batchdata) {
        var resultbat = batchdata[0];
        res.send({ status: true, data: resultbat });
    })


}

ReadyForverifyController.prototype.findFIrsbybathcReadyforVerify = function (req, res) {
    // console.log("===============", req.body.selectedBatch)
    // console.log("****************", req.body.selectedBatch.toString())
    var query = "select * from firs where imagestatus=5 and readyforverify=false and batch in(" + req.body.selectedBatch + " ) ";

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
      var deletequery = "update firs set first_verify_at='" + moment().format() + "',first_verify_by=" + req.session.user.user.id + ",readyforverify=true where id in (" + req.body.selectedfile.toString() + ")";
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

    var deletequery = "update firs set first_verify_at='" + moment().format() + "',first_verify_by=" + req.session.user.user.id + ",imagestatus=" + req.body.imagestatus + ",readyforverify=false,verifyremarks='" + req.body.Verifyremarks + "' where id in (" + req.body.selectedfile.toString() + ")";
   
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