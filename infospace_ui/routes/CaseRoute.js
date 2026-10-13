var authfilter = require("../filter/authfilter");
function CaseRoute(app, db) {
    var CaseController = require('../controllers/CaseController');
    app.route("/caseSave.dwf").post( CaseController.save);
    app.route("/caseUpdate.dwf/:id").put( CaseController.update);
    app.route("/caseGet.dwf/:cino").get( CaseController.get);
    app.route("/caseDelete.dwf/:id").delete( CaseController.delete);

    app.route("/api/digitization/master/:master").get(CaseController.master);

    app.route("/digitizedEntry.dwf").get(authfilter.isvaildUrl, CaseController.digitizedEntryPage);
    app.route("/caseFiling.dwf").get(authfilter.isvaildUrl, CaseController.caseFilingPage);
    app.route("/api/digitization/digitizedEntry").get(CaseController.digitizedEntry);
}
module.exports = CaseRoute
