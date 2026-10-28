var httpService = require('../service/httpService.js')
var BatchNoGenrate = require('../util/batchNumberGenrate.js')
var moment = require('moment');
const AxiosUpdateToDMS = require("../service/AxiosUpdateToDMS")
var LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');
const fs = require('fs');
const path = require('path');
var CIPAService = require("../service/CIPAService");
var CaseService = require("../service/CaseService");
var DigitizationApiService = require("../service/DigitizationApiService");
var communityname_center = "Ernakulam";
var FORAM_AB_PATH = "/mnt/server/ocr";
var Form_A_DocumentID = 'd7906485-028b-4ded-b485-c8a0c6ab32fd';

const PDFDocument = require("pdfkit");

function safeParse(node, fallback) {
    try {
        var parsed = JSON.parse(node);
        return (parsed === null || parsed === undefined) ? fallback : parsed;
    } catch (e) {
        return fallback;
    }
}

function escSql(val) {
    return String(val === null || val === undefined ? '' : val).replace(/'/g, "''");
}

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
        try {
            res.send({ status: true, data: JSON.parse(node1) });
        } catch (e) {
            res.send({ status: false, data: [] });
        }
    })
}
DocumentverifyController.prototype.secondtimebulkverifyfile = async function (req, res) {
    try {
        var cisUpload = await uploadCaseToCis(req);
        res.send({ status: true, cisUpload: cisUpload });
    } catch (err) {
        console.error('secondtimebulkverifyfile error:', err.message);
        res.send({ status: false, error: err.message });
    }
    // var deletequery = "update firs set isupload=true where id in (" + req.body.selectedfile.toString() + ")"; //console.log(deletequery)
    // CIPAService.UpdateexecuteSQL(deletequery, function (data) {
    //    uploadCaseToCis(req);
    //     res.send({ status: true });
    // })

}

DocumentverifyController.prototype.documentverifySinglepageVerify = function (req, res) {
    // console.log(res.locals)
    res.render('documentverifySingle', { title: 'Document Verify', locals: res.locals });
}
DocumentverifyController.prototype.getbstches = function (req, res) {

    query = 'SELECT  b.id, b.bundlenumber AS bundlenumber FROM  firs f JOIN   batches b ON b.id = f.batch  where f.inwardstatus=1 and f.readyforverify = true and  f.imagestatus=5 GROUP BY  b.id, b.bundlenumber ORDER BY  b.bundlenumber';
    CIPAService.executeSQL(query, function (batchdata) {
        let date = [];
        let department = (req.session.user.user.department || '').split(",");
        for (var batch of (batchdata && batchdata[0]) || []) {
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
        let department = (req.session.user.user.department || '').split(",");
        for (var batch of (batchdata && batchdata[0]) || []) {
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
        let department = (req.session.user.user.department || '').split(",");
        for (var batch of (batchdata && batchdata[0]) || []) {
            if (department.includes(batch.bundlenumber.substring(0, batch.bundlenumber.lastIndexOf('-')))) {
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
async function saveClassfilcation(url, body) {
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

    let sendtoSign = "select  cf.id,ocrpdfpath from classficationfiles cf  where  (cf.secondsign=false or cf.secondsign is null) and (cf.ocrpdfpath is not null or cf.ocrpdfpath !='') and cf.fir in (" + req.body.selectedfile + ") ";

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
        res.send({ status: true, data: safeParse(node1, []) });
    })
}
DocumentverifyController.prototype.findFIrsbybathcsecondverify = function (req, res) {
    httpService.get("/findfirbyQuery?imagestatus=6&readyforverify=true&secondverify_ne=true&isupload=false&batch=" + req.query.batch + "&_limit=-1", req.body, function (node1) {
        res.send({ status: true, data: safeParse(node1, []) });
    })
}
DocumentverifyController.prototype.findFIrsbybathcthidverify = function (req, res) {
    httpService.get("/findfirbyQuery?imagestatus=6&readyforverify=true&isupload=false&secondverify=true&thirdverify_ne=true&batch=" + req.query.batch + "&_limit=-1", req.body, function (node1) {
        res.send({ status: true, data: safeParse(node1, []) });
    })
}

DocumentverifyController.prototype.findFIrsbybathcForFirstTime = function (req, res) {
    httpService.get("/firs?imagestatus=5&readyforverify=false&batch=" + req.query.batch + "&_limit=-1", req.body, function (node1) {
        res.send({ status: true, data: safeParse(node1, []) });
    })
}
DocumentverifyController.prototype.bulverifyfile = async function (req, res) {
    var deletequery = "";
    if (req.body.imagestatus == 6) {
        deletequery = "update firs set verify_at=NOW(),verify_by=" + req.session.user.user.id + ",imagestatus=" + req.body.imagestatus + " where id in (" + req.body.selectedfile.toString() + ")";
        CIPAService.UpdateexecuteSQL(deletequery, async function (data) {

            if (data != null) {
                res.send({ status: true });
            } else {
                res.send({ status: false });
            }
        })
    } else {
        deletequery = "update firs set readyforverify=false,verify_at=NOW(),verify_by=" + req.session.user.user.id + ",imagestatus=" + req.body.imagestatus + ",verifyremarks='" + escSql(req.body.Verifyremarks) + "' where id in (" + req.body.selectedfile.toString() + ")";
        letfldid = req.body.selectedfile.toString().split(",")[0];

        httpService.get("/firs/" + letfldid, req.body, function (node1) {
            let firdata = safeParse(node1, {});
            lettostage = "";
            if (req.body.imagestatus == 1) {
                lettostage = "Image QC";
            } else if (req.body.imagestatus == 2) {
                lettostage = "Classfication";
            }
            queryinsert = "INSERT INTO filereturnlogs(fir, users_by, action_at, pagecount, fromstage, tostage,remarks,pdfcount,scancount,qccount,metadatacount) VALUES (" + letfldid + "," + req.session.user.user.id + ",now()," + (firdata.classficationpagecount || 0) + ",'L1 Rejected','" + lettostage + "','" + escSql(req.body.Verifyremarks) + "'," + (firdata.pdfpagecount || 0) + "," + (firdata.scanpagecount || 0) + "," + (firdata.qcpagecount || 0) + "," + (firdata.metadatapage || 0) + ")";
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
        await uploadCaseToCis(req);
        res.send({ status: true });
        // deletequery = "update firs set secondverify_at=NOW(),secondverify_by=" + req.session.user.user.id + ",secondverify=true,imagestatus=" + req.body.imagestatus + " where id in (" + req.body.selectedfile.toString() + ")";
        // CIPAService.UpdateexecuteSQL(deletequery, async function (data) {
        //        // CreateFromAfromB(req, res);
        //     if (data != null) {
        //         res.send({ status: true });
        //     } else {
        //         res.send({ status: false });
        //     }
        // })
    } else {
        deletequery = "update firs set readyforverify=false,secondverify_at=NOW(),secondverify_by=" + req.session.user.user.id + ",imagestatus=" + req.body.imagestatus + ",secondverifyremarks='" + escSql(req.body.Verifyremarks) + "' where id in (" + req.body.selectedfile.toString() + ")";
        letfldid = req.body.selectedfile.toString().split(",")[0];

        httpService.get("/firs/" + letfldid, req.body, function (node1) {
            let firdata = safeParse(node1, {});
            lettostage = "";
            if (req.body.imagestatus == 1) {
                lettostage = "Image QC";
            } else if (req.body.imagestatus == 2) {
                lettostage = "Classfication";
            } else if (req.body.imagestatus == 5) {
                lettostage = "First Verify";
            }
            queryinsert = "INSERT INTO filereturnlogs(fir, users_by, action_at, pagecount, fromstage, tostage,remarks,pdfcount,scancount,qccount,metadatacount) VALUES (" + letfldid + "," + req.session.user.user.id + ",now()," + (firdata.classficationpagecount || 0) + ",'L2 Rejected','" + lettostage + "','" + escSql(req.body.Verifyremarks) + "'," + (firdata.pdfpagecount || 0) + "," + (firdata.scanpagecount || 0) + "," + (firdata.qcpagecount || 0) + "," + (firdata.metadatapage || 0) + ")";
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
        deletequery = "update firs set thirdverify_at=NOW(),thirdverify_by=" + req.session.user.user.id + ",thirdverify=true where id in (" + req.body.selectedfile.toString() + ")";
        CIPAService.UpdateexecuteSQL(deletequery, async function (data) {
            var cisUpload = null;
            if (req.body.imagestatus == 6) {
                // uploadTodms1(req);
                try {
                    cisUpload = await uploadCaseToCis(req);
                } catch (cisErr) {
                    console.error('uploadCaseToCis outer error:', cisErr.message);
                    cisUpload = { total: 0, uploaded: 0, skipped: 0, failed: 0, results: [], error: cisErr.message };
                }
            }

            if (data != null) {
                res.send({ status: true, cisUpload: cisUpload });
            } else {
                res.send({ status: false });
            }
        })
    }

    else {
        letfldid = req.body.selectedfile.toString().split(",")[0];

        httpService.get("/firs/" + letfldid, req.body, function (node1) {
            let firdata = safeParse(node1, {});
            lettostage = "";
            if (req.body.imagestatus == 1) {
                lettostage = "Image QC";
            } else if (req.body.imagestatus == 2) {
                lettostage = "Classfication";
            } else if (req.body.imagestatus == 5) {
                lettostage = "First Verify";
            }
            updatesign = "update classficationfiles set firstsign=false,secondsign=false where id in (select  cf.id from classficationfiles cf  where cf.issubchild=false  and (cf.ocrpdfpath is not null or cf.ocrpdfpath !='') and cf.fir in (" + req.body.selectedfile + ") UNION  select chd.id from classficationfiles per join classficationfiles chd on chd.parent=per.id and per.issubchild=true where  per.issubchild=true   and (chd.ocrpdfpath != '' or chd.ocrpdfpath is not null)  and  per.fir in (" + req.body.selectedfile + ") )";
            deletequery = "update firs set secondverify=false,readyforverify=false,thirdverify_at=NOW(),thirdverify_by=" + req.session.user.user.id + ",imagestatus=" + req.body.imagestatus + ",thirdverifyremarks='" + escSql(req.body.Verifyremarks) + "' where id in (" + req.body.selectedfile.toString() + ")";

            updateFORM_A = "delete from classficationfiles where fir in (" + req.body.selectedfile + ") and documenttype ='" + Form_A_DocumentID + "'";

            queryinsert = "INSERT INTO filereturnlogs(fir, users_by, action_at, pagecount, fromstage, tostage,remarks,pdfcount,scancount,qccount,metadatacount) VALUES (" + letfldid + "," + req.session.user.user.id + ",now()," + (firdata.classficationpagecount || 0) + ",'L3 Rejected','" + lettostage + "','" + escSql(req.body.Verifyremarks) + "'," + (firdata.pdfpagecount || 0) + "," + (firdata.scanpagecount || 0) + "," + (firdata.qcpagecount || 0) + "," + (firdata.metadatapage || 0) + ")";
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
            try {
                resolve(JSON.parse(node1) || []);
            } catch (e) {
                resolve([]);
            }
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

// Upload digitized case details to CIS after third-level approval.
// If the CINO already exists in CIS -> PUT (update), otherwise -> POST (create).
async function uploadCaseToCis(req) {
    var summary = { total: 0, uploaded: 0, skipped: 0, failed: 0, results: [] };
    var firIds = String(req.body.selectedfile).toString().split(',');
    for (var i = 0; i < firIds.length; i++) {
        var firId = parseInt(firIds[i], 10);
        if (!firId) continue;
        summary.total++;
        try {
            var detail = await CaseService.getCaseByFir(firId);
            if (!detail) {
                console.log('uploadCaseToCis: no case details saved for fir ' + firId + ' - skipping CIS upload');
                summary.skipped++;
                summary.results.push({ fir: firId, status: 'skipped', reason: 'no case details' });
                continue;
            }
            var caseJson = detail.toJSON ? detail.toJSON() : detail;
            var classDocs = await getClassficationDocs(firId, req);
            var cisPayload = buildCisPayload(caseJson, classDocs);
            // fir.cisfound=false -> POST (create); true -> PUT (update)
            var firData = await getfile(firId, req);
            var existsInCis = !!(Array.isArray(firData) && firData[0] && firData[0].cisfound);

            console.log("cisPayload,,,existsInCis................", cisPayload)
            var result = await DigitizationApiService.pushDigitizedEntry(cisPayload, existsInCis);
            if (result && result.success !== false && result.status !== false) {
                var firupdate = "update firs set isupload=true,upload_at=NOW() where id in (" + firId + ")";
                await new Promise(function (resolve) {
                    CIPAService.UpdateexecuteSQL(firupdate, function () { resolve(); });
                });
                summary.uploaded++;
                summary.results.push({ fir: firId, cino: caseJson.cino, status: existsInCis ? 'updated' : 'created' });
                console.log('uploadCaseToCis: fir ' + firId + ' cino ' + caseJson.cino + ' ' +
                    (existsInCis ? 'updated' : 'created') + ' in CIS ->', JSON.stringify(result));
            } else {
                summary.failed++;
                summary.results.push({ fir: firId, cino: caseJson.cino, status: 'rejected', response: result });
                console.error('uploadCaseToCis: CIS rejected fir ' + firId + ' ->', JSON.stringify(result));
            }
        } catch (err) {
            console.log(err)
            var apiErr = err.response && err.response.data &&
                (err.response.data.error || err.response.data.message);
            var errMsg = apiErr || err.message;
            summary.failed++;
            summary.results.push({ fir: firId, cino: caseJson && caseJson.cino, status: 'error', error: errMsg });
            console.error('uploadCaseToCis failed for fir ' + firId + ':', errMsg);
        }
    }
    return summary;
}

function getClassficationDocs(firId, req) {
    return new Promise(function (resolve) {
        httpService.get(encodeURI("/classficationfiles?fir=" + firId + "&_sort=id:asc&_limit=-1"), req.body, function (node) {
            try {
                var list = JSON.parse(node);
                resolve(Array.isArray(list) ? list : []);
            } catch (e) {
                resolve([]);
            }
        });
    });
}

function cisStrip(row) {
    var r = Object.assign({}, row);
    delete r.id;
    delete r.case_detail_id;
    delete r.createdAt;
    delete r.updatedAt;
    return r;
}

function cisHistory(row) {
    var r = cisStrip(row);
    r.nextDate = r.nextdate !== undefined ? r.nextdate : null;
    delete r.nextdate;
    if (r.contestedUnContested !== undefined) {
        r.contestedUncontested = r.contestedUnContested;
        delete r.contestedUnContested;
    }
    return r;
}

function cisMainParty(r) {
    if (!r) return null;
    return {
        name: r.name,
        address: r.address,
        isPartyInPerson: r.isPartyInPerson || false,
        mobileNumber: r.mobileNumber,
        isHidden: r.isHidden || false,
        legalHeir: r.legalHeir,
        advocate: {
            name: r.advName,
            code: (r.advCode !== null && r.advCode !== undefined) ? String(r.advCode) : null,
            regNo: r.advReg
        }
    };
}

function cisAdvGroups(rows) {
    var map = {}, keys = [];
    (rows || []).forEach(function (r) {
        var key = [r.partyNo, r.partyId, r.partyType].join('_');
        if (!map[key]) {
            map[key] = { partyNo: r.partyNo, partyId: r.partyId, partyType: r.partyType, advocates: [] };
            keys.push(key);
        }
        map[key].advocates.push({
            name: r.advName,
            code: (r.advCode !== null && r.advCode !== undefined) ? String(r.advCode) : null,
            regNo: r.advReg
        });
    });
    return keys.map(function (k) { return map[k]; });
}

function normCisPath(p) {
    return String(p || '').replace(/\\/g, '/').toLowerCase();
}

// documents[] = saved case_documents rows + classification PDFs not mapped to any IA/Order,
// renumbered sequentially 1,2,3,... in classification id order.
function cisDocuments(cd, classDocs) {
    var docs = (cd.case_documents || []).map(cisStrip);
    var mappedPaths = {};
    (cd.ia_filings || []).forEach(function (r) { if (r.documentPath) mappedPaths[normCisPath(r.documentPath)] = true; });
    (cd.order_details || []).forEach(function (r) { if (r.documentPath) mappedPaths[normCisPath(r.documentPath)] = true; });
    (classDocs || []).forEach(function (cf) {
        var p = cf.ocrpdfpath;
        if (!p || mappedPaths[normCisPath(p)]) return;
        docs.push({
            partyNo: null,
            partyType: null,
            documentType: cf.documenttype,
            documentName: String(p).split(/[\\/]/).pop(),
            documentTitle: cf.documenttypename,
            description: cf.documentdesc,
            remarks: cf.documentremark,
            documentPath: p,
            advReg: null,
            advCode: null,
            filedDate: cf.documentdate,
            documentOrder: null,
            fileSize: cf.filesize,
            fileExtension: 'pdf'
        });
    });
    docs.forEach(function (d, idx) { d.documentOrder = idx + 1; });
    return docs;
}

// Build the CIS digitizedEntry payload from a local case (CaseService.getCaseByFir toJSON)
// in the same shape the CIS fetch API returns.
function buildCisPayload(cd, classDocs) {
    var crime = (cd.crime_details || [])[0];
    var parties = cd.main_parties || [];
    return {
        caseDetails: {
            cino: cd.cino,
            efilno: cd.efilno,
            dateOfEfiling: cd.dateOfEfiling,
            filNo: cd.filNo,
            filYear: cd.filYear,
            dateOfFiling: cd.dateOfFiling,
            dateOfScrutiny: cd.dateOfScrutiny,
            regNo: cd.regNo,
            regYear: cd.regYear,
            dtRegis: cd.dtRegis,
            typeName: cd.typeName,
            caseType: cd.caseType,
            ciCri: (cd.ciCri !== undefined) ? cd.ciCri : null,
            status: cd.status,
            dateFirstList: cd.dateFirstList,
            dateNextList: cd.dateNextList,
            dateLastList: cd.dateLastList,
            dateOfDecision: cd.dateOfDecision,
            dateFilingDisp: cd.dateFilingDisp,
            dateFilingDispO: cd.dateFilingDispO,
            dispNature: cd.dispNature,
            courtNo: cd.courtNo,
            policeStCode: cd.policeStCode,
            firNo: crime ? crime.firNo : null,
            firYear: crime ? crime.firYear : null,
            mainCaseNo: cd.mainCaseNo,
            subject: cd.subject,
            caseNo: cd.caseNo,
            mainMatterCino: cd.mainMatterCino
        },
        additionalSubjects: (cd.additional_subjects || []).map(function (r) {
            return { subjectCode: r.subjectcode };
        }),
        mainparties: {
            petitioner: cisMainParty(parties.filter(function (r) { return r.partytype == 1; })[0]),
            respondent: cisMainParty(parties.filter(function (r) { return r.partytype == 2; })[0])
        },
        extraParties: (cd.extra_parties || []).map(cisStrip),
        additionalAdvocates: cisAdvGroups(cd.additional_advocates),
        otherParties: (cd.other_parties || []).map(cisStrip),
        victims: (cd.victims || []).map(cisStrip),
        witness: (cd.witnesses || []).map(cisStrip),
        caveat: (cd.caveats || []).map(cisStrip),
        act: (cd.case_acts || []).map(cisStrip),
        factDetails: (cd.fact_details || []).map(cisStrip),
        causeofaction: (cd.cause_of_actions || []).map(cisStrip),
        iaFiling: (cd.ia_filings || []).map(cisStrip),
        caseHistory: (cd.case_histories || []).map(cisHistory),
        iaHistory: (cd.ia_histories || []).map(cisHistory),
        proceedingsPresence: (cd.proceedings_presences || []).map(cisStrip),
        trialCourtDetails: (cd.trial_court_details || []).map(cisStrip),
        crimeDetails: (cd.crime_details || []).map(cisStrip),
        transferDetails: (cd.transfer_details || []).map(cisStrip),
        orderDetails: (cd.order_details || []).map(cisStrip),
        documents: cisDocuments(cd, classDocs)
    };
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
                "value": elm.pdfpagecount == null ? '' : elm.pdfpagecount.toString(),
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
                        var deletequery = "update  firs set uploadmsg='" + dataa.data.message + "',isupload=true,setuploadfile=true,upload_at=NOW() where id=" + fileid;

                        CIPAService.UpdateexecuteSQL(deletequery, function (data) {
                            // return true;
                        })
                    } else {
                        var deletequery = "update  firs set uploadmsg='" + dataa.data.data.message + "',isupload=false,setuploadfile=false where id=" + fileid;

                        CIPAService.UpdateexecuteSQL(deletequery, function (data) {
                            // return true;
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
    var firId = parseInt(req.query.fir, 10);
    if (!firId) return res.send({ status: true, data: [] });
    let sendtoSign = "select  cf.* from classficationfiles cf  where   cf.fir in (" + firId + ")  order by cf.id ";
    try {
        let dataPDF = await CIPAService.executeSQLOnlyDatawithwait(sendtoSign);
        res.send({ status: true, data: dataPDF });
    } catch (err) {
        console.error('getdocumentclassficationByfir error:', err.message);
        res.send({ status: false, data: [] });
    }
}

DocumentverifyController.prototype.findfilefromSeachInVerify = function (req, res) {

    httpService.get(encodeURI("/findfirbyQuery?casetype=" + req.query.casetype + "&year=" + req.query.caseyear + "&caseno=" + req.query.caseno + "&inwardstatus=1&imagestatus=5&qcreject=false&_sort=crn:asc&readyforverify=true&_limit=-1"), req.body, function (allbatch) {
        res.send({ status: true, data: safeParse(allbatch, []) });


    })
}



DocumentverifyController.prototype.verifyFile = function (req, res) {
    req.body.verify_by = req.session.user.user.id;
    req.body.verify_at = new Date();
    try {
        httpService.put("/firs/" + req.params.id, req.body, function (node1) {
            res.send({ status: true, data: safeParse(node1, {}) });
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
            res.send({ status: true, data: safeParse(node1, {}) });
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
            res.send({ status: true, data: safeParse(node1, {}) });
        })
    } catch (error) {
        res.send({ status: false });
    }

}





DocumentverifyController.prototype.getpdf = function (req, res) {
    httpService.get(encodeURI("/classficationfiles/" + req.query.id), req.body, function (node1) {
        var files = safeParse(node1, null);
        if (!files || files.ocrpdfpath == null) {
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
        res.send({ status: true, data: safeParse(node1, {}) });
    })
}
DocumentverifyController.prototype.updatedocumentclassficationByfir = function (req, res) {
    httpService.put("/classficationfiles/" + req.query.id, req.body, function (node) {
        res.send({ status: true, data: safeParse(node, {}) });

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