var httpService = require('../service/httpService.js')
var moment = require('moment');
function OutwardBatchController() { }

OutwardBatchController.prototype.BatchOutwardPage = function (req, res) {
    let user = req.session.user;
    res.render('outwardBatch', { title: 'Inventory Management - Batch Outward', locals: res.locals });
}
OutwardBatchController.prototype.batchesfindAllbyCreatedbyOutward = (req, res) => {
    //console.log("req.params==============")
    //s console.log(req.query)
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

        httpService.get(encodeURI("/batches/count?qccommited_by.digitizationcenter.id=" + req.session.user.user.digitizationcenter.id + "&batchstatus=" + BatchStatusEnum.batchstatus.Qccommited), req.body, function (count) {
            httpService.get(encodeURI("/batchesfindAllbyCreatedby?qccommited_by.digitizationcenter.id=" + req.session.user.user.digitizationcenter.id + "&batchstatus=" + BatchStatusEnum.batchstatus.Qccommited + "&_sort=bundlenumber:ASC&_start=" + start + "&_limit=" + req.query.pagination.perpage), req.body, function (node) {
                var meta = req.query.pagination;
                meta.total = count;
                res.send({ status: true, data: JSON.parse(node), meta: meta });
            })
        })
    } else if (req.params.id == 2) {

        httpService.get(encodeURI("/batches/count?outwardcommited_by=" + req.session.user.user.id + "&batchstatus=" + BatchStatusEnum.batchstatus.outwardcommited), req.body, function (count) {
            httpService.get(encodeURI("/batchesfindAllbyCreatedby?outwardcommited_by=" + req.session.user.user.id + "&batchstatus=" + BatchStatusEnum.batchstatus.outwardcommited + "&_sort=bundlenumber:ASC&_start=" + start + "&_limit=" + req.query.pagination.perpage), req.body, function (node) {
                var meta = req.query.pagination;
                meta.total = count;
                res.send({ status: true, data: JSON.parse(node), meta: meta });
            })
        })
    }
    else if (req.params.id == 3) {

        httpService.get(encodeURI("/batches/count?outwardcommited_by=" + req.session.user.user.id + "&batchstatus=" + BatchStatusEnum.batchstatus.receivecommited), req.body, function (count) {
            httpService.get(encodeURI("/batchesfindAllbyCreatedby?outwardcommited_by=" + req.session.user.user.id + "&batchstatus=" + BatchStatusEnum.batchstatus.receivecommited + "&_sort=bundlenumber:ASC&_start=" + start + "&_limit=" + req.query.pagination.perpage), req.body, function (node) {
                var meta = req.query.pagination;
                meta.total = count;
                res.send({ status: true, data: JSON.parse(node), meta: meta });
            })
        })
    }
}
OutwardBatchController.prototype.outwardFIRUpdate = (req, res) => {
    httpService.put("/firs/" + req.params.id, req.body, function (node) {
        res.send({ status: true, data: JSON.parse(node) });
    })
}

OutwardBatchController.prototype.outwardBatchCommit = (req, res) => {
    req.body.batchstatus = BatchStatusEnum.batchstatus.outwardcommited;
    req.body.outwardcommited_at = new Date();
    req.body.outwardcommited_by = req.session.user.user.id;
    req.body.islock = false;
    if (req.body.returndate != undefined) {
        var date = moment(req.body.returndate, 'DD/MM/YYYY').format('YYYY-MM-DD');
        req.body.returndate = date + " 23:50:50";
    }
    httpService.put("/batches/" + req.params.id, req.body, function (node1) {
        res.send({ status: true, data: JSON.parse(node1) });
    })
}
OutwardBatchController.prototype.outwardBatchReceive = (req, res) => {
    httpService.get("/batchesfindOnebycreatedby?id=" + req.params.id, req.body, function (node) {
        var batch = JSON.parse(node);

        if (batch.islock) {
            if (batch.outwardcommited_by.id == req.session.user.user.id) {

                req.session.batch = { id: batch.id, bundlenumber: batch.bundlenumber };
                res.send({ status: true, data: batch });

            } else {
                res.send({ status: false, data: null });
            }
        } else {
            req.body.outwardcommited_by = req.session.user.user.id;
            req.body.islock = true;
            req.body.outwardreceive_at = new Date();
            httpService.put("/batches/" + req.params.id, req.body, function (node1) {
                httpService.get("/batchesfindOnebycreatedby?id=" + req.params.id, req.body, function (node) {
                    var batch = JSON.parse(node);
                    req.session.batch = { id: batch.id, bundlenumber: batch.bundlenumber };
                    res.send({ status: true, data: batch });

                });


            })
        }
    })
}


OutwardBatchController.prototype.getbstchesForoutward = function (req, res) {

    query = 'select b.id,b.bundlenumber as bundlenumber from firs f join batches b on b.id=f.batch where  f.imagestatus=6 and readyforverify=true and outward=false group by b.id,b.bundlenumber order by b.bundlenumber'
    CIPAService.executeSQL(query, function (batchdata) {
        var resultbat = batchdata[0];
        res.send({ status: true, data: resultbat });
    })


}

OutwardBatchController.prototype.bulverifyfileoutward = async function (req, res) {

    var deletequery = "update firs set outward=true where id in (" + req.body.selectedfile.toString() + ")";
    console.log(deletequery)
    CIPAService.UpdateexecuteSQL(deletequery, await function (data) {


        if (data != null) {
            res.send({ status: true });
        } else {
            res.send({ status: false });
        }
    })

}
OutwardBatchController.prototype.findFIrsbybathcForoutward = function (req, res) {
    httpService.get("/firs?imagestatus=6&readyforverify=true&outward=false&batch=" + req.query.batch + "&_limit=-1", req.body, function (node1) {
        res.send({ status: true, data: JSON.parse(node1) });
    })
}
module.exports = new OutwardBatchController();