var authfilter = require("../filter/authfilter");
function ReadyForVerifyRoute(app, db) {
    var readyforverifycontroller = require('../controllers/readyforverifycontroller');
    app.route("/readyforverify.dwf").get(authfilter.isvaildUrl, readyforverifycontroller.readyforverify);
    app.route("/getbstchesforvirfyReady.dwf").get(readyforverifycontroller.getbstchesforvirfyReady);
    app.route("/findFIrsbybathcReadyforVerify.dwf").post(readyforverifycontroller.findFIrsbybathcReadyforVerify);
    app.route("/bulkReadyForVerify.dwf").post(readyforverifycontroller.bulkReadyForVerify);
    app.route("/bulkReadyForVerifyReject.dwf").post(readyforverifycontroller.bulkReadyForVerifyReject);
    app.route("/getmetadatabffile.dwf").get(readyforverifycontroller.getmetadatabffile);

    app.route("/readyforUpload.dwf").get(authfilter.isvaildUrl, readyforverifycontroller.readyforUpload);
    app.route("/getbstchesforUploadReady.dwf").get(readyforverifycontroller.getbstchesforUploadReady);
    app.route("/findFIrsbybathcReadyforUpload.dwf").post(readyforverifycontroller.findFIrsbybathcReadyforUpload);
    app.route("/bulkReadyForUpload.dwf").post(readyforverifycontroller.bulkReadyForUpload);



}
module.exports = ReadyForVerifyRoute