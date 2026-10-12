
var httpService = require('../service/httpService.js')
var moment = require('moment');
function ScanningTaskAssignController() {
}
ScanningTaskAssignController.prototype.ScanningTaskAssign = function (req, res) {
    // console.log(res.locals)
    res.render('scanningTaskAssign', { title: 'Case Allotment', locals: res.locals });
}
ScanningTaskAssignController.prototype.batchesfindAllForScanningTask = (req, res) => {
   
    httpService.get(encodeURI("/batchesfindAllbyCreatedby?scanningcommited_by.id=" + req.session.user.user.id + "&batchstatus=" + BatchStatusEnum.batchstatus.scanningcommited),  req.body, function (node) {
        res.send({ status: true, data: JSON.parse(node) });
    })

}
ScanningTaskAssignController.prototype.batchlistfortaskAssign = (req, res) =>{
    httpService.get(encodeURI("/batchesfindAllbyCreatedby?inwardcommited_by.digitizationcenter.id=" + req.session.user.user.id + "&batchstatus=" + BatchStatusEnum.batchstatus.inwardcommited),  req.body, function (node) {
        res.send({ status: true, data: JSON.parse(node) });
    })
}
ScanningTaskAssignController.prototype.receiveBatchAssign = (req, res) =>{
  
       
    httpService.get("/firs?batch=" + req.params.id+"&inwardstatus_ne=2&_sort=firregisternumber:ASC",  req.body, function (node) {
        res.send({ status: true, data: JSON.parse(node) });
    })
}
ScanningTaskAssignController.prototype.assignedFIR = (req, res) =>{
        
    httpService.get("/firs?batch=" + req.params.id+"&inwardstatus_ne=2&imagestatus=0&_sort=firregisternumber:DESC",  req.body, function (node) {
        res.send({ status: true, data: JSON.parse(node) });
    })
}
ScanningTaskAssignController.prototype.updatefirtask = (req, res) => {
        httpService.put("/firs/"+req.params.id, req.body, function (node) {
            res.send({ status: true, data: JSON.parse(node) });
        })
      
}
 ScanningTaskAssignController.prototype.bulkScanningTaskOnFIR = (req, res) => {
    
    var query = req.session.user.user.id + "?"
    var selectedbatch = req.query.selectedfir;
    for (var i = 0; i < selectedbatch.length; i++) {
        if (i != selectedbatch.length - 1) {
            query = query + "id_in=" + parseInt(selectedbatch[i]) + "&";
        } else {
            query = query + "id_in=" + parseInt(selectedbatch[i]) + "&_sort=id:ASC";
        }
    }
    req.body.scan_by=req.query.scan_by;
    req.body.qc_by=req.query.qc_by;
    req.body.imagestatus=0;
    httpService.put(encodeURI("/taskassingFIR/" + query), req.body, function (node) {
      data = JSON.parse(node)
      res.send({ status: true, data: JSON.parse(node) });
    });
}
ScanningTaskAssignController.prototype.userofdigilization = (req, res) => {

    var query = req.session.user.user.id + "?"
   
    httpService.get("/users?digitizationcenter="+req.session.user.user.id  , req.body, function (node) {
        // console.log("BULK TAG")
        //console.log(node)
        res.send({ status: true, data: JSON.parse(node) });
    });
}




module.exports = new ScanningTaskAssignController();