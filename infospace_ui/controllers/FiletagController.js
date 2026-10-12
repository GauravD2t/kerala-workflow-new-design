var httpService = require('../service/httpService.js')
var moment = require('moment');
function FiletagController() {
}
FiletagController.prototype.filetagdPage = function (req, res) {
    // console.log(res.locals)
    res.render('filetag', { title: 'File Taggging', locals: res.locals });
}
FiletagController.prototype.batchesfindAllForFileTag = (req, res) => {
   // console.log("req.params==============")
   // console.log(req.query)
    var start=0;
    if(req.query.pagination!=undefined){
         start=(parseInt(req.query.pagination.page) - 1)*parseInt(req.query.pagination.perpage)
        if(req.query.pagination.total!=undefined){
            if(start>parseInt(req.query.pagination.total)){
                start=0;
                req.query.pagination.page=1;
            }
         }
    }  
    httpService.get(encodeURI("/batches/count?inwardcommited_by.digitizationcenter.id=" + req.session.user.user.digitizationcenter.id + "&batchstatus=" + BatchStatusEnum.batchstatus.inwardcommited),  req.body, function (count) {   
    httpService.get(encodeURI("/batchesfindAllbyCreatedby?inwardcommited_by.digitizationcenter.id=" + req.session.user.user.digitizationcenter.id + "&batchstatus=" + BatchStatusEnum.batchstatus.inwardcommited),  req.body, function (node) {
        var  meta=req.query.pagination;
            meta.total=count;
           res.send({ status: true, data: JSON.parse(node) ,meta:meta});
        })
    })

}
FiletagController.prototype.bulkTagOnBatch = (req, res) => {

    var query = req.session.user.user.id + "?"
    var selectedbatch = req.query.selectedBatches;
    for (var i = 0; i < selectedbatch.length; i++) {
        if (i != selectedbatch.length - 1) {
            query = query + "id_in=" + parseInt(selectedbatch[i]) + "&";
        } else {
            query = query + "id_in=" + parseInt(selectedbatch[i]) + "&_sort=id:ASC";
        }
    }
    // console.log("/FileBulkTag/"+query);
    httpService.get("/FileBulkTag/" + query, req.body, function (node) {
        // console.log("BULK TAG")
        //console.log(node)
        res.send({ status: true, data: JSON.parse(node) });
    });
}
FiletagController.prototype.filetaGFIRUpdate = (req, res) => {
    httpService.put("/firs/" + req.params.id, req.body, function (node) {
        res.send({ status: true, data: JSON.parse(node) });
    })
}
FiletagController.prototype.filetagCommit = (req, res) => {
    req.body.batchstatus = BatchStatusEnum.batchstatus.fileTagcommit;
    req.body.filetagcommitted_at = new Date();
    req.body.filetagcommitted_by = req.session.user.user.id;
    req.body.islock = false;
    httpService.put("/batches/" + req.params.id, req.body, function (node1) {
        res.send({ status: true, data: JSON.parse(node1) });
    })
}
FiletagController.prototype.filetagReceive = (req, res) => {
    httpService.get("/batchesfindOnebycreatedby?id=" + req.params.id,  req.body, function (node) {

        var batch = JSON.parse(node);

        if (batch.islock) {
            // console.log(batch.filetagcommitted_by)
            if (batch.filetagcommitted_by.id == req.session.user.user.id) {
                // req.session.batch=batch;
                res.send({ status: true, data: batch });
            } else {
                res.send({ status: false, data: null });
            }
        } else {
            req.body.filetagcommitted_by = req.session.user.user.id;
            req.body.islock = true;
            req.body.filetagreceive_at = new Date();
            httpService.put("/retriveBatchUpdateFIRFileTag/" + req.params.id, req.body, function (node1) {
                /// console.log(node1)
                httpService.get("/batchesfindOnebycreatedby?id=" + req.params.id,  req.body, function (node) {
                    var batch = JSON.parse(node);
                    //  req.session.batch=batch;
                    res.send({ status: true, data: batch });
                });


            })
        }
    })
}
module.exports = new FiletagController();