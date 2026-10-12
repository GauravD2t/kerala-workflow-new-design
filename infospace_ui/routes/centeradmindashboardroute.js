var authfilter=require("../filter/authfilter");
function centeradmindashboardroute(app,db) {
    var CenterAdminDashboardcontroller = require('../controllers/CenterAdminDashboardcontroller');
app.route("/centeradmincounter.dwf").get(CenterAdminDashboardcontroller.centeradmincounter);
app.route("/admincounter.dwf").get(CenterAdminDashboardcontroller.admincounter);
app.route("/adminDashboard.dwf").get(authfilter.isvaildUrl,CenterAdminDashboardcontroller.centeradminDashboard);
app.route("/admin_Dashboard.dwf").get(authfilter.isvaildUrl,CenterAdminDashboardcontroller.superAdminDashboard);
app.route("/progressReportSupperadmin.dwf/:type").get(CenterAdminDashboardcontroller.progressReportSupperadmin);
app.route("/progressReportadmin.dwf/:id").get(CenterAdminDashboardcontroller.progressReportadmin);
}
module.exports=centeradmindashboardroute