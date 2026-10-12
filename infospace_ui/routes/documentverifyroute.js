var authfilter = require("../filter/authfilter");
function DocumentVerifyroute(app, db) {
    var documentverifycontroller = require('../controllers/documentverifycontroller');
    app.route("/documentverify.dwf").get(authfilter.isvaildUrl, documentverifycontroller.documentverify);
    app.route("/documentverifySinglepageVerify.dwf").get(documentverifycontroller.documentverifySinglepageVerify);
    app.route("/getbstches.dwf").get(documentverifycontroller.getbstches);
    app.route("/getbstchesecondverify.dwf").get(documentverifycontroller.getbstchesecondverify); 
    app.route("/getbstchesForFirstTimeVerify.dwf").get(documentverifycontroller.getbstchesForFirstTimeVerify);

    
    app.route("/getdocumentclassficationByfir.dwf").get(documentverifycontroller.getdocumentclassficationByfir);
    app.route("/getpdf.dwf").get(documentverifycontroller.getpdf);
    app.route("/verifyFile.dwf/:id").put(documentverifycontroller.verifyFile);
    app.route("/findFIrsbybathc.dwf").get(documentverifycontroller.findFIrsbybathc);
    app.route("/findFIrsbybathcsecondverify.dwf").get(documentverifycontroller.findFIrsbybathcsecondverify);
    app.route("/findFIrsbybathcForFirstTime.dwf").get(documentverifycontroller.findFIrsbybathcForFirstTime);

    app.route("/rejectforMetadata.dwf").post(documentverifycontroller.rejectforMetadata);
    
    app.route("/bulkverifyfile.dwf").post(documentverifycontroller.bulverifyfile);
    app.route("/findfilefromSeachInVerify.dwf").get(documentverifycontroller.findfilefromSeachInVerify);
    app.route("/getclassficationmodal.dwf").get(documentverifycontroller.getclassficationmodal);
    app.route("/updatedocumentclassficationByfir.dwf").post(documentverifycontroller.updatedocumentclassficationByfir);
    
    app.route("/secondtimebulkverifyfile.dwf").post(documentverifycontroller.secondtimebulkverifyfile);
    app.route("/secondtimeupload.dwf").get(authfilter.isvaildUrl, documentverifycontroller.secondtimeupload);
    app.route("/filenotuploadlist.dwf").get(documentverifycontroller.filenotuploadlist);
    app.route("/secondverifybulkwithupload.dwf").post(documentverifycontroller.secondverifybulkwithupload); 
    app.route("/secondverify.dwf").get(authfilter.isvaildUrl, documentverifycontroller.secondverify);
    app.route("/rejectforMetadatasecondverify.dwf").post(documentverifycontroller.rejectforMetadatasecondverify);

    app.route("/thirdverify.dwf").get(authfilter.isvaildUrl, documentverifycontroller.thirdverify);
    app.route("/getbstchethirdverify.dwf").get(documentverifycontroller.getbstchethirdverify);
    app.route("/thirdverifybulkwithupload.dwf").post(documentverifycontroller.thirdverifybulkwithupload);
    app.route("/rejectforMetadatathidverify.dwf").post(documentverifycontroller.rejectforMetadatathidverify);
    app.route("/findFIrsbybathcthidverify.dwf").get(documentverifycontroller.findFIrsbybathcthidverify);
    app.route("/getpdfwithstatusSecondVerification.dwf").post(documentverifycontroller.getpdfwithstatusSecondVerification);
    app.route("/updateclassficationSecondSign.dwf").post(documentverifycontroller.updateclassficationSecondSign);
   
}
module.exports = DocumentVerifyroute