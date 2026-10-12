var httpService = require('../service/httpService.js')
var moment = require('moment');
function ReceiveBatchController() { }

ReceiveBatchController.prototype.receiveBatchdPage = function (req, res) {
    let user = req.session.user;
    res.render('receivewardBatch', { title: 'Batch Management - Receive Batch', locals: res.locals });
}
ReceiveBatchController.prototype.batchesfindAllbyCreatedbyReceive = (req, res) => {
    console.log("req.params==============")
    console.log(req.query)
    var start = 0;
    if (req.query.pagination != undefined) {
        start = (parseInt(req.query.pagination.page) - 1) * parseInt(req.query.pagination.perpage)
        if (req.query.pagination.total != undefined) {
            if (start > parseInt(req.query.pagination.total)) {
                start = 0;
                req.query.pagination.page = 1;
            }
        }
    }
    if (req.params.id == 1) {

        httpService.get(encodeURI("/batches/count?created_by_d2.id=" + req.session.user.user.id + "&batchstatus_gte=" + BatchStatusEnum.batchstatus.inwardcommited + "&batchstatus_lt=" + BatchStatusEnum.batchstatus.outwardcommited), req.body, function (count) {
            httpService.get(encodeURI("/batchesfindAllbyCreatedby?created_by_d2.id=" + req.session.user.user.id + "&batchstatus_gte=" + BatchStatusEnum.batchstatus.inwardcommited + "&batchstatus_lt=" + BatchStatusEnum.batchstatus.outwardcommited + "&_sort=bundlenumber:ASC&_start=" + start + "&_limit=" + req.query.pagination.perpage), req.body, function (node) {
                var meta = req.query.pagination;
                meta.total = count;
                res.send({ status: true, data: JSON.parse(node), meta: meta });
            })
        })
    } else if (req.params.id == 2) {

        httpService.get(encodeURI("/batches/count?created_by_d2.id=" + req.session.user.user.id + "&batchstatus=" + BatchStatusEnum.batchstatus.outwardcommited), req.body, function (count) {
            httpService.get(encodeURI("/batchesfindAllbyCreatedby?created_by_d2.id=" + req.session.user.user.id + "&batchstatus=" + BatchStatusEnum.batchstatus.outwardcommited + "&_sort=bundlenumber:ASC&_start=" + start + "&_limit=" + req.query.pagination.perpage), req.body, function (node) {
                var meta = req.query.pagination;
                meta.total = count;
                res.send({ status: true, data: JSON.parse(node), meta: meta });
            })
        })
    }
    else if (req.params.id == 3) {

        httpService.get(encodeURI("/batches/count?receivecommited_by.id=" + req.session.user.user.id + "&batchstatus=" + BatchStatusEnum.batchstatus.receivecommited), req.body, function (count) {
            httpService.get(encodeURI("/batchesfindAllbyCreatedby?receivecommited_by.id=" + req.session.user.user.id + "&batchstatus=" + BatchStatusEnum.batchstatus.receivecommited + "&_sort=bundlenumber:ASC&_start=" + start + "&_limit=" + req.query.pagination.perpage), req.body, function (node) {
                var meta = req.query.pagination;
                meta.total = count;
                res.send({ status: true, data: JSON.parse(node), meta: meta });
            })
        })
    }
}
ReceiveBatchController.prototype.ReceiveFIRUpdate = (req, res) => {
    httpService.put("/firs/" + req.params.id, req.body, function (node) {
        res.send({ status: true, data: JSON.parse(node) });
    })
}
ReceiveBatchController.prototype.bulkReturnOnBatch = (req, res) => {

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
    httpService.get("/receiveBulkTag/" + query, req.body, function (node) {
        // console.log("BULK TAG")
        //console.log(node)
        res.send({ status: true, data: JSON.parse(node) });
    });
}
ReceiveBatchController.prototype.ReceiveBatchCommit = (req, res) => {
    req.body.batchstatus = BatchStatusEnum.batchstatus.receivecommited;
    req.body.receivecommited_at = new Date();
    req.body.receivecommited_by = req.session.user.user.id;
    req.body.islock = false;

    httpService.put("/batches/" + req.params.id, req.body, function (node1) {
        res.send({ status: true, data: JSON.parse(node1) });
    })
}
ReceiveBatchController.prototype.ReceiveBatchReceive = (req, res) => {
    httpService.get("/batchesfindOnebycreatedby?id=" + req.params.id, req.body, function (node) {
        var batch = JSON.parse(node);

        if (batch.islock) {
            if (batch.receivecommited_by.id == req.session.user.user.id) {

                req.session.batch = { id: batch.id, bundlenumber: batch.bundlenumber };
                res.send({ status: true, data: batch });

            } else {
                res.send({ status: false, data: null });
            }
        } else {
            req.body.receivecommited_by = req.session.user.user.id;
            req.body.islock = true;
            req.body.receive_at = new Date();
            httpService.put("/retriveBatchUpdateFIRReurnStatus/" + req.params.id, req.body, function (node1) {
                httpService.get("/batchesfindOnebycreatedby?id=" + req.params.id, req.body, function (node) {
                    var batch = JSON.parse(node);
                    req.session.batch = { id: batch.id, bundlenumber: batch.bundlenumber };
                    res.send({ status: true, data: batch });

                });


            })
        }
    })
}

module.exports = new ReceiveBatchController();