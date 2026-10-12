var authfilter=require("../filter/authfilter");
function Menuroute(app,db) {
    var MenuController = require('../controllers/MenuController');
    app.route("/menuHome.dwf").get(authfilter.isvaildUrl,MenuController.menuPage);
    app.route("/menuGetAll.dwf").get(MenuController.menu);
    app.route("/menusSave.dwf").post(MenuController.save);
    app.route("/menusDelete.dwf/:id").delete(MenuController.delete);
    app.route("/menusEdit.dwf/:id").get(MenuController.edit);
    app.route("/menuUpdate.dwf/:id").put(MenuController.update);
    app.route("/getmenubyrole.dwf/:id").get(MenuController.getmenubyrole);
   
    app.route("/readDataFromExcle.dwf").get(MenuController.readDataFromExcle);
    
}
module.exports=Menuroute