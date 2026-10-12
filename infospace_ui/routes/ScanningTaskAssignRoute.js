var authfilter=require("../filter/authfilter");
function ScanningTaskAssignRoute(app,db) {
    var ScanningTaskAssignController = require('../controllers/ScanningTaskAssignController');
    app.route("/CaseAllotment.dwf").get(authfilter.isvaildUrl,ScanningTaskAssignController.ScanningTaskAssign);
    app.route("/batchesfindAllForScanningTask.dwf").get(ScanningTaskAssignController.batchesfindAllForScanningTask);
    app.route("/bulkScanningTaskOnFIR.dwf").get(ScanningTaskAssignController.bulkScanningTaskOnFIR);
    app.route("/userofdigilization.dwf").get(ScanningTaskAssignController.userofdigilization);
    app.route("/batchlistfortaskAssign.dwf").get(ScanningTaskAssignController.batchlistfortaskAssign);
    app.route("/receiveBatchAssign.dwf/:id").get(ScanningTaskAssignController.receiveBatchAssign); 
    app.route("/assignedFIR.dwf/:id").get(ScanningTaskAssignController.assignedFIR);
    app.route("/updatefirtask.dwf/:id").put(ScanningTaskAssignController.updatefirtask);
    
}
module.exports=ScanningTaskAssignRoute