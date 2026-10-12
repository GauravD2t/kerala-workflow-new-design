var authfilter=require("../filter/authfilter");
function Roleroute(app,db) {
    var RoleController = require('../controllers/RoleController');  
    app.route("/roleHome.dwfs").get(authfilter.isvaildUrl,RoleController.home);
    app.route("/saveRole.dwf").post(RoleController.saveRole);
    app.route("/getallRole.dwf").get(RoleController.getallRole);
    app.route("/barcodegenrate.dwf").get(authfilter.isvaildUrl, RoleController.barcodegenrate);
    app.route("/getdocumenttypebarcode.dwf").get(RoleController.getdocumenttypebarcode);
    
}
module.exports=Roleroute