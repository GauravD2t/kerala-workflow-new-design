

function Webserviceroute(app, db) {
    var webserviceController = require('../controllers/webserviceController');
    var ScanningSoftwareController = require('../controllers/scannigsoftwarecontroller');
    app.route("/service/login").post(webserviceController.loginservice);
    app.route("/service/logout.ser").get(webserviceController.logoutservice);
    // Scan
    app.route("/service/getAllscanbatch.ser").post(webserviceController.getAllbatch);
    app.route("/service/getAllbatchCaseNoCaseYear.ser").post(webserviceController.getAllbatchCaseNoCaseYear);
    app.route("/service/getAllScanbatchRejectByverify.ser").post(webserviceController.getAllScanbatchRejectByverify);
    app.route("/service/getAllClassficationbatchRejectByverify.ser").post(webserviceController.getAllClassficationbatchRejectbyVerify);
    app.route("/service/updatepagecountByfir.ser").post(webserviceController.updatepagecount);
    app.route("/service/savefirfromscan.ser").post(webserviceController.savefirfromscan);
    app.route("/service/getAllscanQCbatch.ser").post(webserviceController.getAllscanQCbatch);
    app.route("/service/savefirfromscanQC.ser").post(webserviceController.savefirfromscanQC);
    app.route("/service/savefirfromscanPDF.ser").post(webserviceController.savefirfromscanPDF);
    //receive Fir FirstTime lock    
    app.route("/service/receivefirfromscan.ser").post(webserviceController.receivefirfromscan);
    app.route("/service/receivefirfromscanQC.ser").post(webserviceController.receivefirfromscanQC);
    app.route("/service/getAllBatchPDFGenerate.ser").post(webserviceController.getAllBatchPDFGenerate);

    app.route("/service/getAllQCrejectedBatch.ser").post(webserviceController.getAllQCrejectedBatch);
    app.route("/service/setFIRQCrejected.ser").post(webserviceController.setFIRQCrejected);
    app.route("/service/setFIRQCApproval.ser").post(webserviceController.setFIRQCApproval);
    app.route("/service/getDocumenttype.ser").post(webserviceController.getDocumenttype);
    app.route("/service/getAllnodehierarchyforScanning.ser").post(webserviceController.getAllnodehierarchyforScanning);
    app.route("/service/getIssubchildNodeByparentID.ser").post(webserviceController.getIssubchildNodeByparentID);
    app.route("/service/getAllClassficationbatch.ser").post(webserviceController.getAllClassficationbatch);
    app.route("/service/saveClassficationFile.ser").post(webserviceController.saveClassficationFile);
    app.route("/service/getClassficationByFile.ser").post(webserviceController.getClassficationByFile);
    app.route("/service/updateClassficationByID.ser").post(webserviceController.updateClassficationByID);
    app.route("/service/commitFileFromClassification.ser").post(webserviceController.commitFileFromClassification);
    app.route("/service/finalQC.ser").post(webserviceController.finalQC);
    app.route("/servicee/editClassficationByID.ser").post(webserviceController.editClassficationByID);
    app.route("/service/deleteClassficationByID.ser").post(webserviceController.deleteClassficationByID);
    app.route("/service/updatePDFPathClassficationByID.ser").post(webserviceController.updatePDFPathClassficationByID);
    app.route("/getListofpdfuploadtoDMS").get(webserviceController.getListofpdfuploadtoDMS);
    app.route("/resetuploadtoDMS").get(webserviceController.resetuploadtoDMS);
    app.route("/updateStatusUploadFile").post(webserviceController.updateStatusUploadFile);
    app.route("/updateStatusUploadFileSetFalse").post(webserviceController.updateStatusUploadFileSetFalse);
    app.route("/updateitemIdofFile").post(webserviceController.updateitemIdofFile);
    app.route("/service/DeleteClassficationByFile.ser").post(webserviceController.DeleteClassficationByFile);
    app.route("/service/createBatch.ser").post(webserviceController.createBatch);
    app.route("/service/createfile.ser").post(webserviceController.createfile);
    app.route("/service/updateImageClassficationByID.ser").post(webserviceController.updateImageClassficationByID);


    app.route("/service/getAllDataEnterybatch.ser").post(webserviceController.getAllDataEnterybatch);
    app.route("/service/metadatamaster.ser").get(webserviceController.metadatamaster);
    app.route("/service/savemetadataByFile.ser").post(webserviceController.savemetadataByFile);
    app.route("/service/updatemetadataByFile.ser").post(webserviceController.updatemetadataByFile);



    app.route("/service/getBatchesNameForScanningStage.ser").post(ScanningSoftwareController.getBatchesNameForScanningStage);
    app.route("/service/getFileListForScanningStageByBatchID.ser").post(ScanningSoftwareController.getFileListForScanningStageByBatchID);

    app.route("/service/getBatchesNameForImageQCStage.ser").post(ScanningSoftwareController.getBatchesNameForImageQCStage);
    app.route("/service/getFileListForImageQCStageByBatchID.ser").post(ScanningSoftwareController.getFileListForImageQCStageByBatchID);

    app.route("/service/getBatchesNameForImageQCRejectStage.ser").post(ScanningSoftwareController.getBatchesNameForImageQCRejectStage);
    app.route("/service/getFileListForImageQCRejectStageByBatchID.ser").post(ScanningSoftwareController.getFileListForImageQCRejectStageByBatchID);


    app.route("/service/getBatchesNameForDataEntryStage.ser").post(ScanningSoftwareController.getBatchesNameForDataEntryStage);
    app.route("/service/getFileListForDataEntryByBatchID.ser").post(ScanningSoftwareController.getFileListForDataEntryByBatchID);

    app.route("/service/getBatchesNameForClassificationStage.ser").post(ScanningSoftwareController.getBatchesNameForClassificationStage);
    app.route("/service/getFileListForClassificationByBatchID.ser").post(ScanningSoftwareController.getFileListForClassificationByBatchID);


    app.route("/service/getBatchesNameForRejectClassificationStage.ser").post(ScanningSoftwareController.getBatchesNameForRejectClassificationStage);
    app.route("/service/getFileListForRejectClassificationByBatchID.ser").post(ScanningSoftwareController.getFileListForRejectClassificationByBatchID);


    app.route("/service/getBatchesNameForCSVExportStage.ser").post(ScanningSoftwareController.getBatchesNameForCSVExportStage);
    app.route("/service/getFileListForCSVExportByBatchID.ser").post(ScanningSoftwareController.getFileListForCSVExportByBatchID);
    app.route("/service/getBatchesNameForPDFStage.ser").post(ScanningSoftwareController.getBatchesNameForPDFStage);
    app.route("/service/getFileListForPDFByBatchID.ser").post(ScanningSoftwareController.getFileListForPDFByBatchID);
    app.route("/service/getBatchesNameForFirstverifyStage.ser").post(ScanningSoftwareController.getBatchesNameForFirstverifyStage);
    app.route("/service/getFileListForFirstVerifyByBatchID.ser").post(ScanningSoftwareController.getFileListForFirstVerifyByBatchID);
    app.route("/service/lockFile.ser").post(ScanningSoftwareController.lockFile);
    app.route("/service/unlockFile.ser").post(ScanningSoftwareController.unlockFile);
    app.route("/service/checkLockstatusofFile.ser").post(ScanningSoftwareController.checkLockstatusofFile);
    app.route("/autoqcstatusupdate").post(ScanningSoftwareController.autoqcstatusupdate);

}
module.exports = Webserviceroute