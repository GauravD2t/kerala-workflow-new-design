var authfilter = require("../filter/authfilter");
function FIRroute(app, db) {
    var FIRController = require('../controllers/FIRController');
    app.route("/BatchCreate.dwf").get(authfilter.isvaildUrl, FIRController.firdPage);
    app.route("/firreport.dwf").get(authfilter.isvaildUrl, FIRController.firreport);

    app.route("/firreportfilter.dwf").get(FIRController.firreportfilter);
    app.route("/FIRGetAll.dwf").get(FIRController.getAllfir);
    app.route("/firSave.dwf").post(FIRController.save);
    app.route("/firDelete.dwf/:id").delete(FIRController.delete);
    app.route("/delteFRIbyBatch.dwf").delete(FIRController.delteFRIbyBatch);
    app.route("/firEdit.dwf/:id").get(FIRController.edit);
    app.route("/isvalidFIR.dwf").post(FIRController.isvalidFIR);
    app.route("/firUpdate.dwf/:id").put(FIRController.update);
    app.route("/batchCommitUpdate.dwf/").put(FIRController.batchCommitUpdate);
    app.route("/batchesfindAllbyCreatedby.dwf/:id").get(FIRController.batchesfindAllbyCreatedby);
    app.route("/editBatch.dwf/:id").get(FIRController.editBatch);
    app.route("/cancleBatch.dwf").put(FIRController.cancleBatch);
    app.route("/editupdateBatch.dwf").put(FIRController.editupdateBatch);
    app.route("/metadatamasterlist.dwf").get(FIRController.metadatamasterlist);

    app.route("/getcasetypebyEsticode.dwf/:crn").get(FIRController.getcasetypebyEsticode);
    app.route("/getCasetypecaenoyearDMS.dwf/").get(FIRController.getCasetypecaenoyearDMS);

}
module.exports = FIRroute