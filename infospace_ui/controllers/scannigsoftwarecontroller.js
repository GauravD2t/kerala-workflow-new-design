var BatchNoGenrate = require('../util/batchNumberGenrate.js')
var textutil = require('../util/textutil');
var httpService = require('../service/httpService.js')
var path = require('path')
this.db = null
const AsiosUtil = require("../service/AxiosUtil")
var LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');
var CIPAService = require("../service/CIPAService");

var moment = require('moment');
function ScanningSoftwareController() {
}
ScanningSoftwareController.prototype.autoqcstatusupdate = function (req, res) {
    console.log("autoqcstatusupdate")
    query = 'update firs set qcauto = true where id = ' + req.body.fileid
    CIPAService.UpdateexecuteSQL(query, function (batchdata) {
        res.send({ status: true});
    })
}


//scaning stage
ScanningSoftwareController.prototype.getBatchesNameForScanningStage = function (req, res) {
   
    query = 'WITH user_locked_batches AS ( SELECT DISTINCT f.batch FROM firs f  WHERE (f.scan_by = ' + req.session.user.user.id +' or f.scan_by is null) AND f.islock = true AND f.imagestatus = 0) SELECT DISTINCT b.id, b.bundlenumber FROM batches b JOIN firs f ON f.batch = b.id WHERE ( EXISTS (SELECT 1 FROM user_locked_batches ulb WHERE ulb.batch = b.id) ) OR ( NOT EXISTS (SELECT 1 FROM user_locked_batches)  AND f.imagestatus = 0  AND (f.islock = false OR f.islock IS NULL) ) ORDER BY b.bundlenumber'
    console.log("query..", + query)
    CIPAService.executeSQL(query, function (batchdata) {
        var resultbat = batchdata[0];
        res.send({ status: true, data: resultbat });
    })
}
ScanningSoftwareController.prototype.getFileListForScanningStageByBatchID = function (req, res) {
    console.log("getFileListForScanningStageByBatchID")
 httpService.get(encodeURI("/findfirbyQuery?batch=" + req.body.batchid + "&inwardstatus=1&imagestatus=0&qcreject=false&_sort=id:asc&_limit=-1"), req.body, function (allbatch) {
        allbatch = JSON.parse(allbatch)
        ////console.log(allbatch.statusCode)
        if (allbatch.statusCode != 403) {
            getbatchByFire(allbatch, req.session.user.user.id).then(function (retuennode) {
                res.send({ status: true, data: retuennode });
            })
        } else {
            res.send({ status: false, message: allbatch.message });
        }


    })
}
//Image QC stage
//Auto QC off
/*
ScanningSoftwareController.prototype.getBatchesNameForImageQCStage = function (req, res) {
    console.log("getBatchesNameForImageQCStage")
    query = 'WITH user_locked_batches AS ( SELECT DISTINCT f.batch FROM firs f  WHERE (f.qc_by = ' + req.session.user.user.id +'  or f.qc_by is null) AND f.islock = true AND f.imagestatus = 1 ) SELECT DISTINCT b.id, b.bundlenumber FROM batches b JOIN firs f ON f.batch = b.id WHERE ( EXISTS (SELECT 1 FROM user_locked_batches ulb WHERE ulb.batch = b.id) ) OR ( NOT EXISTS (SELECT 1 FROM user_locked_batches)  AND f.imagestatus = 1  AND (f.islock = false OR f.islock IS NULL)  ) ORDER BY b.bundlenumber'
    CIPAService.executeSQL(query, function (batchdata) {
        var resultbat = batchdata[0];
        res.send({ status: true, data: resultbat });
    })
}
ScanningSoftwareController.prototype.getFileListForImageQCStageByBatchID = function (req, res) {
    console.log("getFileListForImageQCStageByBatchID")
    httpService.get(encodeURI("/findfirbyQuery?batch=" + req.body.batchid + "&verify_by_null=true&inwardstatus=1&imagestatus=1&qcreject=false&_sort=id:asc&_limit=-1"), req.body, function (allbatch) {
        allbatch = JSON.parse(allbatch)
        ////console.log(allbatch.statusCode)
        if (allbatch.statusCode != 403) {
            getbatchByFire(allbatch, req.session.user.user.id).then(function (retuennode) {
                res.send({ status: true, data: retuennode });
            })
        } else {
            res.send({ status: false, message: allbatch.message });
        }


    })
}*/

///AUTO QC ON

ScanningSoftwareController.prototype.getBatchesNameForImageQCStage = function (req, res) {
    console.log("getBatchesNameForImageQCStage")
    query = 'WITH user_locked_batches AS ( SELECT DISTINCT f.batch FROM firs f  WHERE (f.qc_by = ' + req.session.user.user.id +'  or f.qc_by is null) AND f.islock = true AND f.imagestatus = 1 and f.qcauto=true) SELECT DISTINCT b.id, b.bundlenumber FROM batches b JOIN firs f ON f.batch = b.id WHERE ( EXISTS (SELECT 1 FROM user_locked_batches ulb WHERE ulb.batch = b.id) ) OR ( NOT EXISTS (SELECT 1 FROM user_locked_batches)  AND f.imagestatus = 1  AND (f.islock = false OR f.islock IS NULL) and f.qcauto=true ) ORDER BY b.bundlenumber'
    CIPAService.executeSQL(query, function (batchdata) {
        var resultbat = batchdata[0];
        res.send({ status: true, data: resultbat });
    })
}
ScanningSoftwareController.prototype.getFileListForImageQCStageByBatchID = function (req, res) {
    console.log("getFileListForImageQCStageByBatchID")
    httpService.get(encodeURI("/findfirbyQuery?batch=" + req.body.batchid + "&qcauto=true&verify_by_null=true&inwardstatus=1&imagestatus=1&qcreject=false&_sort=id:asc&_limit=-1"), req.body, function (allbatch) {
        allbatch = JSON.parse(allbatch)
        ////console.log(allbatch.statusCode)
        if (allbatch.statusCode != 403) {
            getbatchByFire(allbatch, req.session.user.user.id).then(function (retuennode) {
                res.send({ status: true, data: retuennode });
            })
        } else {
            res.send({ status: false, message: allbatch.message });
        }


    })
} 

//image QC Reject
ScanningSoftwareController.prototype.getBatchesNameForImageQCRejectStage = function (req, res) {
    console.log("getBatchesNameForImageQCStage")
    query = 'SELECT DISTINCT b.id, bundlenumber FROM firs f JOIN batches b ON b.id = f.batch WHERE imagestatus=1 and verify_by is not null order by bundlenumber'
    CIPAService.executeSQL(query, function (batchdata) {
        var resultbat = batchdata[0];
        res.send({ status: true, data: resultbat });
    })
}
ScanningSoftwareController.prototype.getFileListForImageQCRejectStageByBatchID = function (req, res) {
    console.log("getFileListForImageQCStageByBatchID")
    httpService.get(encodeURI("/findfirbyQuery?batch=" + req.body.batchid + "&verify_by_null=false&inwardstatus=1&imagestatus=1&qcreject=false&_sort=id:asc&_limit=-1"), req.body, function (allbatch) {
        allbatch = JSON.parse(allbatch)
        ////console.log(allbatch.statusCode)
        if (allbatch.statusCode != 403) {
            getbatchByFire(allbatch, req.session.user.user.id).then(function (retuennode) {
                res.send({ status: true, data: retuennode });
            })
        } else {
            res.send({ status: false, message: allbatch.message });
        }


    })
}

// Export to CSV
ScanningSoftwareController.prototype.getBatchesNameForCSVExportStage = function (req, res) {
    console.log("getBatchesNameForCSVExportStage")
    query = 'select b.id, b.bundlenumber as bundlenumber from firs f join batches b on b.id = f.batch where  f.imagestatus = 6 and csvdone = false and isupload = true group by b.id, b.bundlenumber order by b.bundlenumber'
    CIPAService.executeSQL(query, function (batchdata) {
        var resultbat = batchdata[0];
        res.send({ status: true, data: resultbat });
    })
}
 
ScanningSoftwareController.prototype.getFileListForCSVExportByBatchID = function (req, res) {
    console.log("getFileListForCSVExportByBatchID")
    httpService.get(encodeURI("/findfirbyQuery?batch=" + req.body.batchid + "&inwardstatus=1&imagestatus=6&isupload=true&csvdone=false&qcreject=false&_sort=id:asc&_limit=-1"), req.body, function (allbatch) {
        allbatch = JSON.parse(allbatch)
        ////console.log(allbatch.statusCode)
        if (allbatch.statusCode != 403) {
            getbatchByFire(allbatch, req.session.user.user.id).then(function (retuennode) {
                res.send({ status: true, data: retuennode });
            })
        } else {
            res.send({ status: false, message: allbatch.message });
        }
    })
}
///PDF
ScanningSoftwareController.prototype.getBatchesNameForPDFStage = function (req, res) {
    console.log("getBatchesNameForPDFStage")
    query = 'WITH user_locked_batches AS ( SELECT DISTINCT f.batch FROM firs f  WHERE (f.pdf_by = ' + req.session.user.user.id +'  or f.pdf_by is null)  AND f.islock = true AND f.imagestatus = 4) SELECT DISTINCT b.id, b.bundlenumber FROM batches b JOIN firs f ON f.batch = b.id WHERE ( EXISTS (SELECT 1 FROM user_locked_batches ulb WHERE ulb.batch = b.id) ) OR ( NOT EXISTS (SELECT 1 FROM user_locked_batches)  AND f.imagestatus = 4  AND (f.islock = false OR f.islock IS NULL) ) ORDER BY b.bundlenumber'
    CIPAService.executeSQL(query, function (batchdata) {
        var resultbat = batchdata[0];
        res.send({ status: true, data: resultbat });
    })
}



ScanningSoftwareController.prototype.getFileListForPDFByBatchID = function (req, res) {
    console.log("getFileListForPDFByBatchID")
    httpService.get(encodeURI("/findfirbyQuery?batch=" + req.body.batchid + "&inwardstatus=1&imagestatus=4&qcreject=false&_sort=id:asc&_limit=-1"), req.body, async function (allbatch) {
        allbatch = JSON.parse(allbatch)
        var batchs = [];
        ////console.log(allbatch.statusCode)
        if (allbatch.statusCode != 403) {
            getbatchByFire(allbatch, req.session.user.user.id).then(function (retuennode) {
                res.send({ status: true, data: retuennode });
            })
        } else {
            res.send({ status: false, message: allbatch.message });
        }
    })
}
/// DAta Entry
ScanningSoftwareController.prototype.getBatchesNameForDataEntryStage = function (req, res) {
    console.log("getBatchesNameForDataEntryStage")
    query = 'WITH user_locked_batches AS ( SELECT DISTINCT f.batch FROM firs f  WHERE (f.metadata_by = ' + req.session.user.user.id +'  or f.metadata_by is null)  AND f.islock = true AND f.imagestatus = 2) SELECT DISTINCT b.id, b.bundlenumber FROM batches b JOIN firs f ON f.batch = b.id WHERE ( EXISTS (SELECT 1 FROM user_locked_batches ulb WHERE ulb.batch = b.id) ) OR ( NOT EXISTS (SELECT 1 FROM user_locked_batches)  AND f.imagestatus = 2  AND (f.islock = false OR f.islock IS NULL) ) ORDER BY b.bundlenumber'
    CIPAService.executeSQL(query, function (batchdata) {
        var resultbat = batchdata[0];
        res.send({ status: true, data: resultbat });
    })
}

ScanningSoftwareController.prototype.getFileListForDataEntryByBatchID = function (req, res) {
    console.log("getFileListForDataEntryByBatchID")
    httpService.get(encodeURI("/findfirbyQuery?batch=" + req.body.batchid + "&inwardstatus=1&imagestatus=2&qcreject=false&_sort=id:asc&_limit=-1"), req.body, function (allbatch) {
        allbatch = JSON.parse(allbatch)
        ////console.log(allbatch.statusCode)
        if (allbatch.statusCode != 403) {
            getbatchByFire(allbatch, req.session.user.user.id).then(function (retuennode) {
                res.send({ status: true, data: retuennode });
            })
        } else {
            res.send({ status: false, message: allbatch.message });
        }
    })
}


/// Classfication Entry
ScanningSoftwareController.prototype.getBatchesNameForClassificationStage = function (req, res) {
    console.log("getBatchesNameForClassificationStage")
    query = 'WITH user_locked_batches AS ( SELECT DISTINCT f.batch FROM firs f  WHERE (f.classification_by = ' + req.session.user.user.id +'   or f.classification_by is null)  AND f.islock = true AND f.imagestatus = 2) SELECT DISTINCT b.id, b.bundlenumber FROM batches b JOIN firs f ON f.batch = b.id WHERE ( EXISTS (SELECT 1 FROM user_locked_batches ulb WHERE ulb.batch = b.id) ) OR ( NOT EXISTS (SELECT 1 FROM user_locked_batches)  AND f.imagestatus = 2  AND (f.islock = false OR f.islock IS NULL) ) ORDER BY b.bundlenumber'
    CIPAService.executeSQL(query, function (batchdata) {
        var resultbat = batchdata[0];
        res.send({ status: true, data: resultbat });
    })
}

ScanningSoftwareController.prototype.getFileListForClassificationByBatchID = function (req, res) {
    console.log("getFileListForClassificationByBatchID")
    httpService.get(encodeURI("/findfirbyQuery?batch=" + req.body.batchid + "&verify_by_null=true&inwardstatus=1&imagestatus=2&qcreject=false&_sort=id:asc&_limit=-1"), req.body, function (allbatch) {
        allbatch = JSON.parse(allbatch)
        ////console.log(allbatch.statusCode)
        if (allbatch.statusCode != 403) {
            getbatchByFire(allbatch, req.session.user.user.id).then(function (retuennode) {
                res.send({ status: true, data: retuennode });
            })
        } else {
            res.send({ status: false, message: allbatch.message });
        }
    })
}


/// Classfication Reject Entry
ScanningSoftwareController.prototype.getBatchesNameForRejectClassificationStage = function (req, res) {
    console.log("getBatchesNameForClassificationStage")
    query = 'SELECT DISTINCT b.id, bundlenumber FROM firs f JOIN batches b ON b.id = f.batch WHERE imagestatus=2 and verify_by is not null order by bundlenumber'
    CIPAService.executeSQL(query, function (batchdata) {
        var resultbat = batchdata[0];
        res.send({ status: true, data: resultbat });
    })
}

ScanningSoftwareController.prototype.getFileListForRejectClassificationByBatchID = function (req, res) {
    console.log("getFileListForClassificationByBatchID")
    httpService.get(encodeURI("/findfirbyQuery?batch=" + req.body.batchid + "&verify_by_null=false&inwardstatus=1&imagestatus=2&qcreject=false&_sort=id:asc&_limit=-1"), req.body, function (allbatch) {
        allbatch = JSON.parse(allbatch)
        ////console.log(allbatch.statusCode)
        if (allbatch.statusCode != 403) {
            getbatchByFire(allbatch, req.session.user.user.id).then(function (retuennode) {
                res.send({ status: true, data: retuennode });
            })
        } else {
            res.send({ status: false, message: allbatch.message });
        }
    })
}


// first verify
ScanningSoftwareController.prototype.getBatchesNameForFirstverifyStage = function (req, res) {
    console.log("getBatchesNameForFirstverifyStage")
    query = 'select b.id,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch where  f.imagestatus=2  group by b.id,b.bundlenumber order by b.bundlenumber'
    CIPAService.executeSQL(query, function (batchdata) {
        var resultbat = batchdata[0];
        res.send({ status: true, data: resultbat });
    })
}

ScanningSoftwareController.prototype.getFileListForFirstVerifyByBatchID = function (req, res) {
    console.log("getFileListForFirstVerifyByBatchID")
    httpService.get(encodeURI("/findfirbyQuery?batch=" + req.body.batchid + "&inwardstatus=1&imagestatus=2&qcreject=false&_sort=id:asc&_limit=-1"), req.body, function (allbatch) {
        allbatch = JSON.parse(allbatch)
        ////console.log(allbatch.statusCode)
        if (allbatch.statusCode != 403) {
            getbatchByFire(allbatch, req.session.user.user.id).then(function (retuennode) {
                res.send({ status: true, data: retuennode });
            })
        } else {
            res.send({ status: false, message: allbatch.message });
        }


    })
}

ScanningSoftwareController.prototype.lockFile = function (req, res) {
    console.log("lockFile")
    httpService.get("/firs/" + req.body.fileid, req.body, function (node) {
        var Files = JSON.parse(node);
        console.log("Files.imagestatus",Files.imagestatus)
        console.log("currentuser" + req.session.user.user.id);
       query = 'update firs set islock = true';
        if (Files.imagestatus == 0) {
           query = query + ',scan_by = ' + req.session.user.user.id;
       } else if (Files.imagestatus == 1) {
           query = query + ',qc_by = ' + req.session.user.user.id;
       } else if (Files.imagestatus == 2) {
            query = query + ',metadata_by = ' + req.session.user.user.id;
       } else if (Files.imagestatus == 3) {
            query = query + ',classification_by = ' + req.session.user.user.id;
        } else if (Files.imagestatus == 4) {
            query = query + ',pdf_by = ' + req.session.user.user.id;
        } 
        //console.log(query)
        if (Files.imagestatus == 0 || Files.imagestatus == 1 || Files.imagestatus == 2 || Files.imagestatus == 3 || Files.imagestatus == 4) {
           query = query+' where id = ' + req.body.fileid;
           console.log(query)
           CIPAService.UpdateexecuteSQL(query, function (batchdata) {
               var resultbat = batchdata[0];
               res.send({ status: true, data: [] });
           })
       }
       else {
           res.send({ status: true, data: [] });
       }
       })
    
}
ScanningSoftwareController.prototype.unlockFile = function (req, res) {
    console.log("unlockFile")
    query = 'update firs set islock = false where id = ' + req.body.fileid
    CIPAService.UpdateexecuteSQL(query, function (batchdata) {
        var resultbat = batchdata[0];
        res.send({ status: true, data: [] });
    })
}
ScanningSoftwareController.prototype.checkLockstatusofFile = function (req, res) {
    console.log("  checkLockstatusofFile")
    httpService.get("/firs/" + req.body.fileid, req.body, function (node) { 
        var Files = JSON.parse(node);
        if(Files.islock == true){
            res.send({ status: true, data: [] });
        }else{
            res.send({ status: false, data: [] });
        }
    })
}



async function getbatchByFire(firs, currentuser) {
    //console.log("currentuser" + currentuser);
    var batchs = []
    var lockbatch = [];

    await firs.forEach(elm => {
       // console.log(elm)
        var picked = batchs.find(o => o.id === elm.batch.id);
        let caestype = elm.casetype.replace(/\//g, '-').replace(/\s+/g, '-');
        var firobj;
            firobj = {
                id: elm.id, firserialnumber: caestype + "_" + elm.caseno + "_" + elm.year , itemid: elm.itemid, caseno: elm.crn,
                pagecount: elm.pagecount, firremarks: elm.firremarks,
                metadatavalues: elm.metadatavalues == null ? [] : elm.metadatavalues,
                verify_by: elm.verify_by != null ? elm.verify_by.name : elm.verify_by,
                verifyremarks: elm.verifyremarks,
                lang: "",
        }
       // batchs.push(firobj);
        
        if (elm.islock && elm.imagestatus == 0 && currentuser == elm.scan_by.id) {
            lockbatch.push(firobj)
        } else if (elm.islock && elm.imagestatus == 1 && currentuser == elm.qc_by.id) {
            lockbatch.push(firobj)
        } else if (elm.islock && elm.imagestatus == 2 && currentuser == elm.metadata_by) {
            lockbatch.push(firobj)
        } else if (elm.islock && elm.imagestatus == 3 && currentuser == elm.classification_by.id) {

            lockbatch.push(firobj)
        } else if (elm.islock && elm.imagestatus == 4 && currentuser == elm.pdf_by) {

            lockbatch.push(firobj)
        }
        if (!elm.islock) {
            batchs.push(firobj);
        }
       
    })
    if (lockbatch.length != 0) {
        return lockbatch;
    } else {
        return batchs;
    }
   

}
async function classficationDTOP(files) {
    await files.forEach(elm => {
        elm.fir = elm.fir.id
    })
}



module.exports = new ScanningSoftwareController();