var authfilter=require("../filter/authfilter");
function ReceiveBatchRoute(app,db) {
    var ReceiveBatchController = require('../controllers/ReceiveBatchController');
    app.route("/ReceiveBatch.dwf").get(authfilter.isvaildUrl,ReceiveBatchController.receiveBatchdPage);
    app.route("/batchesfindAllbyCreatedbyReceive.dwf/:id").get(ReceiveBatchController.batchesfindAllbyCreatedbyReceive);
    app.route("/ReceiveFIRUpdate.dwf/:id").put(ReceiveBatchController.ReceiveFIRUpdate);
    app.route("/ReceiveBatchReceive.dwf/:id").get(ReceiveBatchController.ReceiveBatchReceive);
    app.route("/ReceiveBatchCommit.dwf/:id").put(ReceiveBatchController.ReceiveBatchCommit);
    app.route("/bulkReturnOnBatch.dwf").get(ReceiveBatchController.bulkReturnOnBatch);
    }
    module.exports=ReceiveBatchRoute