var authfilter = require("../filter/authfilter");
function userHasMenu(req, menuurl) {
    return req.session.user && req.session.user.user &&
        (req.session.user.user.menus || []).some(function (m) { return m.menuurl === menuurl; });
}
function caseFilingOrVerify(req, res, next) {
    if (userHasMenu(req, 'caseFiling.dwf') || userHasMenu(req, 'readyforverify.dwf')) return next();
    res.status(500).send({ status: false, message: "you are not authorized to access this Page" });
}
function CaseRoute(app, db) {
    var CaseController = require('../controllers/CaseController');
    app.route("/caseSave.dwf").post( CaseController.save);
    app.route("/caseUpdate.dwf/:id").put( CaseController.update);
    app.route("/caseGet.dwf/:cino").get( CaseController.get);
    app.route("/caseDelete.dwf/:id").delete( CaseController.delete);

    app.route("/api/digitization/master/sync").post(CaseController.syncMasters);
    app.route("/api/digitization/master/:master").get(CaseController.master);

    app.route("/digitizedEntry.dwf").get(authfilter.isvaildUrl, CaseController.digitizedEntryPage);
    app.route("/caseFiling.dwf").get(authfilter.isvaildUrl, CaseController.caseFilingPage);
    app.route("/caseFilingEmbed.dwf").get(caseFilingOrVerify, CaseController.caseFilingPage);
    app.route("/api/digitization/digitizedEntry").get(CaseController.digitizedEntry);
    app.route("/api/digitization/digitizedEntryByFir").get(CaseController.digitizedEntryByFir);
    app.route("/api/digitization/checkFirBundle").get(CaseController.checkFirBundle);
    app.route("/api/digitization/fetchCase").get(CaseController.fetchCaseByCino);
}
module.exports = CaseRoute
