var authfilter=require("../filter/authfilter");
function InventoryReportRoute(app,db) {
    var InventoryReportController = require('../controllers/InventoryReportController');
    app.route("/InventoryReport.dwf").get(authfilter.isvaildUrl,InventoryReportController.inventoryReportdPage);
    app.route("/inventoryReportPrint.dwf").get(InventoryReportController.inventoryReportPrint);
    app.route("/barcodeReportPrint.dwf").get(InventoryReportController.barcodeReportPrint);
    app.route("/BarcodeReport.dwf").get(authfilter.isvaildUrl,InventoryReportController.barcodereportPage);
    
}
module.exports=InventoryReportRoute;