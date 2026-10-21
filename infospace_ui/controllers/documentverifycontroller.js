var httpService = require('../service/httpService.js')
var BatchNoGenrate = require('../util/batchNumberGenrate.js')
var moment = require('moment');
const AxiosUpdateToDMS = require("../service/AxiosUpdateToDMS")
var LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');
const fs = require('fs');
const path = require('path');
var CIPAService = require("../service/CIPAService");
var communityname_center = "Ernakulam";
var FORAM_AB_PATH = "/mnt/server/ocr";
var Form_A_DocumentID = 'd7906485-028b-4ded-b485-c8a0c6ab32fd';

const PDFDocument = require("pdfkit");

function DocumentverifyController() {
}
DocumentverifyController.prototype.documentverify = function (req, res) {
    // console.log(res.locals)
    res.render('documentverify', { title: 'Document Verify', locals: res.locals });
}
DocumentverifyController.prototype.secondtimeupload = function (req, res) {
    // //console.log(res.locals)
    res.render('secondtimeupload', { title: 'File not Uploaded List', locals: res.locals });
}
DocumentverifyController.prototype.secondverify = function (req, res) {
    // console.log(res.locals)
    res.render('secondverify', { title: 'Second Customer Document Verify', locals: res.locals });
}

DocumentverifyController.prototype.thirdverify = function (req, res) {
    // console.log(res.locals)
    res.render('thirdverify', { title: 'Third Customer Document Verify', locals: res.locals });
}
DocumentverifyController.prototype.filenotuploadlist = function (req, res) {
    httpService.get("/firs?imagestatus=6&isupload=false&thirdverify=true&_limit=-1", req.body, function (node1) {
        res.send({ status: true, data: JSON.parse(node1) });
    })
}
DocumentverifyController.prototype.secondtimebulkverifyfile = function (req, res) {
    var deletequery = "update firs set isupload=true where id in (" + req.body.selectedfile.toString() + ")"; //console.log(deletequery)
    CIPAService.UpdateexecuteSQL(deletequery, function (data) {
       uploadTodms1(req);
        res.send({ status: true });
    })

}

DocumentverifyController.prototype.documentverifySinglepageVerify = function (req, res) {
    // console.log(res.locals)
    res.render('documentverifySingle', { title: 'Document Verify', locals: res.locals });
}
DocumentverifyController.prototype.getbstches = function (req, res) {

    query = 'SELECT  b.id, b.bundlenumber AS bundlenumber FROM  firs f JOIN   batches b ON b.id = f.batch  where f.inwardstatus=1 and f.readyforverify = true and  f.imagestatus=5 GROUP BY  b.id, b.bundlenumber ORDER BY  b.bundlenumber';
    CIPAService.executeSQL(query, function (batchdata) {
        let date = [];
        let department = req.session.user.user.department.split(",");
        for (var batch of batchdata[0]) {
            if (department.includes(batch.bundlenumber.substring(0, batch.bundlenumber.lastIndexOf('-')))) {
                //if (batch.bundlenumber.substring(0, batch.bundlenumber.lastIndexOf('-')) == req.session.user.user.department) {
                date.push(batch);
            }
        }
        res.send({ status: true, data: date });
    })


}
DocumentverifyController.prototype.getbstchesecondverify = function (req, res) {
    query = 'SELECT  b.id, b.bundlenumber AS bundlenumber FROM  firs f JOIN   batches b ON b.id = f.batch  where f.inwardstatus=1 and (secondverify=false or secondverify is null) and f.imagestatus = 6 GROUP BY  b.id, b.bundlenumber  ORDER BY  b.bundlenumber';

   // query = 'select b.id,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch where  f.imagestatus=6 and isupload=false and (secondverify=false or secondverify is null) group by b.id,b.bundlenumber order by b.bundlenumber'
    CIPAService.executeSQL(query, function (batchdata) {
        let date = [];
        let department = req.session.user.user.department.split(",");
        for (var batch of batchdata[0]) {
            if (department.includes(batch.bundlenumber.substring(0, batch.bundlenumber.lastIndexOf('-')))) {
                //if (batch.bundlenumber.substring(0, batch.bundlenumber.lastIndexOf('-')) == req.session.user.user.department) {
                date.push(batch);
            }
        }
        res.send({ status: true, data: date });
    })


}

DocumentverifyController.prototype.getbstchethirdverify = function (req, res) {
    query = 'SELECT  b.id, b.bundlenumber AS bundlenumber FROM  firs f JOIN   batches b ON b.id = f.batch  where f.inwardstatus=1  GROUP BY  b.id, b.bundlenumber HAVING  BOOL_OR(thirdverify=false or thirdverify is null) and BOOL_AND(secondverify=true)   ORDER BY  b.bundlenumber';

    //query = 'select b.id,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch where  f.imagestatus=6 and isupload=false and secondverify=true and (thirdverify=false or thirdverify is null) group by b.id,b.bundlenumber order by b.bundlenumber'
    CIPAService.executeSQL(query, function (batchdata) {
        let date = [];
        let department = req.session.user.user.department.split(",");
        for (var batch of batchdata[0]) {
            if(department.includes(batch.bundlenumber.substring(0, batch.bundlenumber.lastIndexOf('-')))) {
            //if (batch.bundlenumber.substring(0, batch.bundlenumber.lastIndexOf('-')) == req.session.user.user.department) {
                date.push(batch);
            }
        }
        res.send({ status: true, data: date });
    })


}

async function getmetadate(fileid, request) {
    return new Promise((resolve, reject) => {
        httpService.get("/metadatavalues?fir=" + fileid, request.body, async function (node1) {
            resolve(JSON.parse(node1));
        })
    })
}
async function saveClassfilcation(url,body) {
    return new Promise((resolve, reject) => {
        httpService.post("/" + url, body, function (ddddd) {
            //console.log("save classfication file result===", ddddd);
            resolve(true);
        })
    })
}

async function deleteClassfilcation(id) {
    return new Promise((resolve, reject) => {
        CIPAService.DeleteeexecuteSQL("delete from classficationfiles where fir=" + id + " and documenttype in('" + Form_A_DocumentID + "')", function (data) {
            resolve(true);
        })
       
    })
}
async function CreateFromAfromB(req, res) {
    selectfile = "select f.*,b.bundlenumber from firs f join batches b on f.batch=b.id where (f.formab is null or f.formab=false) and f.id in (" + req.body.selectedfile.toString() + ")";

    CIPAService.executeSQLOnlyData(selectfile, async (dataPDF) => {

        for (let file of dataPDF) {
           await deleteClassfilcation(file.id);
            const CASE_NUMBER = file.casetype.replace(/\//g, '-').replace(/\s+/g, '-') +
                "/" + file.caseno + "/" + file.year;

            const COURT_NAME = file.est_code;
            const cleanCase = CASE_NUMBER.replace(/\//g, "_");

            // ---------- FORM A ----------
          
            const formAPath = FORAM_AB_PATH + "/" + file.bundlenumber + "/" + cleanCase + "/" + cleanCase + "_FormA.pdf";
            let createA = await generatePDF(formAPath, (doc) => {
                doc.font("Times-Bold").fontSize(14).text("FORM A", { align: "center" });
                doc.moveDown(1);
                doc.font("Times-Roman").fontSize(12).text(`[Rule 3 (f)]`, { align: "center" });
                doc.moveDown(2);
                doc.font("Times-Roman").fontSize(12).text(
                    `Certified that the judicial records relating to ${CASE_NUMBER} in ${COURT_NAME} have been digitised as per the Kerala Digitisation of Court Records Rules, 2023, in non-editable format using appropriate application software ensuring accuracy of such data and the said data has been compared with the hard  copy and found to be correct.`,
                    { align: "left", lineGap: 6 }
                );
            });

            if (createA) {
                await saveClassfilcation("classficationfiles", {
                    documenttype: Form_A_DocumentID,
                    documentdesc: 'Form A',
                    documenttypename: 'Form A',
                    ocrpdfpath: formAPath,
                    fir: file.id,
                    firstsign: false,
                    secondsign: false,
                    issubchild: false,
                    imagename: ''
                });
            }
/*
            // ---------- FORM B ----------
            const formBPath =    FORAM_AB_PATH + "/" + file.bundlenumber + "/" + cleanCase + "/" + cleanCase + "_FormB.pdf";
            
           // const formBPath ="E:/" + cleanCase + "_FormB.pdf";

            let createB = await generatePDF(formBPath, (doc) => {
                doc.font("Times-Bold").fontSize(14).text("FORM B", { align: "center" });
                doc.moveDown(1);
                doc.font("Times-Roman").fontSize(12).text("[Rules 4(g) and 5(f)]", { align: "center" });
                doc.moveDown(2);
                doc.font("Times-Roman").fontSize(12).text(
                    `Certified that the contents of the ${CASE_NUMBER} in ${COURT_NAME} have been digitised  as per the Kerala Digitisation of Court Records Rules, 2023, in non-editable format using appropriate application software ensuring accuracy of such data and the said data has been compared with the hard  copy and found to be correct.`,
                    { align: "left", lineGap: 6 }
                );
            });

            if (createB) {
                await saveClassfilcation("classficationfiles", {
                    documenttypename: 'Form B',
                    documenttype: Form_B_DocumentID,
                    documentdesc: 'Form B',
                    ocrpdfpath: formBPath,
                    fir: file.id,
                    firstsign: false,
                    secondsign: false,
                    issubchild: false,
                    imagename: ''
                });
            }
*/
            // ---------- UPDATE FLAG ----------
            if (createA) {
                let update = `update firs set formab=true where id=${file.id}`;
                await new Promise(resolve =>
                    CIPAService.UpdateexecuteSQL(update, () => resolve(true))
                );
            }
        }

        return true;
    });
}


async function generatePDF(filePath, buildPdfContent) {
    return new Promise((resolve) => {

        let doc;
        try {
            doc = new PDFDocument({ size: "A4", margin: 60 });
        } catch (err) {
            console.error("PDF Creation Error:", err);
            return resolve(false);
        }

        const stream = fs.createWriteStream(filePath);

        stream.on("error", (err) => {
            console.error("File Stream Error:", err);
            resolve(false);
        });

        doc.on("error", (err) => {
            console.error("PDFKit Error:", err);
            resolve(false);
        });

        // Important: FINISH event belongs to stream
        stream.on("finish", () => {
            resolve(true);
        });

        doc.pipe(stream);

        // Build the PDF
        buildPdfContent(doc);

        // End write
        doc.end();
    });
}
DocumentverifyController.prototype.getpdfwithstatusSecondVerification = async function (req, res) {
   
    let sendtoSign = "select  cf.id,ocrpdfpath from classficationfiles cf  where cf.issubchild=false  and (cf.secondsign=false or cf.secondsign is null) and (cf.ocrpdfpath is not null or cf.ocrpdfpath !='') and cf.fir in (" + req.body.selectedfile + ") UNION  select chd.id,chd.ocrpdfpath from classficationfiles per join classficationfiles chd on chd.parent=per.id and per.issubchild=true where  per.issubchild=true  and (chd.secondsign=false or chd.secondsign is null) and (chd.ocrpdfpath != '' or chd.ocrpdfpath is not null)  and  per.fir in (" + req.body.selectedfile + ") ";
    
    //let dataPDF = await CIPAService.executeSQLOnlyData(sendtoSign);
    let files = [];

    CIPAService.executeSQLOnlyData(sendtoSign, function (dataPDF) { 
        for (let ocr of dataPDF) {

            files.push({ fileid: ocr.id, filepath: ocr.ocrpdfpath.split('\\').join('/'), status: false })
        }
        res.send({ status: true, data: files });
    })
    
}
DocumentverifyController.prototype.getbstchesForFirstTimeVerify = function (req, res) {

    query = 'select b.id,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch where  f.imagestatus=5 and readyforverify=false group by b.id,b.bundlenumber order by b.bundlenumber'
    CIPAService.executeSQL(query, function (batchdata) {
      
         
        res.send({ status: true, data: batchdata[0] });
    })


}
DocumentverifyController.prototype.findFIrsbybathc = function (req, res) {
    httpService.get("/findfirbyQuery?imagestatus=5&readyforverify=true&batch=" + req.query.batch + "&_limit=-1", req.body, function (node1) {
        res.send({ status: true, data: JSON.parse(node1) });
    })
}
DocumentverifyController.prototype.findFIrsbybathcsecondverify = function (req, res) {
    httpService.get("/findfirbyQuery?imagestatus=6&readyforverify=true&secondverify_ne=true&isupload=false&batch=" + req.query.batch + "&_limit=-1", req.body, function (node1) {
        res.send({ status: true, data: JSON.parse(node1) });
    })
}
DocumentverifyController.prototype.findFIrsbybathcthidverify = function (req, res) {
    httpService.get("/findfirbyQuery?imagestatus=6&readyforverify=true&isupload=false&secondverify=true&thirdverify_ne=true&batch=" + req.query.batch + "&_limit=-1", req.body, function (node1) {
        res.send({ status: true, data: JSON.parse(node1) });
    })
}

DocumentverifyController.prototype.findFIrsbybathcForFirstTime = function (req, res) {
    httpService.get("/firs?imagestatus=5&readyforverify=false&batch=" + req.query.batch + "&_limit=-1", req.body, function (node1) {
        res.send({ status: true, data: JSON.parse(node1) });
    })
}
DocumentverifyController.prototype.bulverifyfile = async function (req, res) {
    var deletequery = "";
    if (req.body.imagestatus == 6) {
        deletequery = "update firs set verify_at='" + moment().format() + "',verify_by=" + req.session.user.user.id + ",imagestatus=" + req.body.imagestatus + " where id in (" + req.body.selectedfile.toString() + ")";
        CIPAService.UpdateexecuteSQL(deletequery, async function (data) {

            if (data != null) {
                res.send({ status: true });
            } else {
                res.send({ status: false });
            }
        })
    } else {
        deletequery = "update firs set readyforverify=false,verify_at='" + moment().format() + "',verify_by=" + req.session.user.user.id + ",imagestatus=" + req.body.imagestatus + ",verifyremarks='" + req.body.Verifyremarks + "' where id in (" + req.body.selectedfile.toString() + ")";
        letfldid = req.body.selectedfile.toString().split(",")[0];

        httpService.get("/firs/" + letfldid, req.body, function (node1) {
            let firdata = JSON.parse(node1);
            lettostage = "";
            if (req.body.imagestatus == 1) {
                lettostage = "Image QC";
            } else if (req.body.imagestatus == 2) {
                lettostage = "Classfication";
            }
            queryinsert = "INSERT INTO filereturnlogs(fir, users_by, action_at, pagecount, fromstage, tostage,remarks,pdfcount,scancount,qccount,metadatacount) VALUES (" + letfldid + "," + req.session.user.user.id + ",now()," + firdata.classficationpagecount + ",'L1 Rejected','" + lettostage + "','" + req.body.Verifyremarks + "'," + firdata.pdfpagecount + "," + firdata.scanpagecount + "," + firdata.qcpagecount + "," + firdata.metadatapage+ ")";
            console.log("queryinsert.............", queryinsert)
            CIPAService.InsertexecuteSQL(queryinsert, function (batchdata) {
                CIPAService.UpdateexecuteSQL(deletequery, async function (data) {

                    if (data != null) {
                        res.send({ status: true });
                    } else {
                        res.send({ status: false });
                    }
                })
            })
        })
    }
    


    

}
DocumentverifyController.prototype.secondverifybulkwithupload = async function (req, res) {


   
    var deletequery = "";
    if (req.body.imagestatus == 6) {
        deletequery = "update firs set secondverify_at='" + moment().format() + "',secondverify_by=" + req.session.user.user.id + ",secondverify=true,imagestatus=" + req.body.imagestatus + " where id in (" + req.body.selectedfile.toString() + ")";
        CIPAService.UpdateexecuteSQL(deletequery, async function (data) {

            if (req.body.imagestatus == 6) {
                CreateFromAfromB(req, res);
            }


            if (data != null) {
                res.send({ status: true });
            } else {
                res.send({ status: false });
            }
        })
    } else {
        deletequery = "update firs set readyforverify=false,secondverify_at='" + moment().format() + "',secondverify_by=" + req.session.user.user.id + ",imagestatus=" + req.body.imagestatus + ",secondverifyremarks='" + req.body.Verifyremarks + "' where id in (" + req.body.selectedfile.toString() + ")";
        letfldid = req.body.selectedfile.toString().split(",")[0];

        httpService.get("/firs/" + letfldid, req.body, function (node1) {
            let firdata = JSON.parse(node1);
            lettostage = "";
            if (req.body.imagestatus == 1) {
                lettostage = "Image QC";
            } else if (req.body.imagestatus == 2) {
                lettostage = "Classfication";
            }
            queryinsert = "INSERT INTO filereturnlogs(fir, users_by, action_at, pagecount, fromstage, tostage,remarks,pdfcount,scancount,qccount,metadatacount) VALUES (" + letfldid + "," + req.session.user.user.id + ",now()," + firdata.classficationpagecount + ",'L2 Rejected','" + lettostage + "','" + req.body.Verifyremarks + "'," + firdata.pdfpagecount + "," + firdata.scanpagecount + "," + firdata.qcpagecount + "," + firdata.metadatapage + ")";
            console.log("queryinsert.............", queryinsert)
            CIPAService.InsertexecuteSQL(queryinsert, function (batchdata) {
                CIPAService.UpdateexecuteSQL(deletequery, async function (data) {

                    if (data != null) {
                        res.send({ status: true });
                    } else {
                        res.send({ status: false });
                    }
                })
            })
        })
    }
 

}
DocumentverifyController.prototype.thirdverifybulkwithupload = async function (req, res) {
    var deletequery = "";
    if (req.body.imagestatus == 6) {
        deletequery = "update firs set thirdverify_at='" + moment().format() + "',thirdverify_by=" + req.session.user.user.id + ",thirdverify=true where id in (" + req.body.selectedfile.toString() + ")";
        CIPAService.UpdateexecuteSQL(deletequery, async function (data) {
            if (req.body.imagestatus == 6) {
                uploadTodms1(req);
            }

            if (data != null) {
                res.send({ status: true });
            } else {
                res.send({ status: false });
            }
        })
    }

    else {
        letfldid = req.body.selectedfile.toString().split(",")[0];

        httpService.get("/firs/" + letfldid, req.body, function (node1) {
            let firdata = JSON.parse(node1);
            lettostage = "";
            if (req.body.imagestatus == 1) {
                lettostage = "Image QC";
            } else if (req.body.imagestatus == 2) {
                lettostage = "Classfication";
            }
            updatesign = "update classficationfiles set firstsign=false,secondsign=false where id in (select  cf.id from classficationfiles cf  where cf.issubchild=false  and (cf.ocrpdfpath is not null or cf.ocrpdfpath !='') and cf.fir in (" + req.body.selectedfile + ") UNION  select chd.id from classficationfiles per join classficationfiles chd on chd.parent=per.id and per.issubchild=true where  per.issubchild=true   and (chd.ocrpdfpath != '' or chd.ocrpdfpath is not null)  and  per.fir in (" + req.body.selectedfile + ") )";
            deletequery = "update firs set secondverify=false,readyforverify=false,thirdverify_at='" + moment().format() + "',thirdverify_by=" + req.session.user.user.id + ",imagestatus=" + req.body.imagestatus + ",thirdverifyremarks='" + req.body.Verifyremarks + "' where id in (" + req.body.selectedfile.toString() + ")";

            updateFORM_A = "delete from classficationfiles where fir in (" + req.body.selectedfile + ") and documenttype ='" + Form_A_DocumentID + "'";

            queryinsert = "INSERT INTO filereturnlogs(fir, users_by, action_at, pagecount, fromstage, tostage,remarks,pdfcount,scancount,qccount,metadatacount) VALUES (" + letfldid + "," + req.session.user.user.id + ",now()," + firdata.classficationpagecount + ",'L3 Rejected','" + lettostage + "','" + req.body.Verifyremarks + "'," + firdata.pdfpagecount + "," + firdata.scanpagecount + "," + firdata.qcpagecount + "," + firdata.metadatapage + ")";
            console.log("queryinsert.............", queryinsert)
            CIPAService.InsertexecuteSQL(queryinsert, function (batchdata) {
                CIPAService.UpdateexecuteSQL(deletequery, async function (data1) {
                    CIPAService.UpdateexecuteSQL(updatesign, async function (data) {
                        CIPAService.DeleteeexecuteSQL(updateFORM_A, async function (data2) {
                            if (data != null && data2 != null) {
                                res.send({ status: true });
                            } else {
                                res.send({ status: false });
                            }
                        })
                    })
                })
            })
        })




    }


}



DocumentverifyController.prototype.updateclassficationSecondSign = async function (req, res) {
    let updatequery = "update classficationfiles set secondsign=true where id in (" + req.body.classficationlist + ")";
    CIPAService.UpdateexecuteSQL(updatequery, function (data) {
        res.send({ status: true });
    })
}

async function getfile(fileid, req) {
    return new Promise((resolve, reject) => {
        httpService.get("/findfirbyQuery?id=" + fileid, req.body, async function (node1) {
            resolve(JSON.parse(node1));
        })
    })
}
async function getclassficationbyfilewait(fileid, request) {
    return new Promise((resolve, reject) => {
        httpService.get("/classficationfiles?isupload=false&fir=" + fileid, request.body, async function (node1) {
            resolve(JSON.parse(node1));
        })
    })
}

async function uploadTodms1(req) {
   
    // console.log("req.body.selectedfile", req.body.selectedfile)
    let filelist = req.body.selectedfile;
    const AxiosUtil = new AxiosUpdateToDMS();
    for (const fileid of filelist) {
       
        let node1 = await getfile(fileid, req);
            let itemdspaceobject = [];
            let classficationArray = [];
            // itemdspaceobject['matadata'] = [];
        firs = node1;
        var elm = firs[0];
            
        for (let meta of elm.metadatavalues) {
            if (meta.value != null && meta.value != "" && meta.value.trim() != "") {
                for (let value of meta.value.split('||')) {
                            if (value != "" && value.trim() != "") {
                                // console.log("value==" + value + "@@@@@@@@")
                                itemdspaceobject.push({
                                    "op": "add",
                                    "path": "/metadata/" + meta.metadatum.entityname + "/-",
                                    "value": [{
                                        "value": value.trim(),
                                        "language": null,
                                    }]
                                })
                            }

                        }




                    }
                }//metadata loop
                // console.log(elm.caseno)
                // console.log(elm.crn)
                itemdspaceobject.push({
                    "op": "add",
                    "path": "/metadata/dc.title/-",
                    "value": [{
                        "value": elm.caseno,
                        "language": null,
                    }]
                })
                 itemdspaceobject.push({
                     "op": "add",
                     "path": "/metadata/casefile.digitization.NoOfPages/-",
                     "value": [{
                         "value": elm.pdfpagecount==null ? '' : elm.pdfpagecount.toString(),
                         "language": null,
                     }]
                 })
                itemdspaceobject.push({
                    "op": "add",
                    "path": "/metadata/casefile.case.typename/-",
                    "value": [{
                        "value": elm.casetype,
                        "language": null,
                    }]
                })
                itemdspaceobject.push({
                    "op": "add",
                    "path": "/metadata/casefile.case.registrationyear/-",
                    "value": [{
                        "value": elm.year,
                        "language": null,
                    }]
                })
                itemdspaceobject.push({
                    "op": "add",
                    "path": "/metadata/dspace.entity.type/-",
                    "value": [{
                        "value": 'CaseFile',
                        "language": null,
                    }]
                })
                //classfincation start here

                    let nodeclass = await getclassficationbyfilewait(elm.id, req);
                    classficationArray = nodeclass;

                    let data = {
                        communityname: communityname_center,
                        collection: firs[0].year,
                        matadata: itemdspaceobject,
                        classfication: classficationArray,
                        itemid: (elm.itemid == null || elm.itemid == "") ? null : elm.itemid,
                        firid: elm.id,

        };
        // console.log("fileid.............========================================")
        // console.log(JSON.stringify( data))
        // console.log("fileid.............========================================")
        //res.send({ status: true, data: data });
                    /// return false;
                   //  res.send({ status: true, data: data });
                    try {
                       
                        let dataa = await AxiosUtil.post("api/admin/dspace/uploadDsapceByworkflow", { data }, 'application/json');
                            console.log("-------------------", dataa.data);
                            if (dataa.status == 200) {
                                try {
                                    console.log("-------------", dataa.data.data.status);
                                    console.log("-------------", dataa.data.message);
                                    // var deletequery = "update  firs set uploadmsg='" + dataa.data.message + "',isupload=true,setuploadfile=true,upload_at='" + moment().format() + "' where id=" + fileid;

                                    // CIPAService.UpdateexecuteSQL(deletequery, function (data) {
                                    //     return true;
                                    // })
                                    if (dataa.data.data.status) {
                                        var deletequery = "update  firs set uploadmsg='" + dataa.data.message + "',isupload=true,setuploadfile=true,upload_at='" + moment().format() + "' where id=" + fileid;

                                        CIPAService.UpdateexecuteSQL(deletequery, function (data) {
                                            return true;
                                        })
                                    } else {
                                        var deletequery = "update  firs set uploadmsg='" + dataa.data.data.message + "',isupload=false,setuploadfile=false where id=" + fileid;

                                        CIPAService.UpdateexecuteSQL(deletequery, function (data) {
                                            return true;
                                        })
                                    }

                                } catch (err) {
                                    return true;
                                    //console.log("ITEM CREATE ERROR>>>>>", err)
                                }
                            } else {
                                var deletequery = "update  firs set uploadmsg='" + dataa.data.message + "',isupload=false,setuploadfile=false where id=" + fileid;

                                CIPAService.UpdateexecuteSQL(deletequery, function (data) {
                                    return true;
                                })
                            }

                       
                    } catch (err) {
                        var deletequery = "update  firs set uploadmsg='" + err + "',isupload=false,setuploadfile=false where id=" + fileid;

                        CIPAService.UpdateexecuteSQL(deletequery, function (data) {
                            return true;
                        })
                    }



          

    }
}
DocumentverifyController.prototype.getdocumentclassficationByfir = async function (req, res) {
    let sendtoSign = "select  cf.* from classficationfiles cf  where   cf.fir in (" + req.query.fir + ")  ";
    //console.log(sendtoSign)
    let dataPDF = await CIPAService.executeSQLOnlyDatawithwait(sendtoSign);
    
    res.send({ status: true, data: dataPDF });
}

DocumentverifyController.prototype.findfilefromSeachInVerify = function (req, res) {

    httpService.get(encodeURI("/findfirbyQuery?casetype=" + req.query.casetype + "&year=" + req.query.caseyear + "&caseno=" + req.query.caseno + "&inwardstatus=1&imagestatus=5&qcreject=false&_sort=crn:asc&readyforverify=true&_limit=-1"), req.body, function (allbatch) {
        allbatch = JSON.parse(allbatch)
        //console.log(allbatch.statusCode)
        res.send({ status: true, data: allbatch });


    })
}



DocumentverifyController.prototype.verifyFile = function (req, res) {
    req.body.verify_by = req.session.user.user.id;
    req.body.verify_at = new Date();
    try {
        httpService.put("/firs/" + req.params.id, req.body, function (node1) {
            res.send({ status: true, data: JSON.parse(node1) });
        })
    } catch (error) {
        res.send({ status: false });
    }

}

DocumentverifyController.prototype.rejectforMetadatathidverify = function (req, res) {
    req.body.thidverify_by = req.session.user.user.id;
    req.body.thidverify_at = new Date();

    try {
        httpService.put("/firs/" + req.body.id, req.body, function (node1) {
            res.send({ status: true, data: JSON.parse(node1) });
        })
    } catch (error) {
        res.send({ status: false });
    }

}
DocumentverifyController.prototype.rejectforMetadatasecondverify = function (req, res) {
    req.body.secondverify_by = req.session.user.user.id;
    req.body.secondverify_at = new Date();

    try {
        httpService.put("/firs/" + req.body.id, req.body, function (node1) {
            res.send({ status: true, data: JSON.parse(node1) });
        })
    } catch (error) {
        res.send({ status: false });
    }

}

DocumentverifyController.prototype.rejectforMetadata = function (req, res) {
    req.body.verify_by = req.session.user.user.id;
    req.body.verify_at = new Date();

    try {
        httpService.put("/firs/" + req.body.id, req.body, function (node1) {
            res.send({ status: true, data: JSON.parse(node1) });
        })
    } catch (error) {
        res.send({ status: false });
    }

}





DocumentverifyController.prototype.getpdf = function (req, res) {
    httpService.get(encodeURI("/classficationfiles/" + req.query.id), req.body, function (node1) {
        files = JSON.parse(node1);
        if (files.ocrpdfpath == null) {
            //  res.setHeader('Content-Type', 'application/pdf');
            res.status(500).send('Pdf path not available');
        }
        else if (files.ocrpdfpath.length == 0) {
            //  res.setHeader('Content-Type', 'application/pdf');
            res.status(500).send('Pdf path not available');
        } else {
            let replacedString = files.ocrpdfpath.split('\\').join('/');
            console.log(replacedString);
            fs.readFile(replacedString, (err, data) => {
                if (err) {
                    //  res.setHeader('Content-Type', 'application/pdf');
                    console.error('Error reading PDF:', err);
                    res.status(500).send('Error reading PDF' + replacedString);
                } else {
                    // Set the appropriate content-type for PDF
                    res.setHeader('Content-Type', 'application/pdf');
                    // Send the PDF data as the response
                    res.send(data);
                }
            });
        }


    })
    // Read the PDF file using fs.readFile

}

DocumentverifyController.prototype.getclassficationmodal = function (req, res) {
    httpService.get(encodeURI("/classficationfiles/" + req.query.id), req.body, function (node1) {
        res.send({ status: true, data: JSON.parse(node1) });
    })
}
DocumentverifyController.prototype.updatedocumentclassficationByfir = function (req, res) {
    httpService.put("/classficationfiles/" + req.query.id, req.body, function (node) {
        node = JSON.parse(node)
        res.send({ status: true, data: node });

    })
}

async function getbatchByFire(firs) {
    var batchs = []
    var lockbatch = [];
    await firs.forEach(elm => {
        var picked = batchs.find(o => o.id === elm.batch.id);
        var firobj;
        if (elm.islock) {

            var fir = []
            fir.push(elm);
            lockbatch.push({ id: elm.batch.id, bundlenumber: elm.batch.bundlenumber, fir: fir })
        } else {
            firobj = elm;
        }
        if (picked == undefined) {
            var fir = []
            fir.push(firobj);
            batchs.push({ id: elm.batch.id, bundlenumber: elm.batch.bundlenumber, fir: fir })
        } else {
            picked.fir.push(firobj);
        }
    })
    if (lockbatch.length != 0) {
        return lockbatch;
    } else {
        return batchs;
    }

}
module.exports = new DocumentverifyController();