var httpService = require('../service/httpService.js')
var moment = require('moment');
var CIPAService = require("../service/CIPAService");
function FIRChangeStatusController() {
}
FIRChangeStatusController.prototype.FIRStatusChange = function (req, res) {
    // console.log(res.locals)
    res.render('Casestatuschange', { title: 'File Status Change', locals: res.locals });
}

FIRChangeStatusController.prototype.filewiselog = function (req, res) {
    // console.log(res.locals)
    res.render('filewiselog', { title: 'File Logs', locals: res.locals });
}
FIRChangeStatusController.prototype.deletefileChange = function (req, res) {
    // console.log(res.locals)
    res.render('deletefile', { title: 'File Delete', locals: res.locals });
}
FIRChangeStatusController.prototype.findFIr = (req, res) => {

    console.log(req.query)
    var start = 0;
    let userID = "";
    if (req.session.user.user.digitizationcenter == null) {
        userID = req.session.user.user.id;
    } else {
        userID = req.session.user.user.digitizationcenter.id;
    }
    httpService.get(encodeURI("/findfirbyQuery?batch.created_by_d2.digitizationcenter=" + userID + "&est_code_eq=" + req.query.estcode + "&casetype_eq=" + req.query.casetype + "&year_eq=" + req.query.caseyear + "&caseno_eq=" + req.query.caseno), req.body, function (node) {
        res.send({ status: true, data: JSON.parse(node) });
    })

}
FIRChangeStatusController.prototype.ImageStatusupdateFIR = (req, res) => {
    console.log("req.params==============")
    console.log(req.query)
    tostage = "";
    req.body.imagestatus = req.query.imagestatus;
    if (req.body.imagestatus == 0) {
        tostage = "Scan";
    } else if (req.body.imagestatus == 1) {
        tostage = "Image QC";
    } else if (req.body.imagestatus == 2) {
        tostage = "Data Entry";
    } else if (req.body.imagestatus == 3) {
        tostage = "Classification";
    } else if (req.body.imagestatus == 4) {
        tostage = "PDF Creation";
    } else if (req.body.imagestatus == 5) {
        tostage = "L1  Verification";
    }
    else if (req.body.imagestatus == 6) {
        tostage = "IM  Verification";
    } else if (req.body.imagestatus == 8) {
        tostage = "L2  Verification";
    } else if (req.body.imagestatus == 9) {
        tostage = "L3  Verification";
    }
    if (req.query.imagestatus <= 4) {
        req.body.readyforverify = false;
        req.body.secondverify = false;
        req.body.thirdverify = false;// if status is 5 then change it to 4
    }
    else if (req.query.imagestatus == 6) {
        req.body.imagestatus = 5;
        req.body.readyforverify = false;
        req.body.secondverify = false;
        req.body.thirdverify = false
    }
    else if (req.query.imagestatus == 8) {
        req.body.imagestatus = 6;
        req.body.secondverify = false;
        req.body.thirdverify = false;

    }
    else if (req.query.imagestatus == 9) {
        req.body.imagestatus = 6;
        req.body.thirdverify = false;

    }
    else if (req.query.imagestatus == 5) {
        req.body.secondverify = false;
        req.body.thirdverify = false;

    }

    updateFORM_A = "delete from classficationfiles where fir in (" + req.query.id + ") and documenttypename = 'Form A' and documentdesc='Form A'";
    httpService.get("/firs/" + req.query.id, req.body, function (node1) {
        let firdata = JSON.parse(node1);
        console.log("firdata.imagestatus..........", firdata.imagestatus)
        if (firdata.imagestatus >= 4) {
            fromstage = "";
           
            if (firdata.imagestatus == 4) {
                fromstage = "PDF Creation";
            } else if (firdata.imagestatus == 5 && !firdata.readyforverify) {
                fromstage = "IM Verification";
            } else if (firdata.imagestatus == 5 && firdata.readyforverify) { 
                fromstage = "L1  Verification";
            } else if (firdata.imagestatus == 6) {
                fromstage = "L2  Verification";
            }else if (firdata.imagestatus ==6 && firdata.secondverify) {
                fromstage = "L3  Verification";
            }

           
            queryinsert = "INSERT INTO filereturnlogs(fir, users_by, action_at, pagecount, fromstage, tostage,scancount,qccount,pdfcount,metadatacount) VALUES (" + req.query.id + "," + req.session.user.user.id + ",now()," + firdata.classficationpagecount + ",'" + fromstage + "','" + tostage + "'," + firdata.scanpagecount + "," + firdata.qcpagecount + "," + firdata.pdfpagecount + "," + firdata.metadatapage+ ")";
            console.log("queryinsert.............", queryinsert)
            CIPAService.InsertexecuteSQL(queryinsert, function (batchdata) {
                CIPAService.DeleteeexecuteSQL(updateFORM_A, function (data) {
                    httpService.put("/firs/" + req.query.id, req.body, function (node1) {
                        res.send({ status: true, data: JSON.parse(node1) });
                    })
                })
            })
        } else {
            CIPAService.DeleteeexecuteSQL(updateFORM_A, function (data) {
                httpService.put("/firs/" + req.query.id, req.body, function (node1) {
                    res.send({ status: true, data: JSON.parse(node1) });
                })
            })
        }

    })
}
FIRChangeStatusController.prototype.getesticode = (req, res) => {
    console.log("req.params==============")
    let query = "select est_code from firs group by est_code";
    CIPAService.executeSQLOnlyData(query, function (data) {
        console.log(data);
        res.send({ status: true, data: data });
    })


}
FIRChangeStatusController.prototype.getcasetype = (req, res) => {
    console.log("req.params==============")
    let query = "select casetype from firs where est_code='" + req.query.estcode + "' group by casetype";
    CIPAService.executeSQLOnlyData(query, function (data) {
        console.log(data);
        res.send({ status: true, data: data });
    })


}
FIRChangeStatusController.prototype.deleteFile = (req, res) => {
    console.log("req.params==============", req.query.id)
    query = "delete from classficationfiles where fir= " + req.query.id;
    CIPAService.UpdateexecuteSQL(query, function (batchdata) {
        httpService.delete("/firs/" + req.query.id, req.body, function (node1) {
            res.send({ status: true, data: JSON.parse(node1) });
        })
    })



}


module.exports = new FIRChangeStatusController();