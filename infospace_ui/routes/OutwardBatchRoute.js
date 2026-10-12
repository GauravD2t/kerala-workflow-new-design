var authfilter=require("../filter/authfilter");
function OutwardBatchRoute(app,db) {
var OutwardBatchController = require('../controllers/OutwardBatchController');
app.route("/BatchOutward.dwf").get(authfilter.isvaildUrl,OutwardBatchController.BatchOutwardPage);
 app.route("/batchesfindAllbyCreatedbyOutward.dwf/:id").get(OutwardBatchController.batchesfindAllbyCreatedbyOutward);
app.route("/outwardFIRUpdate.dwf/:id").put(OutwardBatchController.outwardFIRUpdate);
app.route("/outwardBatchReceive.dwf/:id").get(OutwardBatchController.outwardBatchReceive);
app.route("/outwardBatchCommit.dwf/:id").put(OutwardBatchController.outwardBatchCommit);
}
module.exports=OutwardBatchRoute