var authfilter = require("../filter/authfilter");
function FIleTagsRoute(app, db) {
    var FiletagController = require('../controllers/FiletagController');
    app.route("/FileTag.dwf").get(authfilter.isvaildUrl, FiletagController.filetagdPage);
    app.route("/batchesfindAllForFileTag.dwf").get(FiletagController.batchesfindAllForFileTag);
    app.route("/filetaGFIRUpdate.dwf/:id").put(FiletagController.filetaGFIRUpdate);
    app.route("/filetagCommit.dwf/:id").put(FiletagController.filetagCommit);
    app.route("/filetagReceive.dwf/:id").get(FiletagController.filetagReceive);
    app.route("/bulkTagOnBatch.dwf").get(FiletagController.bulkTagOnBatch);

}
module.exports = FIleTagsRoute