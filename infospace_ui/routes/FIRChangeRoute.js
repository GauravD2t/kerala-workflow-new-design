var authfilter = require("../filter/authfilter");
function FIRChangeRoute(app, db) {
    var FIRChangeStatusController = require('../controllers/FIRChangeStatusController');
    app.route("/CaseStatusChange.dwf").get(authfilter.isvaildUrl, FIRChangeStatusController.FIRStatusChange);
    app.route("/findFIr.dwf").get(FIRChangeStatusController.findFIr);
    app.route("/updateFIRStatus.dwf/").get(FIRChangeStatusController.ImageStatusupdateFIR);
    app.route("/deletefileChange.dwf").get(authfilter.isvaildUrl, FIRChangeStatusController.deletefileChange);
    app.route("/deleteFilechangestatus.dwf/").get(FIRChangeStatusController.deleteFile);
    app.route("/getesticode.dwf").get(FIRChangeStatusController.getesticode);
    app.route("/getcasetype.dwf").get(FIRChangeStatusController.getcasetype);
    app.route("/filewiselog.dwf").get(authfilter.isvaildUrl, FIRChangeStatusController.filewiselog); 

   // app.route("/filewiselog.dwf").get(authfilter.isvaildUrl, FIRChangeStatusController.filewiselog); 

}
module.exports = FIRChangeRoute