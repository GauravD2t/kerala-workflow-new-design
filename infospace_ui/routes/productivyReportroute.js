
var authfilter = require("../filter/authfilter");
function productiveReportroute(app, db) {
    var productiveReportController = require('../controllers/productiveReportController');
    app.route("/productivityreport.dwf").get(authfilter.isvaildUrl, productiveReportController.productivityreport);
    app.route("/prductivityfilter.dwf").get(productiveReportController.prductivityfilter);

}
module.exports = productiveReportroute