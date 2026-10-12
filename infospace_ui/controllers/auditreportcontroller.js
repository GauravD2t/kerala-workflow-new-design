var httpService = require('../service/httpService.js')
var moment = require('moment');
var CIPAService = require("../service/CIPAService");
const excel = require("exceljs");
function AuditReportController() {
}

AuditReportController.prototype.auditreport = (req, res) => {
    res.render('auditreport', { title: 'Audit Report', locals: res.locals });
}

AuditReportController.prototype.filestatusreport = (req, res) => {
    res.render('filestatusreport', { title: 'File change status Report', locals: res.locals });
}
AuditReportController.prototype.receiveReport = (req, res) => {
    res.render('inwardReport', { title: 'Inward Report', locals: res.locals });
}
AuditReportController.prototype.batchwisereport = (req, res) => {
    res.render('batchwisereport', { title: 'Batch Wise Report', locals: res.locals });
}

AuditReportController.prototype.pendingauditreport = (req, res) => {
    res.render('pendingaudit', { title: 'Pending Audit Report', locals: res.locals });
}
AuditReportController.prototype.ownworkingreport = (req, res) => {
    try {
        var starttime = moment(req.query.start + " 00:00:00", 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
        var endtime = moment(req.query.end + " 23:50:50", 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
        let userID = req.session.user.user.id;
        query = "select 'L1 Verify' as mode ,f.casetype || '/' || f.caseno || '/' || f.year as case_full,f.pdfpagecount, f.verify_at as verifydate,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch  where  f.imagestatus>=6 and f.readyforverify=true and f.verify_by=" + userID + " and f.verify_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' UNION ALL select 'L2 Verify' as mode ,f.casetype || '/' || f.caseno || '/' || f.year as case_full,f.pdfpagecount, f.secondverify_at as verifydate,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch  where  f.imagestatus>=6 and f.secondverify=true and f.secondverify_by=" + userID + " and f.secondverify_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' UNION ALL select 'L3 Verify' as mode ,f.casetype || '/' || f.caseno || '/' || f.year as case_full,f.pdfpagecount, f.thirdverify_at as verifydate,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch  where  f.imagestatus>=6 and f.thirdverify=true and f.thirdverify_by=" + userID + " and f.thirdverify_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "'   order by verifydate";
        CIPAService.executeSQLOnlyData(query, function (batchdata) {
            res.send({ status: true, data: batchdata });
        })//L1
    } catch (error) { 
        res.send({ status: false, data: [] }); 
    }
}
 
AuditReportController.prototype.ownworkingreportdownload = (req, res) => {
    try {
        var starttime = moment(req.query.start + " 00:00:00", 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
        var endtime = moment(req.query.end + " 23:50:50", 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
        let userID = req.session.user.user.id;
        query = "select 'L1 Verify' as mode ,f.casetype || '/' || f.caseno || '/' || f.year as case_full,f.pdfpagecount, f.verify_at as verifydate,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch  where  f.imagestatus>=6 and f.readyforverify=true and f.verify_by=" + userID + " and f.verify_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' UNION ALL select 'L2 Verify' as mode ,f.casetype || '/' || f.caseno || '/' || f.year as case_full,f.pdfpagecount, f.secondverify_at as verifydate,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch  where  f.imagestatus>=6 and f.secondverify=true and f.secondverify_by=" + userID + " and f.secondverify_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' UNION ALL select 'L3 Verify' as mode ,f.casetype || '/' || f.caseno || '/' || f.year as case_full,f.pdfpagecount, f.thirdverify_at as verifydate,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch  where  f.imagestatus>=6 and f.thirdverify=true and f.thirdverify_by=" + userID + " and f.thirdverify_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "'   order by verifydate";
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Progress Report");

        worksheet.columns = [
            { header: "Sl.NO", key: "srno", width: 5 },
            { header: "Bundle number", key: "bundlenumber", width: 30 },
            { header: "Case number", key: "case_full", width: 30 },
            { header: "Pages", key: "pdfpagecount", width: 20 },
            { header: "Mode", key: "mode", width: 20 },
            { header: "Date", key: "verifydate", width: 20 }
            
        ];

        CIPAService.executeSQLOnlyData(query, function (batchdata) {
            let tutorials = [];
            var counter = 1;
            batchdata.forEach(element => {
                tutorials.push({
                    srno: counter,
                    bundlenumber: element.bundlenumber,
                    case_full: element.case_full,
                    pdfpagecount: element.pdfpagecount,
                    mode: element.mode,
                    verifydate: element.verifydate ? moment(element.verifydate).format("DD/MM/YYYY HH:mm") : '',

                });

                counter++;
            });

            worksheet.addRows(tutorials);
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "ownReport.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });
           
        })//L1
    } catch (error) {
        res.send({ status: false, data: [] });
    }
}

AuditReportController.prototype.filestatusreportFilter = (req, res) => {
    var data = [];
    var starttime = req.query.start.split("-")[2] + "-" + req.query.start.split("-")[1] + "-" + req.query.start.split("-")[0] + " 00:00:00";
    var endtime = req.query.end.split("-")[2] + "-" + req.query.end.split("-")[1] + "-" + req.query.end.split("-")[0] + " 23:59:59";
   
    var fromStage = req.query.fromstage;
    var query = "";
    if (fromStage == "") {
        query = "select up.name,fs.fromstage,fs.tostage,fs.action_at,fs.remarks as remakrsdata,fs.pagecount as datacount,f.*,b.bundlenumber as bundlenumber from filereturnlogs fs join firs f on fs.fir=f.id join batches b on b.id=f.batch join 'users-permissions_user' up on up.id=fs.users_by where  fs.action_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' order by fs.id";
    } else if (fromStage != "") {
        query = "select up.name,fs.fromstage,fs.tostage,fs.action_at,fs.remarks as remakrsdata,fs.pagecount as datacount,f.*,b.bundlenumber as bundlenumber from filereturnlogs fs join firs f on fs.fir=f.id join batches b on b.id=f.batch join 'users-permissions_user' up on up.id=fs.users_by where  fs.action_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' and fs.remarks is not null and fs.fromstage='" + fromStage + "' order by fs.id";

     }
        query = query.replace(/'users/g, '"users');
    query = query.replace(/user'/g, 'user"');

    CIPAService.executeSQL(query, function (batchdata) {
        var resdata = batchdata[0];
        // res.send({ status: true, data: resultbat });
        resdata.forEach(element => {
            data.push({
                casetype: element.casetype + "/" + element.caseno + "/" + element.year, bundlenumber: element.bundlenumber, username: element.name, pagecount: element.datacount, action_at: moment(element.action_at).format("DD/MM/YYYY hh:mm A"), fromstage: element.fromstage, tostage: element.tostage, remarks: element.remakrsdata })
        });
        res.send({ status: true, data: data });
    })

}
AuditReportController.prototype.filestatusreportFilterexcle = (req, res) => {
    var data = [];
    var starttime = req.query.start.split("-")[2] + "-" + req.query.start.split("-")[1] + "-" + req.query.start.split("-")[0] + " 00:00:00";
    var endtime = req.query.end.split("-")[2] + "-" + req.query.end.split("-")[1] + "-" + req.query.end.split("-")[0] + " 23:59:59";
   
    var fromStage = req.query.fromstage;
    var query = "";
    if (fromStage == "") {
        query = "select fs.pagecount as classdatacount,fs.scancount,fs.qccount,fs.pdfcount,fs.metadatacount,up.name,fs.fromstage,fs.tostage,fs.action_at,fs.remarks as remakrsdata,f.*,b.bundlenumber as bundlenumber from filereturnlogs fs join firs f on fs.fir=f.id join batches b on b.id=f.batch join 'users-permissions_user' up on up.id=fs.users_by where  fs.action_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' order by fs.id";
    } else if (fromStage != "") {
        query = "select fs.pagecount as classdatacount,fs.scancount,fs.qccount,fs.pdfcount,fs.metadatacount,up.name,fs.fromstage,fs.tostage,fs.action_at,fs.remarks as remakrsdata,f.*,b.bundlenumber as bundlenumber from filereturnlogs fs join firs f on fs.fir=f.id join batches b on b.id=f.batch join 'users-permissions_user' up on up.id=fs.users_by where  fs.action_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' and fs.remarks is not null and fs.fromstage='" + fromStage + "' order by fs.id";
     }
        
        query = query.replace(/'users/g, '"users');
    query = query.replace(/user'/g, 'user"');

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Inward Report");
    worksheet.columns = [
        { header: "Sl.NO", key: "srno", width: 5 },
        { header: "Case number", key: "casenumber", width: 10 },
        { header: "Bundle number", key: "bundlenumber", width: 10 },
        { header: "Action By", key: "username", width: 10 },
        { header: "Action At", key: "date", width: 10 },
        { header: "From Stage", key: "fromstage", width: 10 },
        { header: "To Stage", key: "tostage", width: 10 },
        { header: "Scan Page Count", key: "scanpagecount", width: 10 },
        { header: "QC Page Count", key: "qcpagecount", width: 10 },
        { header: "Metadata Page Count", key: "metadatapagecount", width: 10 },
        { header: "Classification Page Count", key: "classpagecount", width: 10 },
        { header: "PDF Page Count", key: "pdfpagecount", width: 10 },

        
        { header: "Remarks", key: "remarks", width: 10 }
    ];
    CIPAService.executeSQL(query, function (batchdata) {
        var resdata = batchdata[0];
        let tutorials = [];
        var counter = 1;

        
        resdata.forEach(element => {
            tutorials.push({
                srno: counter++,
                casenumber: element.casetype + "/" + element.caseno + "/" + element.year, bundlenumber: element.bundlenumber, username: element.name, classpagecount: element.classdatacount, date: moment(element.action_at).format("DD/MM/YYYY hh:mm A"), fromstage: element.fromstage, tostage: element.tostage, remarks: element.remakrsdata, scanpagecount: element.scancount, qcpagecount: element.qccount, pagecount: element.pagecount, pdfpagecount: element.pdfcount, metadatapagecount: element.metadatacount
            })
            
        });
        worksheet.addRows(tutorials);
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "FilestatuschangeReport.xlsx"
        );
        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });

        
    })

}
AuditReportController.prototype.auditreportfilter = (req, res) => {
    var data = [];
    var action = req.query.action;

    //var starttime = moment(req.query.start + " 00:00:00", 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    // var endtime = moment(req.query.end + " 23:50:50", 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');

    var starttime = req.query.start.split("/")[2] + "-" + req.query.start.split("/")[1] + "-" + req.query.start.split("/")[0] + " 00:00:00";
    var endtime = req.query.end.split("/")[2] + "-" + req.query.end.split("/")[1] + "-" + req.query.end.split("/")[0] + " 23:59:59";
    let userID = "";
    if (req.session.user.user.digitizationcenter == null) {
        userID = req.session.user.user.id;
    } else {
        userID = req.session.user.user.digitizationcenter.id;
    }
    console.log("userIDuserIDuserID.....", userID);
    // res.send({ status: true, data: "" });
    let query = "";
    if (action == 0) {

        query = "select up.name,f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.scan_by and up.digitizationcenter=" + userID + " where  f.imagestatus>=1 and f.scancommited_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' order by f.scancommited_at";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');

        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            // res.send({ status: true, data: resultbat });
            resdata.forEach(element => {
                //console.log("scancommited_at..", element.scancommited_at)
                //console.log("sdsdssdsds...", element.sdsds)
                data.push({ casetype: element.casetype + "/" + element.caseno + "/" + element.year, bundlenumber: element.bundlenumber, username: element.name, pagecount: element.scanpagecount, scancommited_at: moment(element.scancommited_at).format("DD/MM/YYYY hh:mm A") })
            });
            res.send({ status: true, data: data });
        })

    } else if (action == 1) {
        query = "select up.name,f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.qc_by and up.digitizationcenter=" + userID + " where  f.imagestatus>=2 and f.qccommited_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' order by f.qccommited_at";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');

        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            // res.send({ status: true, data: resultbat });
            resdata.forEach(element => {
                data.push({ casetype: element.casetype + "/" + element.caseno + "/" + element.year, bundlenumber: element.bundlenumber, username: element.name, pagecount: element.qcpagecount, scancommited_at: moment(element.qccommited_at).format("DD/MM/YYYY hh:mm A") })
            });
            res.send({ status: true, data: data });
        })

    } else if (action == 6) {

        query = "select up.name,f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.metadata_by and up.digitizationcenter=" + userID + " where  f.imagestatus>=3 and f.metadata_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' order by f.metadata_at";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');

        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            // res.send({ status: true, data: resultbat });
            resdata.forEach(element => {
                data.push({ casetype: element.casetype + "/" + element.caseno + "/" + element.year, bundlenumber: element.bundlenumber, username: element.name, pagecount: element.metadatapage, scancommited_at: moment(element.metadata_at).format("DD/MM/YYYY hh:mm A") })
            });
            res.send({ status: true, data: data });
        })

    } else if (action == 2) {

        query = "select up.name,f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.classification_by and up.digitizationcenter=" + userID + " where  f.imagestatus>=4 and f.classification_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' order by f.classification_at";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');

        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            // res.send({ status: true, data: resultbat });
            resdata.forEach(element => {
                data.push({ casetype: element.casetype + "/" + element.caseno + "/" + element.year, bundlenumber: element.bundlenumber, username: element.name, pagecount: element.qcpagecount, scancommited_at: moment(element.classification_at).format("DD/MM/YYYY hh:mm A") })
            });
            res.send({ status: true, data: data });
        })

    } else if (action == 7) {

        query = "select up.name,f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.pdf_by and up.digitizationcenter=" + userID + " where  f.imagestatus>=5 and f.pdf_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' order by f.pdf_at";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');

        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            // res.send({ status: true, data: resultbat });
            resdata.forEach(element => {
                data.push({ casetype: element.casetype + "/" + element.caseno + "/" + element.year, bundlenumber: element.bundlenumber, username: element.name, pagecount: element.pdfpagecount, scancommited_at: moment(element.pdf_at).format("DD/MM/YYYY hh:mm A") })
            });
            res.send({ status: true, data: data });
        })

    }
    else if (action == 8) {

        query = "select up.name,f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.first_verify_by and up.digitizationcenter=" + userID + " where f.readyforverify=true and  f.imagestatus>=5 and f.first_verify_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' order by f.first_verify_at";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');

        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            // res.send({ status: true, data: resultbat });
            resdata.forEach(element => {
                data.push({ casetype: element.casetype + "/" + element.caseno + "/" + element.year, bundlenumber: element.bundlenumber, username: element.name, pagecount: element.pdfpagecount, scancommited_at: moment(element.first_verify_at).format("DD/MM/YYYY hh:mm A") })
            });
            res.send({ status: true, data: data });
        })

    }

    else if (action == 3) {
        query = "select up.name,f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.verify_by  where  f.imagestatus>=6 and f.verify_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' order by f.verify_at";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');

        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            // res.send({ status: true, data: resultbat });
            resdata.forEach(element => {
                data.push({ casetype: element.casetype + "/" + element.caseno + "/" + element.year, bundlenumber: element.bundlenumber, username: element.name, pagecount: element.pdfpagecount, scancommited_at: moment(element.verify_at).format("DD/MM/YYYY hh:mm A") })
            });
            res.send({ status: true, data: data });
        })

    } else if (action == 4) {
        query = "select up.name,f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.verify_by  where  f.imagestatus<6 and f.verify_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' order by f.verify_at";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');

        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            // res.send({ status: true, data: resultbat });
            resdata.forEach(element => {
                data.push({ casetype: element.casetype + "/" + element.caseno + "/" + element.year, bundlenumber: element.bundlenumber, username: element.name, pagecount: element.pdfpagecount, scancommited_at: moment(element.verify_at).format("DD/MM/YYYY hh:mm A") })
            });
            res.send({ status: true, data: data });
        })

    } else if (action == 5) {

        query = "select up.name,f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.thirdverify_by  where  f.imagestatus>=6 and f.isupload=true and f.upload_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' order by f.upload_at";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');

        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            // res.send({ status: true, data: resultbat });
            resdata.forEach(element => {
                data.push({ casetype: element.casetype + "/" + element.caseno + "/" + element.year, bundlenumber: element.bundlenumber, username: element.name, pagecount: element.pdfpagecount, scancommited_at: moment(element.upload_at).format("DD/MM/YYYY hh:mm A") })
            });
            res.send({ status: true, data: data });
        })

    }
        
    else if (action == 9) {
        query = "select up.name,f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.secondverify_by  where  f.imagestatus>=6 and f.secondverify=true and f.secondverify_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' order by f.secondverify_at";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');

        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            // res.send({ status: true, data: resultbat });
            resdata.forEach(element => {
                data.push({ casetype: element.casetype + "/" + element.caseno + "/" + element.year, bundlenumber: element.bundlenumber, username: element.name, pagecount: element.pdfpagecount, scancommited_at: moment(element.secondverify_at).format("DD/MM/YYYY hh:mm A") })
            });
            res.send({ status: true, data: data });
        })

    } else if (action == 10) {
        query = "select up.name,f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.secondverify_by  where  f.imagestatus<6  and f.secondverify_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' order by f.secondverify_at";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');

        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            // res.send({ status: true, data: resultbat });
            resdata.forEach(element => {
                data.push({ casetype: element.casetype + "/" + element.caseno + "/" + element.year, bundlenumber: element.bundlenumber, username: element.name, pagecount: element.pdfpagecount, scancommited_at: moment(element.secondverify_at).format("DD/MM/YYYY hh:mm A") })
            });
            res.send({ status: true, data: data });
        })

    }
    else if (action == 11) {
        query = "select up.name,f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.thirdverify_by  where  f.imagestatus>=6 and f.thirdverify=true and f.thirdverify_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' order by f.thirdverify_at";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');

        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            // res.send({ status: true, data: resultbat });
            resdata.forEach(element => {
                data.push({ casetype: element.casetype + "/" + element.caseno + "/" + element.year, bundlenumber: element.bundlenumber, username: element.name, pagecount: element.pdfpagecount, scancommited_at: moment(element.thirdverify_at).format("DD/MM/YYYY hh:mm A") })
            });
            res.send({ status: true, data: data });
        })

    } else if (action == 12) {
        query = "select up.name,f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.thirdverify_by  where  f.imagestatus<6  and f.thirdverify_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' order by f.thirdverify_at";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');

        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            // res.send({ status: true, data: resultbat });
            resdata.forEach(element => {
                data.push({ casetype: element.casetype + "/" + element.caseno + "/" + element.year, bundlenumber: element.bundlenumber, username: element.name, pagecount: element.pdfpagecount, scancommited_at: moment(element.thirdverify_at).format("DD/MM/YYYY hh:mm A") })
            });
            res.send({ status: true, data: data });
        })

    }
    else {
        res.send({ status: true, data: data });
    }

}
AuditReportController.prototype.batchwisereportfilter = (req, res) => {
    let data = [];
    var starttime = req.query.start.split("/")[2] + "-" + req.query.start.split("/")[1] + "-" + req.query.start.split("/")[0];
    var endtime = req.query.end.split("/")[2] + "-" + req.query.end.split("/")[1] + "-" + req.query.end.split("/")[0];
    let userID = "";
    if (req.session.user.user.digitizationcenter == null) {
        userID = req.session.user.user.id;
    } else {
        userID = req.session.user.user.digitizationcenter.id;
    }
    //console.log("userIDuserIDuserID.....", userID);
    // res.send({ status: true, data: "" });
    let query = "select COALESCE(sum(case when(f.imagestatus >= 0) then 1 else 0 end), 0) AS recivefiles, COALESCE(sum(case when(f.imagestatus >= 1) then 1 else 0 end), 0) AS scanfiles,COALESCE(sum(case when(f.imagestatus >= 2) then 1 else 0 end), 0) AS qcfile,COALESCE(sum(case when(f.imagestatus >= 3) then 1 else 0 end), 0) AS firstVErifyfile,COALESCE(sum(case when(f.imagestatus >= 4) then 1 else 0 end), 0) AS dataEntryfile,COALESCE(sum(case when(f.imagestatus >= 5) then 1 else 0 end), 0) AS pdffile,COALESCE(sum(case when(f.imagestatus >= 6) then 1 else 0 end), 0) AS verifyfile,COALESCE(sum(case when(f.imagestatus >= 6 and isupload = true) then 1 else 0 end), 0) AS uploadfile,b.bundlenumber, TO_CHAR(b.created_at_d2:: DATE, 'dd-mm-yyyy') as createed_date from firs f join batches b on b.id = f.batch join 'users-permissions_user' u on u.id = b.created_by_d2 and u.digitizationcenter = " + userID + " where b.created_at_d2  BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' group by b.bundlenumber, b.created_at_d2 order by createed_date";
    query = query.replace(/'users/g, '"users');
    query = query.replace(/user'/g, 'user"');

    CIPAService.executeSQL(query, function (batchdata) {
        var resdata = batchdata[0];

        resdata.forEach(element => {
            element['pendingprocess'] = parseInt(element.recivefiles) - parseInt(element.uploadfile)
            data.push(element);
        });
        res.send({ status: true, data: data });
    })
}
AuditReportController.prototype.inwardReport = function (req, res) {
    let user = req.session.user;
    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Inward Report");
    worksheet.columns = [
        { header: "Sl.NO", key: "srno", width: 5 },
        { header: "Case number", key: "casenumber", width: 10 },
        { header: "Bundle number", key: "bundlenumber", width: 10 },
        { header: "User Name", key: "username", width: 10 },
        { header: "Page Count", key: "pagecount", width: 10 },
        { header: "File Current status", key: "FileStatus", width: 10 },
        { header: "File Uploaded Staus", key: "fileupload", width: 20 },
        { header: "Date", key: "date", width: 10 }
    ];
    var starttime = moment(req.query.start + " 00:00:00", 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    var endtime = moment(req.query.end + " 23:50:50", 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    // res.send({ status: true, data: "" });
    let query = "";
    let userID = "";
    if (req.session.user.user.digitizationcenter == null) {
        userID = req.session.user.user.id;
    } else {
        userID = req.session.user.user.digitizationcenter.id;
    }
    query = "select b.inwardcommited_at as inwarddate,up.name as name,f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=b.inwardcommited_by and up.digitizationcenter=" + userID + " where  f.imagestatus>=0 and b.inwardcommited_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' order by f.id";
    query = query.replace(/'users/g, '"users');
    query = query.replace(/user'/g, 'user"');

    CIPAService.executeSQL(query, function (batchdata) {
        var resdata = batchdata[0];


        let tutorials = [];
        var counter = 1;
        resdata.forEach((element) => {
            let imagestatus = "";
            if (element.imagestatus == 0) {
                imagestatus = "Scanning Mode";
            } else if (element.imagestatus == 1) {
                imagestatus = "Scan QC  Mode";
            } else if (element.imagestatus == 2) {
                imagestatus = "Data Entry Mode";
            } else if (element.imagestatus == 3) {
                imagestatus = "Classification Mode";
            } else if (element.imagestatus == 4) {
                imagestatus = "PDF Mode";
            } else if (element.imagestatus == 5 && element.readyforverify == false) {
                imagestatus = "IM Verify Mode";
            }
            else if (element.imagestatus == 5 && element.readyforverify == true) {
                imagestatus = "L1 Verify Mode";
            } else if (element.imagestatus == 6 && element.secondverify == false) {
                imagestatus = "L2  Verify Mode";
            } else if (element.imagestatus == 6 && element.thirdverify == false) {
                imagestatus = "L3  Verify Mode";
            }
            else if (element.imagestatus == 6 && element.isupload == false && element.thirdverify == true) {
                imagestatus = "Upload  Mode";
            }
            tutorials.push({
                srno: counter,
                casenumber: element.casetype + "/" + element.caseno + "/" + element.year,
                bundlenumber: element.bundlenumber,
                username: (element.name != null ? element.name : ""),
                pagecount: element.pagecount,
                FileStatus: imagestatus,
                fileupload: (element.isupload == null || element.isupload == false) ? 'No' : 'Yes',
                date: moment(element.inwarddate).format("DD/MM/YYYY hh:mm A"),



            });

            counter++;
        });
        worksheet.addRows(tutorials);
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "InwardFileReport.xlsx"
        );
        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });

    })

}

AuditReportController.prototype.UserWiseInwardReport = function (req, res) {
    let user = req.session.user;
    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet(" User Inward Report");
    worksheet.columns = [
        { header: "Sl.NO", key: "srno", width: 5 },
        { header: "User Name", key: "name", width: 15 },
        { header: "Created Files", key: "createfile", width: 10 },
        { header: "Inward Files", key: "inwardfile", width: 10 },
        { header: "Scan Files", key: "scanfile", width: 10 },
        { header: "SCan Pages", key: "scanpage", width: 10 },
        { header: "Qc Files", key: "qcfile", width: 10 },
        { header: "QC Pages", key: "qcpage", width: 10 },
        { header: "1st Verification Files", key: "fvfile", width: 20 },
        { header: "1st Verification Pages", key: "fvpage", width: 20 },
        { header: "Data Entry Files", key: "datafile", width: 15 },
        { header: "Data Entry Pages", key: "datapage", width: 15 },
        { header: "PDF Files", key: "pdffile", width: 10 },
        { header: "PDF Pages", key: "pdfpage", width: 10 },
        { header: "Customer Verification Files", key: "finalfile", width: 25 },
        { header: "Customer Verification Pages", key: "finalpages", width: 25 },
        { header: "Second Customer Verification Files", key: "secondfinalfile", width: 25 },
        { header: "Second Customer Verification Pages", key: "secondfinalpages", width: 25 },
    ];
    var starttime = moment(req.query.start + " 00:00:00", 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    var endtime = moment(req.query.end + " 23:50:50", 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    // res.send({ status: true, data: "" });
    let query = "";
    let userID = "";
    if (req.session.user.user.digitizationcenter == null) {
        userID = req.session.user.user.id;
    } else {
        userID = req.session.user.user.digitizationcenter.id;
    }

    query = "select u.name as namescan,COALESCE(sum(case when (f.imagestatus>=1 and f.scancommited_at BETWEEN timestamp  '" + starttime + "' AND '" + endtime + "' ) then f.scanpagecount else 0 end),0) AS pages,COALESCE(sum(case when (f.imagestatus>=1 and f.scancommited_at BETWEEN timestamp  '" + starttime + "' AND '" + endtime + "' ) then 1 else 0 end),0) AS files from firs f join batches b on b.id=f.batch join 'users-permissions_user' up on up.id=b.created_by_d2 and up.digitizationcenter=" + userID + "  join 'users-permissions_user' u on u.id=f.scan_by group by u.name order by u.name";
    query = query.replace(/'users/g, '"users');
    query = query.replace(/user'/g, 'user"');
    CIPAService.executeSQLOnlyData(query, function (batchdata) {
        let tutorials = [];
        var counter = 1;
        // console.log(batchdata)
        batchdata.forEach((element) => {
            tutorials.push({
                srno: counter,
                name: element.namescan,
                createfile: 0,
                inwardfile: 0,
                scanfile: parseInt(element.files),
                scanpage: parseInt(element.pages),
                qcfile: 0,
                qcpage: 0,
                fvfile: 0,
                fvpage: 0,
                datafile: 0,
                datapage: 0,
                pdffile: 0,
                pdfpage: 0,
                finalfile: 0,
                finalpages: 0,
                secondfinalfile: 0,
                secondfinalpages: 0
            });
            counter++;
        });

        //qc
        query = "select u.name as namescan,COALESCE(sum(case when (f.imagestatus>=2 and f.qccommited_at BETWEEN timestamp  '" + starttime + "' AND '" + endtime + "' ) then f.qcpagecount else 0 end),0) AS pages,COALESCE(sum(case when (f.imagestatus>=2 and f.qccommited_at BETWEEN timestamp  '" + starttime + "' AND '" + endtime + "' ) then 1 else 0 end),0) AS files from firs f join batches b on b.id=f.batch join 'users-permissions_user' up on up.id=b.created_by_d2 and up.digitizationcenter=" + userID + " join 'users-permissions_user' u on u.id=f.qc_by group by u.name order by u.name";

        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');
        CIPAService.executeSQLOnlyData(query, function (qcdata) {
            qcdata.forEach((element) => {
                index = tutorials.findIndex(x => x.name == element.namescan);
                // console.log(index);
                if (index == -1) {
                    tutorials.push({
                        srno: counter,
                        name: element.namescan,
                        createfile: 0,
                        inwardfile: 0,
                        scanfile: 0,
                        scanpage: 0,
                        qcfile: parseInt(element.files),
                        qcpage: parseInt(element.pages),
                        fvfile: 0,
                        fvpage: 0,
                        datafile: 0,
                        datapage: 0,
                        pdffile: 0,
                        pdfpage: 0,
                        finalfile: 0,
                        finalpages: 0,
                        secondfinalfile: 0,
                        secondfinalpages: 0
                    });
                    counter++;
                } else {
                    tutorials[index].qcfile = parseInt(element.files);
                    tutorials[index].qcpage = parseInt(element.pages);
                }

            });


            //first Verifi
            query = "select u.name as namescan,COALESCE(sum(case when (f.imagestatus>=3 and f.first_verify_at BETWEEN timestamp  '" + starttime + "' AND '" + endtime + "' ) then f.firstverifypage else 0 end),0) AS pages,COALESCE(sum(case when (f.imagestatus>=3 and f.first_verify_at BETWEEN timestamp  '" + starttime + "' AND '" + endtime + "' ) then 1 else 0 end),0) AS files from firs f join batches b on b.id=f.batch join 'users-permissions_user' up on up.id=b.created_by_d2 and up.digitizationcenter=" + userID + " join 'users-permissions_user' u on u.id=f.first_verify_by group by u.name order by u.name";

            query = query.replace(/'users/g, '"users');
            query = query.replace(/user'/g, 'user"');
            CIPAService.executeSQLOnlyData(query, function (firstdata) {
                firstdata.forEach((element) => {
                    index = tutorials.findIndex(x => x.name == element.namescan);
                    // console.log(index);
                    if (index == -1) {
                        tutorials.push({
                            srno: counter,
                            name: element.namescan,
                            createfile: 0,
                            inwardfile: 0,
                            scanfile: 0,
                            scanpage: 0,
                            qcfile: 0,
                            qcpage: 0,
                            fvfile: parseInt(element.files),
                            fvpage: parseInt(element.pages),
                            datafile: 0,
                            datapage: 0,
                            pdffile: 0,
                            pdfpage: 0,
                            finalfile: 0,
                            finalpages: 0,
                            secondfinalfile: 0,
                            secondfinalpages: 0
                        });
                        counter++;
                    } else {
                        tutorials[index].fvfile = parseInt(element.files);
                        tutorials[index].fvpage = parseInt(element.pages);
                    }

                });

                //Data Entry
                query = "select u.name as namescan,COALESCE(sum(case when (f.imagestatus>=4 and f.metadata_at BETWEEN timestamp  '" + starttime + "' AND '" + endtime + "' ) then f.metadatapage else 0 end),0) AS pages,COALESCE(sum(case when (f.imagestatus>=4 and f.metadata_at BETWEEN timestamp  '" + starttime + "' AND '" + endtime + "' ) then 1 else 0 end),0) AS files from firs f join batches b on b.id=f.batch join 'users-permissions_user' up on up.id=b.created_by_d2 and up.digitizationcenter=" + userID + " join 'users-permissions_user' u on u.id=f.metadata_by group by u.name order by u.name";
                query = query.replace(/'users/g, '"users');
                query = query.replace(/user'/g, 'user"');
                CIPAService.executeSQLOnlyData(query, function (metadata) {

                    metadata.forEach((element) => {
                        index = tutorials.findIndex(x => x.name == element.namescan);
                        // console.log(index);
                        if (index == -1) {
                            tutorials.push({
                                srno: counter,
                                name: element.namescan,
                                createfile: 0,
                                inwardfile: 0,
                                scanfile: 0,
                                scanpage: 0,
                                qcfile: 0,
                                qcpage: 0,
                                fvfile: 0,
                                fvpage: 0,
                                datafile: parseInt(element.files),
                                datapage: parseInt(element.pages),
                                pdffile: 0,
                                pdfpage: 0,
                                finalfile: 0,
                                finalpages: 0,
                                secondfinalfile: 0,
                                secondfinalpages: 0
                            });
                            counter++;
                        } else {
                            tutorials[index].datafile = parseInt(element.files);
                            tutorials[index].datapage = parseInt(element.pages);
                        }

                    });

                    //PDF
                    query = "select u.name as namescan,COALESCE(sum(case when (f.imagestatus>=5 and f.pdf_at BETWEEN timestamp  '" + starttime + "' AND '" + endtime + "' ) then f.pdfpagecount else 0 end),0) AS pages,COALESCE(sum(case when (f.imagestatus>=5 and f.pdf_at BETWEEN timestamp  '" + starttime + "' AND '" + endtime + "' ) then 1 else 0 end),0) AS files from firs f join batches b on b.id=f.batch join 'users-permissions_user' up on up.id=b.created_by_d2 and up.digitizationcenter=" + userID + " join 'users-permissions_user' u on u.id=f.pdf_by group by u.name order by u.name";
                    query = query.replace(/'users/g, '"users');
                    query = query.replace(/user'/g, 'user"');

                    console.log("PDF>>>>", query)
                    CIPAService.executeSQLOnlyData(query, function (pdfdata) {
                        console.log(pdfdata)
                        pdfdata.forEach((element) => {
                            index = tutorials.findIndex(x => x.name == element.namescan);
                            console.log(index);
                            if (index == -1) {
                                tutorials.push({
                                    srno: counter,
                                    name: element.namescan,
                                    createfile: 0,
                                    inwardfile: 0,
                                    scanfile: 0,
                                    scanpage: 0,
                                    qcfile: 0,
                                    qcpage: 0,
                                    fvfile: 0,
                                    fvpage: 0,
                                    datafile: 0,
                                    datapage: 0,
                                    pdffile: parseInt(element.files),
                                    pdfpage: parseInt(element.pages),
                                    finalfile: 0,
                                    finalpages: 0,
                                    secondfinalfile: 0,
                                    secondfinalpages: 0
                                });
                                counter++;
                            } else {
                                tutorials[index].pdffile = parseInt(element.files);
                                tutorials[index].pdfpage = parseInt(element.pages);
                            }

                        });

                        //Coustomer
                        query = "select u.name as namescan,COALESCE(sum(case when (f.imagestatus>=6 and f.verify_at BETWEEN timestamp  '" + starttime + "' AND '" + endtime + "' ) then f.pdfpagecount else 0 end),0) AS pages,COALESCE(sum(case when (f.imagestatus>=6 and f.verify_at BETWEEN timestamp  '" + starttime + "' AND '" + endtime + "' ) then 1 else 0 end),0) AS files from firs f join batches b on b.id=f.batch join 'users-permissions_user' up on up.id=b.created_by_d2 and up.digitizationcenter=" + userID + " join 'users-permissions_user' u on u.id=f.verify_by group by u.name order by u.name";
                        query = query.replace(/'users/g, '"users');
                        query = query.replace(/user'/g, 'user"');
                        CIPAService.executeSQLOnlyData(query, function (finaldata) {

                            finaldata.forEach((element) => {
                                index = tutorials.findIndex(x => x.name == element.namescan);
                                // console.log(index);
                                if (index == -1) {
                                    tutorials.push({
                                        srno: counter,
                                        name: element.namescan,
                                        createfile: 0,
                                        inwardfile: 0,
                                        scanfile: 0,
                                        scanpage: 0,
                                        qcfile: 0,
                                        qcpage: 0,
                                        fvfile: 0,
                                        fvpage: 0,
                                        datafile: 0,
                                        datapage: 0,
                                        pdffile: 0,
                                        pdfpage: 0,
                                        finalfile: parseInt(element.files),
                                        finalpages: parseInt(element.pages),
                                        secondfinalfile: 0,
                                        secondfinalpages: 0
                                    });
                                    counter++;
                                } else {
                                    tutorials[index].finalfile = parseInt(element.files);
                                    tutorials[index].finalpages = parseInt(element.pages);
                                }

                            });
                            //Second Customer
                            query = "select u.name as namescan,COALESCE(sum(case when (f.imagestatus>=6 and f.secondverify=true and f.secondverify_at BETWEEN timestamp  '" + starttime + "' AND '" + endtime + "' ) then f.pdfpagecount else 0 end),0) AS pages,COALESCE(sum(case when (f.imagestatus>=6 and f.secondverify=true and f.secondverify_at BETWEEN timestamp  '" + starttime + "' AND '" + endtime + "' ) then 1 else 0 end),0) AS files from firs f join batches b on b.id=f.batch join 'users-permissions_user' up on up.id=b.created_by_d2 and up.digitizationcenter=" + userID + " join 'users-permissions_user' u on u.id=f.secondverify_by group by u.name order by u.name";
                            query = query.replace(/'users/g, '"users');
                            query = query.replace(/user'/g, 'user"');

                            console.log("second >>>>", query)
                            CIPAService.executeSQLOnlyData(query, function (finaldata) {

                                finaldata.forEach((element) => {
                                    index = tutorials.findIndex(x => x.name == element.namescan);
                                    // console.log(index);
                                    if (index == -1) {
                                        tutorials.push({
                                            srno: counter,
                                            name: element.namescan,
                                            createfile: 0,
                                            inwardfile: 0,
                                            scanfile: 0,
                                            scanpage: 0,
                                            qcfile: 0,
                                            qcpage: 0,
                                            fvfile: 0,
                                            fvpage: 0,
                                            datafile: 0,
                                            datapage: 0,
                                            pdffile: 0,
                                            pdfpage: 0,
                                            finalfile: 0,
                                            finalpages: 0,
                                            secondfinalfile: parseInt(element.files),
                                            secondfinalpages: parseInt(element.pages)
                                        });
                                        counter++;
                                    } else {
                                        tutorials[index].secondfinalfile = parseInt(element.files);
                                        tutorials[index].secondfinalpages = parseInt(element.pages);
                                    }

                                });


                            //Create File
                            query = "select u.name as namescan,COALESCE(sum(case when (f.imagestatus>=-1  ) then 1 else 0 end),0) AS files from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + "  where b.created_at_d2 BETWEEN timestamp  '" + starttime + "' AND '" + endtime + "' group by u.name";
                            query = query.replace(/'users/g, '"users');
                            query = query.replace(/user'/g, 'user"');

                            CIPAService.executeSQLOnlyData(query, function (createdata) {

                                createdata.forEach((element) => {
                                    index = tutorials.findIndex(x => x.name == element.namescan);
                                    // console.log(index);
                                    if (index == -1) {
                                        tutorials.push({
                                            srno: counter,
                                            name: element.namescan,
                                            createfile: parseInt(element.files),
                                            inwardfile: 0,
                                            scanfile: 0,
                                            scanpage: 0,
                                            qcfile: 0,
                                            qcpage: 0,
                                            fvfile: 0,
                                            fvpage: 0,
                                            datafile: 0,
                                            datapage: 0,
                                            pdffile: 0,
                                            pdfpage: 0,
                                            finalfile: 0,
                                            finalpages: 0,
                                            secondfinalfile: 0,
                                            secondfinalpages: 0
                                        });
                                        counter++;
                                    } else {
                                        tutorials[index].createfile = parseInt(element.files);

                                    }

                                })

                                //inward
                                query = "select u.name as namescan,COALESCE(sum(case when (f.imagestatus>=0  ) then 1 else 0 end),0) AS files from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.inwardcommited_by and u.digitizationcenter=" + userID + " where b.inwardcommited_at BETWEEN timestamp  '" + starttime + "' AND '" + endtime + "' group by u.name";
                                query = query.replace(/'users/g, '"users');
                                query = query.replace(/user'/g, 'user"');

                                CIPAService.executeSQLOnlyData(query, function (inwaarddata) {

                                    inwaarddata.forEach((element) => {
                                        index = tutorials.findIndex(x => x.name == element.namescan);
                                        // console.log(index);
                                        if (index == -1) {
                                            tutorials.push({
                                                srno: counter,
                                                name: element.namescan,
                                                createfile: 0,
                                                inwardfile: parseInt(element.files),
                                                scanfile: 0,
                                                scanpage: 0,
                                                qcfile: 0,
                                                qcpage: 0,
                                                fvfile: 0,
                                                fvpage: 0,
                                                datafile: 0,
                                                datapage: 0,
                                                pdffile: 0,
                                                pdfpage: 0,
                                                finalfile: 0,
                                                finalpages: 0,
                                                secondfinalfile: 0,
                                                secondfinalpages: 0
                                            });
                                            counter++;
                                        } else {
                                            tutorials[index].inwardfile = parseInt(element.files);

                                        }

                                    })


                                    worksheet.addRows(tutorials);
                                    res.setHeader(
                                        "Content-Type",
                                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    );
                                    res.setHeader(
                                        "Content-Disposition",
                                        "attachment; filename=" + "UsrWiseInwardFileReport.xlsx"
                                    );
                                    return workbook.xlsx.write(res).then(function () {
                                        res.status(200).end();
                                    });
                                })//inwward

                            })//created File
                        })
                        }) //  customer Verifi

                    }) //pdf genrate

                })//data entry 

            })//First
        })//qc     

    })//scan

}
AuditReportController.prototype.progressReport = function (req, res) {
    let userID = "";
    if (req.session.user.user.digitizationcenter == null) {
        userID = req.session.user.user.id;
    } else {
        userID = req.session.user.user.digitizationcenter.id;
    }
    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Progress Report");

    worksheet.columns = [
        { header: "Sl.NO", key: "srno", width: 5 },
        { header: "Case number", key: "casenumber", width: 10 },
        { header: "Bundle number", key: "bundlenumber", width: 10 },
        { header: "User Name", key: "username", width: 10 },
        { header: "Page Count", key: "pagecount", width: 10 },
        { header: "Date", key: "date", width: 10 }
    ];



    var data = [];
    var action = req.query.action;


    var starttime = req.query.start.split("/")[2] + "-" + req.query.start.split("/")[1] + "-" + req.query.start.split("/")[0] + " 00:00:00";
    var endtime = req.query.end.split("/")[2] + "-" + req.query.end.split("/")[1] + "-" + req.query.end.split("/")[0] + " 23:59:59";

    // res.send({ status: true, data: "" });
    let query = "";
    if (action == 0) {
        query = "select up.name,f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.scan_by and up.digitizationcenter=" + userID + " where  f.imagestatus>=1 and f.scancommited_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' order by f.scancommited_at";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');

        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            let tutorials = [];
            var counter = 1;
            resdata.forEach(element => {
                tutorials.push({
                    srno: counter,
                    casenumber: element.casetype + "/" + element.caseno + "/" + element.year,
                    bundlenumber: element.bundlenumber,
                    username: element.name,
                    pagecount: element.scanpagecount,
                    date: moment(element.scancommited_at).format("DD/MM/YYYY hh:mm A"),

                });

                counter++;
            });
            worksheet.addRows(tutorials);
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "ProgressFileReport.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });


        })

    } else if (action == 1) {
        query = "select up.name,f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.qc_by and up.digitizationcenter=" + userID + " where  f.imagestatus>=2 and f.qccommited_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' order by f.qccommited_at";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');

        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            let tutorials = [];
            var counter = 1;
            resdata.forEach((element) => {
                tutorials.push({
                    srno: counter,
                    casenumber: element.casetype + "/" + element.caseno + "/" + element.year,
                    bundlenumber: element.bundlenumber,
                    username: element.name,
                    pagecount: element.qcpagecount,
                    date: moment(element.qccommited_at).format("DD/MM/YYYY hh:mm A"),

                });

                counter++;
            });
            worksheet.addRows(tutorials);
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "ProgressFileReport.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });

        })
    } else if (action == 6) {
        query = "select up.name,f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.metadata_by and up.digitizationcenter=" + userID + " where  f.imagestatus>=3 and f.metadata_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' order by f.metadata_at";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');

        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            let tutorials = [];
            var counter = 1;
            resdata.forEach((element) => {
                tutorials.push({
                    srno: counter,
                    casenumber: element.casetype + "/" + element.caseno + "/" + element.year,
                    bundlenumber: element.bundlenumber,
                    username: element.name,
                    pagecount: element.metadatapage,
                    date: moment(element.metadata_at).format("DD/MM/YYYY hh:mm A"),

                });

                counter++;
            });
            worksheet.addRows(tutorials);
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "ProgressReportClassfication.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });

        })
    } else if (action == 2) {
        query = "select up.name,f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.classification_by and up.digitizationcenter=" + userID + " where  f.imagestatus>=4 and f.classification_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' order by f.classification_at";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');

        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            let tutorials = [];
            var counter = 1;
            resdata.forEach((element) => {
                tutorials.push({
                    srno: counter,
                    casenumber: element.casetype + "/" + element.caseno + "/" + element.year,
                    bundlenumber: element.bundlenumber,
                    username: element.name,
                    pagecount: element.qcpagecount,
                    date: moment(element.classification_at).format("DD/MM/YYYY hh:mm A"),

                });

                counter++;
            });
            worksheet.addRows(tutorials);
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "ProgressReportClassfication.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });

        })
    } else if (action == 7) {
        query = "select up.name,f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.pdf_by and up.digitizationcenter=" + userID + " where  f.imagestatus>=5 and f.pdf_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' order by f.pdf_at";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');

        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            let tutorials = [];
            var counter = 1;
            resdata.forEach((element) => {
                tutorials.push({
                    srno: counter,
                    casenumber: element.casetype + "/" + element.caseno + "/" + element.year,
                    bundlenumber: element.bundlenumber,
                    username: element.name,
                    pagecount: element.pdfpagecount,
                    date: moment(element.pdf_at).format("DD/MM/YYYY hh:mm A"),

                });

                counter++;
            });
            worksheet.addRows(tutorials);
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "ProgressReportClassfication.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });

        })
    } else if (action == 8) {
        query = "select up.name,f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.first_verify_by and up.digitizationcenter=" + userID + " where f.readyforverify=true and f.imagestatus>=5 and f.first_verify_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' order by f.first_verify_at";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');

        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            let tutorials = [];
            var counter = 1;
            resdata.forEach((element) => {
                tutorials.push({
                    srno: counter,
                    casenumber: element.casetype + "/" + element.caseno + "/" + element.year,
                    bundlenumber: element.bundlenumber,
                    username: element.name,
                    pagecount: element.pdfpagecount,
                    date: moment(element.first_verify_at).format("DD/MM/YYYY hh:mm A"),

                });

                counter++;
            });
            worksheet.addRows(tutorials);
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "ProgressReportClassfication.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });

        })
    } else if (action == 3) {
        query = "select up.name,f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.verify_by  where  f.imagestatus>=6 and f.verify_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' order by f.verify_at";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');

        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            let tutorials = [];
            var counter = 1;
            resdata.forEach((element) => {
                tutorials.push({
                    srno: counter,
                    casenumber: element.casetype + "/" + element.caseno + "/" + element.year,
                    bundlenumber: element.bundlenumber,
                    username: element.name,
                    pagecount: element.pdfpagecount,
                    date: moment(element.verify_at).format("DD/MM/YYYY hh:mm A"),

                });

                counter++;
            });
            worksheet.addRows(tutorials);
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "ProgressReportOfVerify.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });
            // res.send({ status: true, data: data });
        })
    } else if (action == 4) {
        worksheet.columns = [
            { header: "Sl.NO", key: "srno", width: 5 },
            { header: "Case number", key: "casenumber", width: 10 },
            { header: "Bundle number", key: "bundlenumber", width: 10 },
            { header: "User Name", key: "username", width: 10 },
            { header: "Page Count", key: "pagecount", width: 10 },
            { header: "Date", key: "date", width: 10 },
            { header: "Remarks", key: "Remarks", width: 10 },

        ];

        query = "select up.name,f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.verify_by  where  f.imagestatus<6 and f.verify_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' order by f.verify_at";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');

        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            let tutorials = [];
            var counter = 1;
            resdata.forEach((element) => {
                tutorials.push({
                    srno: counter,
                    casenumber: element.casetype + "/" + element.caseno + "/" + element.year,
                    bundlenumber: element.bundlenumber,
                    username: element.name,
                    pagecount: element.pdfpagecount,
                    date: moment(element.verify_at).format("DD/MM/YYYY hh:mm A"),
                    Remarks: element.verifyremarks

                });

                counter++;
            });
            worksheet.addRows(tutorials);
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "ProgressReportOfVerify.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });
        })
    } else if (action == 5) {
        worksheet.columns = [
            { header: "Sl.NO", key: "srno", width: 5 },
            { header: "Case number", key: "casenumber", width: 10 },
            { header: "Bundle number", key: "bundlenumber", width: 10 },
            { header: "User Name", key: "username", width: 10 },
            { header: "Page Count", key: "pagecount", width: 10 },
            { header: "Date", key: "date", width: 10 },
            { header: "Remarks", key: "Remarks", width: 10 },

        ];

        query = "select up.name,f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.thirdverify_by  where  f.imagestatus>=6 and f.isupload=true and f.upload_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' order by f.upload_at";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');

        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            let tutorials = [];
            var counter = 1;
            resdata.forEach((element) => {
                tutorials.push({
                    srno: counter,
                    casenumber: element.casetype + "/" + element.caseno + "/" + element.year,
                    bundlenumber: element.bundlenumber,
                    username: element.name,
                    pagecount: element.pdfpagecount,
                    date: moment(element.upload_at).format("DD/MM/YYYY hh:mm A"),
                    Remarks: element.verifyremarks

                });

                counter++;
            });
            worksheet.addRows(tutorials);
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "UploadReport.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });
        })
    } else if (action == 9) {
       // query = "select up.name,f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.verify_by  where  f.imagestatus>=6 and f.verify_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' order by f.verify_at";
        query = "select up.name,f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.secondverify_by  where  f.imagestatus>=6 and f.secondverify=true and f.secondverify_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' order by f.secondverify_at";

        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');

        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            let tutorials = [];
            var counter = 1;
            resdata.forEach((element) => {
                tutorials.push({
                    srno: counter,
                    casenumber: element.casetype + "/" + element.caseno + "/" + element.year,
                    bundlenumber: element.bundlenumber,
                    username: element.name,
                    pagecount: element.pdfpagecount,
                    date: moment(element.secondverify_at).format("DD/MM/YYYY hh:mm A"),

                });

                counter++;
            });
            worksheet.addRows(tutorials);
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "ProgressReportOfVerify.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });
            // res.send({ status: true, data: data });
        })
    } else if (action == 10) {
        worksheet.columns = [
            { header: "Sl.NO", key: "srno", width: 5 },
            { header: "Case number", key: "casenumber", width: 10 },
            { header: "Bundle number", key: "bundlenumber", width: 10 },
            { header: "User Name", key: "username", width: 10 },
            { header: "Page Count", key: "pagecount", width: 10 },
            { header: "Date", key: "date", width: 10 },
            { header: "Remarks", key: "Remarks", width: 10 },

        ];

        query = "select up.name,f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.secondverify_by  where  f.imagestatus<6  and f.secondverify_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' order by f.secondverify_at";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');

        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            let tutorials = [];
            var counter = 1;
            resdata.forEach((element) => {
                tutorials.push({
                    srno: counter,
                    casenumber: element.casetype + "/" + element.caseno + "/" + element.year,
                    bundlenumber: element.bundlenumber,
                    username: element.name,
                    pagecount: element.pdfpagecount,
                    date: moment(element.secondverify_at).format("DD/MM/YYYY hh:mm A"),
                    Remarks: element.secondverifyremarks

                });

                counter++;
            });
            worksheet.addRows(tutorials);
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "ProgressReportOfVerify.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });
        })
    }
 else if (action == 11) {
    // query = "select up.name,f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.verify_by  where  f.imagestatus>=6 and f.verify_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' order by f.verify_at";
        query = "select up.name,f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.thirdverify_by  where  f.imagestatus>=6 and f.thirdverify=true and f.thirdverify_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' order by f.thirdverify_at";

    query = query.replace(/'users/g, '"users');
    query = query.replace(/user'/g, 'user"');

    CIPAService.executeSQL(query, function (batchdata) {
        var resdata = batchdata[0];
        let tutorials = [];
        var counter = 1;
        resdata.forEach((element) => {
            tutorials.push({
                srno: counter,
                casenumber: element.casetype + "/" + element.caseno + "/" + element.year,
                bundlenumber: element.bundlenumber,
                username: element.name,
                pagecount: element.pdfpagecount,
                date: moment(element.thirdverify_at).format("DD/MM/YYYY hh:mm A"),

            });

            counter++;
        });
        worksheet.addRows(tutorials);
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "ProgressReportOfVerify.xlsx"
        );
        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });
        // res.send({ status: true, data: data });
    })
} else if (action == 12) {
    worksheet.columns = [
        { header: "Sl.NO", key: "srno", width: 5 },
        { header: "Case number", key: "casenumber", width: 10 },
        { header: "Bundle number", key: "bundlenumber", width: 10 },
        { header: "User Name", key: "username", width: 10 },
        { header: "Page Count", key: "pagecount", width: 10 },
        { header: "Date", key: "date", width: 10 },
        { header: "Remarks", key: "Remarks", width: 10 },

    ];

        query = "select up.name,f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.thirdverify_by  where  f.imagestatus<6  and f.thirdverify_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' order by f.thirdverify_at";
    query = query.replace(/'users/g, '"users');
    query = query.replace(/user'/g, 'user"');

    CIPAService.executeSQL(query, function (batchdata) {
        var resdata = batchdata[0];
        let tutorials = [];
        var counter = 1;
        resdata.forEach((element) => {
            tutorials.push({
                srno: counter,
                casenumber: element.casetype + "/" + element.caseno + "/" + element.year,
                bundlenumber: element.bundlenumber,
                username: element.name,
                pagecount: element.pdfpagecount,
                date: moment(element.thirdverify_at).format("DD/MM/YYYY hh:mm A"),
                Remarks: element.thirdverifyremarks

            });

            counter++;
        });
        worksheet.addRows(tutorials);
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "ProgressReportOfVerify.xlsx"
        );
        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });
    })
     }


}


AuditReportController.prototype.progressReportByUSerWiseExcel = function (req, res) {
    let userID = "";
    if (req.session.user.user.digitizationcenter == null) {
        userID = req.session.user.user.id;
    } else {
        userID = req.session.user.user.digitizationcenter.id;
    }
    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Progress Report");

    worksheet.columns = [
        { header: "Sl.NO", key: "srno", width: 5 },
        { header: "User Name", key: "username", width: 30 },
        { header: "Page Count", key: "pagecount", width: 10 },
        { header: "File Count", key: "filecount", width: 10 }
    ];



    var data = [];
    var action = req.query.action;


    var starttime = req.query.start.split("/")[2] + "-" + req.query.start.split("/")[1] + "-" + req.query.start.split("/")[0] + " 00:00:00";
    var endtime = req.query.end.split("/")[2] + "-" + req.query.end.split("/")[1] + "-" + req.query.end.split("/")[0] + " 23:59:59";

    // res.send({ status: true, data: "" });
    let query = "";
    if (action == 0) {
        query = "select up.name,sum(f.scanpagecount) as totalpage,count(f.id) as filecount from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.scan_by and up.digitizationcenter=" + userID + " where  f.imagestatus>=1 and f.scancommited_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' group by up.name order by up.name";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');

        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            let tutorials = [];
            var counter = 1;
            resdata.forEach(element => {
                tutorials.push({
                    srno: counter,
                    username: element.name,
                    pagecount: element.totalpage,
                    filecount: element.filecount,

                });

                counter++;
            });
            worksheet.addRows(tutorials);
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "UserWise-scan-ProgressFileReport.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });


        })

    } else if (action == 1) {
        // query = "select up.name,f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.qc_by and up.digitizationcenter=" + userID + " where  f.imagestatus>=2 and f.qccommited_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' order by f.qccommited_at";
        query = "select up.name,sum(f.qcpagecount) as totalpage,count(f.id) as filecount from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.qc_by and up.digitizationcenter=" + userID + " where  f.imagestatus>=2 and f.qccommited_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' group by up.name order by up.name";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');

        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            let tutorials = [];
            var counter = 1;
            resdata.forEach((element) => {
                tutorials.push({
                    srno: counter,
                    username: element.name,
                    pagecount: element.totalpage,
                    filecount: element.filecount,

                });

                counter++;
            });
            worksheet.addRows(tutorials);
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "ProgressFileReport.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });

        })
    } else if (action == 6) {
        // query = "select up.name,f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.classification_by and up.digitizationcenter=" + userID + " where  f.imagestatus>=3 and f.classification_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' order by f.classification_at";

        query = "select up.name,sum(f.metadatapage) as totalpage,count(f.id) as filecount from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.metadata_by and up.digitizationcenter=" + userID + " where  f.imagestatus>=3 and f.metadata_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' group by up.name order by up.name";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');

        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            let tutorials = [];
            var counter = 1;
            resdata.forEach((element) => {
                tutorials.push({
                    srno: counter,
                    username: element.name,
                    pagecount: element.totalpage,
                    filecount: element.filecount,

                });

                counter++;
            });
            worksheet.addRows(tutorials);
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "ProgressReportClassfication.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });

        })
    } else if (action == 2) {
        // query = "select up.name,f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.classification_by and up.digitizationcenter=" + userID + " where  f.imagestatus>=3 and f.classification_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' order by f.classification_at";

        query = "select up.name,sum(f.qcpagecount) as totalpage,count(f.id) as filecount from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.classification_by and up.digitizationcenter=" + userID + " where  f.imagestatus>=4 and f.classification_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' group by up.name order by up.name";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');

        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            let tutorials = [];
            var counter = 1;
            resdata.forEach((element) => {
                tutorials.push({
                    srno: counter,
                    username: element.name,
                    pagecount: element.totalpage,
                    filecount: element.filecount,

                });

                counter++;
            });
            worksheet.addRows(tutorials);
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "ProgressReportClassfication.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });

        })
    } else if (action == 7) {
        // query = "select up.name,f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.classification_by and up.digitizationcenter=" + userID + " where  f.imagestatus>=3 and f.classification_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' order by f.classification_at";

        query = "select up.name,sum(f.pdfpagecount) as totalpage,count(f.id) as filecount from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.pdf_by and up.digitizationcenter=" + userID + " where  f.imagestatus>=5 and f.pdf_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' group by up.name order by up.name";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');

        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            let tutorials = [];
            var counter = 1;
            resdata.forEach((element) => {
                tutorials.push({
                    srno: counter,
                    username: element.name,
                    pagecount: element.totalpage,
                    filecount: element.filecount,

                });

                counter++;
            });
            worksheet.addRows(tutorials);
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "ProgressReportClassfication.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });

        })
    } else if (action == 8) {
        // query = "select up.name,f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.classification_by and up.digitizationcenter=" + userID + " where  f.imagestatus>=3 and f.classification_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' order by f.classification_at";

        query = "select up.name,sum(f.pdfpagecount) as totalpage,count(f.id) as filecount from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.first_verify_by and up.digitizationcenter=" + userID + " where f.readyforverify=true and f.imagestatus>=5 and f.pdf_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' group by up.name order by up.name";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');

        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            let tutorials = [];
            var counter = 1;
            resdata.forEach((element) => {
                tutorials.push({
                    srno: counter,
                    username: element.name,
                    pagecount: element.totalpage,
                    filecount: element.filecount,

                });

                counter++;
            });
            worksheet.addRows(tutorials);
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "ProgressReportClassfication.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });

        })
    }
    else if (action == 3) {
        // query = "select up.name,f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.verify_by  where  f.imagestatus>=6 and f.verify_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' order by f.verify_at";
        query = "select up.name,sum(f.pdfpagecount) as totalpage,count(f.id) as filecount from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.verify_by and up.digitizationcenter=" + userID + " where  f.imagestatus>=6 and f.verify_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' group by up.name order by up.name";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');

        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            let tutorials = [];
            var counter = 1;
            resdata.forEach((element) => {
                tutorials.push({
                    srno: counter,
                    username: element.name,
                    pagecount: element.totalpage,
                    filecount: element.filecount,

                });

                counter++;
            });
            worksheet.addRows(tutorials);
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "ProgressReportOfVerify.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });
            // res.send({ status: true, data: data });
        })
    } else if (action == 4) {
        //query = "select up.name,f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.verify_by  where  f.imagestatus<6 and f.verify_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' order by f.verify_at";

        query = "select up.name,sum(f.pdfpagecount) as totalpage,count(f.id) as filecount from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.verify_by and up.digitizationcenter=" + userID + " where  f.imagestatus<6 and f.verify_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' group by up.name order by up.name";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');

        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            let tutorials = [];
            var counter = 1;
            resdata.forEach((element) => {
                tutorials.push({
                    srno: counter,
                    username: element.name,
                    pagecount: element.totalpage,
                    filecount: element.filecount,

                });

                counter++;
            });
            worksheet.addRows(tutorials);
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "ProgressReportOfVerify.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });
        })
    } else if (action == 5) {


        // query = "select up.name,f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.verify_by  where  f.imagestatus>=6 and f.isupload=true and f.upload_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' order by f.upload_at";
        query = "select up.name,sum(f.pdfpagecount) as totalpage,count(f.id) as filecount from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.thirdverify_by and up.digitizationcenter=" + userID + " where  f.imagestatus>=6 and f.isupload=true and f.upload_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' group by up.name order by up.name";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');

        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            let tutorials = [];
            var counter = 1;
            resdata.forEach((element) => {
                tutorials.push({
                    srno: counter,
                    username: element.name,
                    pagecount: element.totalpage,
                    filecount: element.filecount

                });

                counter++;
            });
            worksheet.addRows(tutorials);
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "userWise-UploadReport.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });
        })
    } else if (action == 9) {
        // query = "select up.name,f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.verify_by  where  f.imagestatus>=6 and f.verify_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' order by f.verify_at";
        query = "select up.name,sum(f.pdfpagecount) as totalpage,count(f.id) as filecount from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.secondverify_by and up.digitizationcenter=" + userID + " where  f.imagestatus>=6 and f.secondverify=true and f.secondverify_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' group by up.name order by up.name";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');

        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            let tutorials = [];
            var counter = 1;
            resdata.forEach((element) => {
                tutorials.push({
                    srno: counter,
                    username: element.name,
                    pagecount: element.totalpage,
                    filecount: element.filecount,

                });

                counter++;
            });
            worksheet.addRows(tutorials);
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "ProgressReportOfVerify.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });
            // res.send({ status: true, data: data });
        })
    } else if (action == 10) {
        //query = "select up.name,f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.verify_by  where  f.imagestatus<6 and f.verify_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' order by f.verify_at";

        query = "select up.name,sum(f.pdfpagecount) as totalpage,count(f.id) as filecount from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.secondverify_by and up.digitizationcenter=" + userID + " where  f.imagestatus<6 and f.secondverify_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' group by up.name order by up.name";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');

        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            let tutorials = [];
            var counter = 1;
            resdata.forEach((element) => {
                tutorials.push({
                    srno: counter,
                    username: element.name,
                    pagecount: element.totalpage,
                    filecount: element.filecount,

                });

                counter++;
            });
            worksheet.addRows(tutorials);
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "ProgressReportOfVerify.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });
        })
    } else if (action == 11) {
        // query = "select up.name,f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.verify_by  where  f.imagestatus>=6 and f.verify_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' order by f.verify_at";
        query = "select up.name,sum(f.pdfpagecount) as totalpage,count(f.id) as filecount from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.thirdverify_by and up.digitizationcenter=" + userID + " where  f.imagestatus>=6 and f.thirdverify=true and f.thirdverify_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' group by up.name order by up.name";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');

        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            let tutorials = [];
            var counter = 1;
            resdata.forEach((element) => {
                tutorials.push({
                    srno: counter,
                    username: element.name,
                    pagecount: element.totalpage,
                    filecount: element.filecount,

                });

                counter++;
            });
            worksheet.addRows(tutorials);
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "ProgressReportOfVerify.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });
            // res.send({ status: true, data: data });
        })
    } else if (action == 12) {
        //query = "select up.name,f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.verify_by  where  f.imagestatus<6 and f.verify_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' order by f.verify_at";

        query = "select up.name,sum(f.pdfpagecount) as totalpage,count(f.id) as filecount from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " join 'users-permissions_user' up on up.id=f.thirdverify_by and up.digitizationcenter=" + userID + " where  f.imagestatus<6 and f.thirdverify_at BETWEEN timestamp '" + starttime + "' AND '" + endtime + "' group by up.name order by up.name";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');

        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            let tutorials = [];
            var counter = 1;
            resdata.forEach((element) => {
                tutorials.push({
                    srno: counter,
                    username: element.name,
                    pagecount: element.totalpage,
                    filecount: element.filecount,

                });

                counter++;
            });
            worksheet.addRows(tutorials);
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "ProgressReportOfVerify.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });
        })
    }



}


AuditReportController.prototype.pendingauditreportfilter = (req, res) => {
    var data = [];
    var action = req.query.action;
    let userID = "";
    if (req.session.user.user.digitizationcenter == null) {
        userID = req.session.user.user.id;
    } else {
        userID = req.session.user.user.digitizationcenter.id;
    }

    // res.send({ status: true, data: "" });
    let query = "";
    if (action == 0) {
        query = "select f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " where  f.imagestatus=0 and f.inwardstatus=1 order by id";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');
        CIPAService.executeSQL(query, function (batchdata) {
            console.log("batchdata", batchdata[0].length);
            var resdata = batchdata[0];
            resdata.forEach(element => {
                data.push({ casetype: element.casetype + "/" + element.caseno + "/" + element.year, bundlenumber: element.bundlenumber, username: "", pagecount: "", scancommited_at: element.created_at })
            })
            res.send({ status: true, data: data });
        })
    } else if (action == 1) {
        query = "select f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " where  f.imagestatus=1 and f.inwardstatus=1 order by id";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');
        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            resdata.forEach(element => {
                data.push({ casetype: element.casetype + "/" + element.caseno + "/" + element.year, bundlenumber: element.bundlenumber, username: "", pagecount: element.scanpagecount, scancommited_at: element.scancommited_at })
            })
            res.send({ status: true, data: data });
        })
    } else if (action == 6) {
        query = "select f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " where  f.imagestatus=2  and f.inwardstatus=1 order by id";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');
        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            resdata.forEach(element => {
                data.push({ casetype: element.casetype + "/" + element.caseno + "/" + element.year, bundlenumber: element.bundlenumber, username: "", pagecount: element.qcpagecount, scancommited_at: element.qccommited_at })
            })
            res.send({ status: true, data: data });
        })
    } else if (action == 2) {
        query = "select f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " where  f.imagestatus=3  and f.inwardstatus=1 order by id";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');
        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            resdata.forEach(element => {
                data.push({ casetype: element.casetype + "/" + element.caseno + "/" + element.year, bundlenumber: element.bundlenumber, username: "", pagecount: element.qcpagecount, scancommited_at: element.qccommited_at })
            })
            res.send({ status: true, data: data });
        })
    } else if (action == 3) {
        query = "select f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " where  f.imagestatus=4  and f.inwardstatus=1 order by id";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');
        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            resdata.forEach(element => {
                data.push({ casetype: element.casetype + "/" + element.caseno + "/" + element.year, bundlenumber: element.bundlenumber, username: "", pagecount: element.qcpagecount, scancommited_at: element.qccommited_at })
            })
            res.send({ status: true, data: data });
        })
    } else if (action == 7) {
        query = "select f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " where  f.imagestatus=5 and f.readyforverify=false and f.inwardstatus=1 order by id";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');
        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            resdata.forEach(element => {
                data.push({ casetype: element.casetype + "/" + element.caseno + "/" + element.year, bundlenumber: element.bundlenumber, username: "", pagecount: element.qcpagecount, scancommited_at: element.qccommited_at })
            })
            res.send({ status: true, data: data });
        })
    }

    else if (action == 4) {
        query = "select f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " where  f.imagestatus=5 and f.readyforverify=true and f.inwardstatus=1 order by id";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');
        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            resdata.forEach(element => {
                data.push({ casetype: element.casetype + "/" + element.caseno + "/" + element.year, bundlenumber: element.bundlenumber, username: "", pagecount: element.qcpagecount, scancommited_at: element.qccommited_at })
            })
            res.send({ status: true, data: data });
        })
    } else if (action == 5) {
        query = "select f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " where  f.imagestatus=6 and f.isupload=false and f.thirdverify=true  and f.inwardstatus=1 order by id";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');
        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            resdata.forEach(element => {
                data.push({ casetype: element.casetype + "/" + element.caseno + "/" + element.year, bundlenumber: element.bundlenumber, username: "", pagecount: element.qcpagecount, scancommited_at: element.qccommited_at })
            })
            res.send({ status: true, data: data });
        })
    }
    else if (action == 8) {
        
        query = "select f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " where  f.imagestatus=6 and f.secondverify=false and f.inwardstatus=1 order by id";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');
        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            resdata.forEach(element => {
                data.push({ casetype: element.casetype + "/" + element.caseno + "/" + element.year, bundlenumber: element.bundlenumber, username: "", pagecount: element.qcpagecount, scancommited_at: element.qccommited_at })
            })
            res.send({ status: true, data: data });
        })
    }
    else if (action == 9) {

        query = "select f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " where  f.imagestatus=6 and  and f.secondverify=true and (f.thirdverify=false or f.thirdverify is null) and f.inwardstatus=1 order by id";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');
        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            resdata.forEach(element => {
                data.push({ casetype: element.casetype + "/" + element.caseno + "/" + element.year, bundlenumber: element.bundlenumber, username: "", pagecount: element.qcpagecount, scancommited_at: element.qccommited_at })
            })
            res.send({ status: true, data: data });
        })
    }
    else {
        res.send({ status: true, data: data });
    }

}


AuditReportController.prototype.PEndingprogressReportAuditreport = function (req, res) {
    let userID = "";
    if (req.session.user.user.digitizationcenter == null) {
        userID = req.session.user.user.id;
    } else {
        userID = req.session.user.user.digitizationcenter.id;
    }
    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Progress Report");

    worksheet.columns = [
        { header: "Sl.NO", key: "srno", width: 5 },
        { header: "Case number", key: "casenumber", width: 10 },
        { header: "Bundle number", key: "bundlenumber", width: 10 },
        { header: "Page Count", key: "pagecount", width: 10 },
        { header: "Remarks", key: "remarks", width: 10 },
        { header: "Date", key: "date", width: 10 }
    ];



    var data = [];
    var action = req.query.action;


    // res.send({ status: true, data: "" });
    let query = "";
    if (action == 0) {
        query = "select f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " where  f.imagestatus=0 and f.inwardstatus=1  order by id";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');
        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            let tutorials = [];
            var counter = 1;
            resdata.forEach((element) => {
                tutorials.push({
                    srno: counter,
                    casenumber: element.casetype + "/" + element.caseno + "/" + element.year,
                    bundlenumber: element.bundlenumber,
                    pagecount: "",
                    remarks: element.remarks,
                    date: "",

                });

                counter++;
            });
            worksheet.addRows(tutorials);
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "ProgressFileReport.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });

        })
    } else if (action == 1) {
        query = "select f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " where  f.imagestatus=1 and f.inwardstatus=1  order by id";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');
        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            let tutorials = [];
            var counter = 1;
            resdata.forEach((element) => {
                tutorials.push({
                    srno: counter,
                    casenumber: element.casetype + "/" + element.caseno + "/" + element.year,
                    bundlenumber: element.bundlenumber,
                    pagecount: element.scanpagecount,
                    remarks: element.remarks,
                    date: moment(element.scancommited_at).format("DD/MM/YYYY hh:mm A"),
                });

                counter++;
            });
            worksheet.addRows(tutorials);
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "ProgressFileReport.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });

        })
    } else if (action == 6) {
        query = "select f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " where  f.imagestatus=2  and f.inwardstatus=1  order by id";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');
        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            let tutorials = [];
            var counter = 1;
            resdata.forEach((element) => {
                tutorials.push({
                    srno: counter,
                    casenumber: element.casetype + "/" + element.caseno + "/" + element.year,
                    bundlenumber: element.bundlenumber,
                    pagecount: element.qcpagecount,
                    remarks: element.remarks,
                    date: moment(element.qccommited_at).format("DD/MM/YYYY hh:mm A"),
                });

                counter++;
            });
            worksheet.addRows(tutorials);
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "ProgressReportClassfication.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });

        })
    } else if (action == 2) {
        query = "select f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " where  f.imagestatus=3  and f.inwardstatus=1  order by id";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');
        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            let tutorials = [];
            var counter = 1;
            resdata.forEach((element) => {
                tutorials.push({
                    srno: counter,
                    casenumber: element.casetype + "/" + element.caseno + "/" + element.year,
                    bundlenumber: element.bundlenumber,
                    pagecount: element.qcpagecount,
                    remarks: element.remarks,
                    date: moment(element.metadata_at).format("DD/MM/YYYY hh:mm A"),
                });

                counter++;
            });
            worksheet.addRows(tutorials);
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "ProgressReportClassfication.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });

        })
    } else if (action == 3) {
        query = "select f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " where  f.imagestatus=4  and f.inwardstatus=1  order by id";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');
        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            let tutorials = [];
            var counter = 1;
            resdata.forEach((element) => {
                tutorials.push({
                    srno: counter,
                    casenumber: element.casetype + "/" + element.caseno + "/" + element.year,
                    bundlenumber: element.bundlenumber,
                    pagecount: element.qcpagecount,
                    remarks: element.remarks,
                    date: moment(element.classification_at).format("DD/MM/YYYY hh:mm A"),




                });

                counter++;
            });
            worksheet.addRows(tutorials);
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "ProgressReportOfVerify.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });
            // res.send({ status: true, data: data });
        })
    } else if (action == 7) {
       // query = "/findfirbyQuery?batch.created_by_d2.digitizationcenter=" + userID + "&imagestatus_eq=5&readyforupload_eq=false&_limit=-1";
        query = "select f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " where  f.imagestatus=5 and f.readyforverify=false  and f.inwardstatus=1  order by id";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');
        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            let tutorials = [];
            var counter = 1;
            resdata.forEach((element) => {
                tutorials.push({
                    srno: counter,
                    casenumber: element.casetype + "/" + element.caseno + "/" + element.year,
                    bundlenumber: element.bundlenumber,
                    pagecount: element.pdfpagecount,
                    remarks: element.remarks,
                    date: moment(element.classification_at).format("DD/MM/YYYY hh:mm A"),




                });

                counter++;
            });
            worksheet.addRows(tutorials);
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "ProgressReportOfVerify.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });
        })
    } else if (action == 4) {
        query = "select f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " where  f.imagestatus=5 and f.readyforverify=true  and f.inwardstatus=1  order by id";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');
        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            let tutorials = [];
            var counter = 1;
            resdata.forEach((element) => {
                tutorials.push({
                    srno: counter,
                    casenumber: element.casetype + "/" + element.caseno + "/" + element.year,
                    bundlenumber: element.bundlenumber,
                    pagecount: element.pdfpagecount,
                    remarks: element.remarks,
                    date: moment(element.classification_at).format("DD/MM/YYYY hh:mm A"),




                });

                counter++;
            });
            worksheet.addRows(tutorials);
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "ProgressReportOfVerify.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });
        })
    } else if (action == 5) {
        query = "select f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " where  f.imagestatus=6 and f.isupload=false and (f.thirdverify=false or f.thirdverify is null)  and f.inwardstatus=1  order by id";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');
        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            let tutorials = [];
            var counter = 1;
            resdata.forEach((element) => {
                tutorials.push({


                    srno: counter,
                    casenumber: element.casetype + "/" + element.caseno + "/" + element.year,
                    bundlenumber: element.bundlenumber,
                    pagecount: element.pdfpagecount,
                    remarks: element.remarks,
                    date: moment(element.verify_at).format("DD/MM/YYYY hh:mm A"),

                });

                counter++;
            });
            worksheet.addRows(tutorials);
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "UploadReport.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });
        })
    }
    else if (action == 8) {
       // query = "/findfirbyQuery?batch.created_by_d2.digitizationcenter=" + userID + "&imagestatus_eq=6&secondverify_eq=false&_limit=-1";
        query = "select f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " where  f.imagestatus=6 and f.secondverify=false  and f.inwardstatus=1  order by id";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');
        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            let tutorials = [];
            var counter = 1;
            resdata.forEach((element) => {
                tutorials.push({


                    srno: counter,
                    casenumber: element.casetype + "/" + element.caseno + "/" + element.year,
                    bundlenumber: element.bundlenumber,
                    pagecount: element.pdfpagecount,
                    remarks: element.remarks,
                    date: moment(element.verify_at).format("DD/MM/YYYY hh:mm A"),

                });

                counter++;
            });
            worksheet.addRows(tutorials);
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "UploadReport.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });
        })
    } else if (action == 9) {
        // query = "/findfirbyQuery?batch.created_by_d2.digitizationcenter=" + userID + "&imagestatus_eq=6&secondverify_eq=false&_limit=-1";
        query = "select f.*,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 and u.digitizationcenter=" + userID + " where  f.imagestatus=6 and f.secondverify=true and (f.thirdverify=false or f.thirdverify is null)  and f.inwardstatus=1  order by id";
        query = query.replace(/'users/g, '"users');
        query = query.replace(/user'/g, 'user"');
        CIPAService.executeSQL(query, function (batchdata) {
            var resdata = batchdata[0];
            let tutorials = [];
            var counter = 1;
            resdata.forEach((element) => {
                tutorials.push({


                    srno: counter,
                    casenumber: element.casetype + "/" + element.caseno + "/" + element.year,
                    bundlenumber: element.bundlenumber,
                    pagecount: element.pdfpagecount,
                    remarks: element.remarks,
                    date: moment(element.verify_at).format("DD/MM/YYYY hh:mm A"),

                });

                counter++;
            });
            worksheet.addRows(tutorials);
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "UploadReport.xlsx"
            );
            return workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });
        })
     }


}

module.exports = new AuditReportController();