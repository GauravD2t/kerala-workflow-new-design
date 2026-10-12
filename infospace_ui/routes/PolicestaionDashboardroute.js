var authfilter = require("../filter/authfilter");
function PolicestaionDashboardroute(app, db) {
    var PoliceStationDashboardController = require('../controllers/PoliceStationDashboardController');
    app.route("/policestationDashboard.dwf").get(authfilter.isvaildUrl, PoliceStationDashboardController.policestationDashboardPage);
    app.route("/batchsGetAll.dwf").get(PoliceStationDashboardController.batch);
    app.route("/dashboradcounter.dwf").get(PoliceStationDashboardController.dashboradcounter);
    app.route("/batchsDelete.dwf/:id").delete(PoliceStationDashboardController.delete);
    app.route("/batchsEdit.dwf/:id").get(PoliceStationDashboardController.edit);
    app.route("/batchUpdateStatus.dwf/:status/:id").put(PoliceStationDashboardController.batchUpdateStatus);
    app.route("/inwardDashboard.dwf").get(authfilter.isvaildUrl, PoliceStationDashboardController.inwardDashboard);
    app.route("/inwardDashboardCouter.dwf").get(PoliceStationDashboardController.inwardDashboardCouter);

    app.route("/suersetdashbord.dwf").get(authfilter.isvaildUrl, PoliceStationDashboardController.suersetdashbord);

}
module.exports = PolicestaionDashboardroute