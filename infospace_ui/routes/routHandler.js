function routHandler(app, db) {
  var MenuGrouproute = require('./MenuGrouproute');
  var Menuroute = require('./Menuroute');
  var PolicestaionDashboardroute = require('./PolicestaionDashboardroute');
  var FIRRoute = require('./FIRroute');
  var loginroute = require('./loginroute');
  var Roleroute = require('./Roleroute');
  var InwardBatchroute = require('./InwardBatchroute');
  var Webserviceroute = require('./Webserviceroute');
  var InventoryReportRoute = require('./InventoryReportRoute');
  var FIleTagsRoute = require('./FIleTagsRoute');
  var OutwardBatchRoute = require('./OutwardBatchRoute');
  var ReceiveBatchRoute = require("./ReceiveBatchRoute");
  var ScanningTaskAssignRoute = require("./ScanningTaskAssignRoute");
  var centeradmindashboardroute = require("./centeradmindashboardroute");
  var backupRoute = require("./backupRoute");
  var DocumentVerifyroute = require("./documentverifyroute")
  var FIRChangeRoute = require("./FIRChangeRoute");
  var digiestimateroute = require("./digiestimateroute");
  var firrejectroute = require("./firrejectroute");
  var Auditroute = require("./auditreportroute");
  var productiveReportroute = require("./productivyReportroute");
  var readyForVerify = require("./readyforverifyroute");
  new readyForVerify(app, db);
  new Auditroute(app, db);
  new FIRChangeRoute(app, db);
  new PolicestaionDashboardroute(app, db);
  new Menuroute(app, db);
  new loginroute(app, db);
  new MenuGrouproute(app, db);
  new FIRRoute(app, db);
  new InwardBatchroute(app, db);
  new Roleroute(app, db);
  new Webserviceroute(app, db);
  new InventoryReportRoute(app, db);
  new FIleTagsRoute(app, db);
  new OutwardBatchRoute(app, db);
  new ReceiveBatchRoute(app, db);
  new ScanningTaskAssignRoute(app, db);
  new centeradmindashboardroute(app, db)
  new backupRoute(app, db);
  new digiestimateroute(app, db);
  new DocumentVerifyroute(app, db);
  new firrejectroute(app, db);
  new productiveReportroute(app, db);
  app.get("*", function (req, res) {
    res.render('404', { locals: res.locals });
  });
}
module.exports = routHandler;