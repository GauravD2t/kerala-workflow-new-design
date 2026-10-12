var authfilter=require("../filter/authfilter");
function digiestimateroute(app,db) {
    var digiestimatecontroller = require('../controllers/digiestimatecontroller');
    app.route("/estimate.dwf").get(authfilter.isvaildUrl,digiestimatecontroller.digiestimate);
    app.route("/getallEstimate.dwf").get(digiestimatecontroller.getAlldigiestimate);
    app.route("/saveestimate.dwf").post(digiestimatecontroller.save);
    app.route("/estimatedelete.dwf/:id").delete(digiestimatecontroller.delete);
    app.route("/estimateEdit.dwf/:id").get(digiestimatecontroller.edit);
    app.route("/estimateUpdate.dwf/:id").put(digiestimatecontroller.update);
}
module.exports=digiestimateroute