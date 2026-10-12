var authfilter=require("../filter/authfilter");
function loginroute(app,db) {
    var loginController = require('../controllers/loginController');  
    app.route("/").get(loginController.home);
    app.route("/login").post(loginController.login);
    app.route("/confirmlogin").post(loginController.confirmlogin);
    app.route("/logout.dwf").get(loginController.logout);
    app.route("/user.dwf").get(authfilter.isvaildUrl,loginController.user);
    app.route("/black.dwf").get(loginController.blackpage);
    app.route("/digitizationuser.dwf").get(authfilter.isvaildUrl,loginController.digitizationuser);
    app.route("/registeruser.dwf").post(loginController.Registeruser);
    app.route("/policestationByid").get(loginController.policestationByid);
    app.route("/roles/:id").get(loginController.roles);
    app.route("/getAllUser.dwf").get(loginController.getAllUser);
    app.route("/userDelete.dwf/:id").delete(loginController.deleteUser);
    app.route("/userEdit.dwf/:id").get(loginController.editUser);
    app.route("/updateuser.dwf/:id").post(loginController.updateuser);
    app.route("/isvaliduser.dwf").post(loginController.isvaliduser);
    app.route("/policestationsbydistrict.dwf/:id").get(loginController.policestationsbydistrict);
    
}
module.exports=loginroute