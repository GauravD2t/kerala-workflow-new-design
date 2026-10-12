

var authfilter = require("../filter/authfilter");
function Auditroute(app, db) {
    var AuditReportController = require('../controllers/auditreportcontroller');
    app.route("/auditreport.dwf").get(authfilter.isvaildUrl, AuditReportController.auditreport);
    app.route("/filestatusreport.dwf").get(authfilter.isvaildUrl, AuditReportController.filestatusreport);
    
    app.route("/pendingauditreport.dwf").get(authfilter.isvaildUrl, AuditReportController.pendingauditreport);
    app.route("/receiveReport.dwf").get(authfilter.isvaildUrl, AuditReportController.receiveReport);
    app.route("/auditreportfilter.dwf").get(AuditReportController.auditreportfilter);
    app.route("/pendingauditreportfilter.dwf").get(AuditReportController.pendingauditreportfilter);
    app.route("/PEndingprogressReportAuditreport.dwf").get(AuditReportController.PEndingprogressReportAuditreport);
    app.route("/progressReportAuditreport.dwf").get(AuditReportController.progressReport);
    app.route("/progressReportByUSerWiseExcel.dwf").get(AuditReportController.progressReportByUSerWiseExcel);
    app.route("/batchwisereport.dwf").get(authfilter.isvaildUrl, AuditReportController.batchwisereport);
    app.route("/batchwisereportfilter.dwf").get(AuditReportController.batchwisereportfilter);

    app.route("/Inwardreport.dwf").get(AuditReportController.inwardReport);
    app.route("/UserWiseInwardReport.dwf").get(AuditReportController.UserWiseInwardReport);
    app.route("/ownworkingreport.dwf").get(AuditReportController.ownworkingreport);
    app.route("/ownworkingreportdownload.dwf").get(AuditReportController.ownworkingreportdownload);
    app.route("/filestatusreportFilter.dwf").get(AuditReportController.filestatusreportFilter);
    app.route("/filestatusreportFilterexcle.dwf").get(AuditReportController.filestatusreportFilterexcle);
    
}
module.exports = Auditroute