var authfilter=require("../filter/authfilter");
function backupRoute(app,db) {
    var databseBackUpController = require('../controllers/databseBackUpController');
    app.route("/backUpDatabase.dwf").get(authfilter.isvaildUrl,databseBackUpController.backupPage);

    app.route("/databaseSave.dwf").post(databseBackUpController.databaseSave);
    app.route("/editdatabase.dwf/:id").get(databseBackUpController.editdatabase);
    app.route("/databaseUpdate.dwf/:id").put(databseBackUpController.databaseUpdate);
    app.route("/getAllDatabase.dwf").get(databseBackUpController.getAllDatabase);
    app.route("/getlastbackupFile.dwf").get(databseBackUpController.getlastbackupFile);
   // app.route("/batchesfindAllForFileTag.dwf").get(databseBackUpController.batchesfindAllForFileTag);
   
    
}
module.exports=backupRoute