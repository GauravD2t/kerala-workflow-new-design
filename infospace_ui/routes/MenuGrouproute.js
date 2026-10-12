var authfilter=require("../filter/authfilter");
function MenuGrouproute(app,db) {
    var MenuGroupController = require('../controllers/MenuGroupController');
    app.route("/menugroupHome").get(authfilter.isvaildUrl,MenuGroupController.menugroupPage);
    app.route("/menugroup").get(MenuGroupController.menugroup);
    app.route("/menugroups").post(MenuGroupController.save);
    app.route("/menugroups/:id").delete(MenuGroupController.delete);
    app.route("/menugroupsEdit/:id").get(MenuGroupController.edit);
    app.route("/menugroupUpdate/:id").put(MenuGroupController.update);
}
module.exports=MenuGrouproute