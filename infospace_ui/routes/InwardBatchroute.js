var authfilter = require("../filter/authfilter");
function InwardBatchroute(app, db) {
    var InwardBatchController = require('../controllers/InwardBatchController');
    app.route("/BatchInward.dwf").get(authfilter.isvaildUrl, InwardBatchController.inwardBatchdPage);
    app.route("/batchesfindAllbyCreatedbyInward.dwf/:id").get(InwardBatchController.batchesfindAllbyCreatedbyInward);
    app.route("/inwardFIRUpdate.dwf/:id").put(InwardBatchController.inwardFIRUpdate);
    app.route("/inwardbatchupdate.dwf/:id").put(InwardBatchController.inwardbatchupdate);
    app.route("/editBatchinward.dwf/:id").get(InwardBatchController.editBatchinward);
    app.route("/inwardBatchReceive.dwf/:id").get(InwardBatchController.inwardBatchReceive);
    app.route("/inwardBatchCommit.dwf/:id").put(InwardBatchController.inwardBatchCommit);
    app.route("/isvalidFIRInward.dwf").post(InwardBatchController.isvalidFIRInward);
}
module.exports = InwardBatchroute