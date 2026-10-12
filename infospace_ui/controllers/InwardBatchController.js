var httpService = require('../service/httpService.js')
var moment = require('moment');
const AsiosUtil = require("../service/AxiosUtil")
var LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');
var CIPAService = require("../service/CIPAService");
function InwardBatchController() { }

InwardBatchController.prototype.inwardBatchdPage = function (req, res) {
    // const AxiosUtil = new AsiosUtil();
    // AxiosUtil.postxForm("/api/authn/login", { "password": 'Dspace@2014', "user": 'support@d2t.co' }).then(function (loginResponce) {

    //     console.log(loginResponce.headers['authorization'])
    //     console.log(loginResponce.status)
    //     console.log("loginResponce.status")
    //     localStorage.setItem("authorization", loginResponce.headers['authorization'])
    // });
    let user = req.session.user;
    res.render('InwardBatch', { title: 'Inventory Management - Batch Inward', locals: res.locals });
}
InwardBatchController.prototype.batchesfindAllbyCreatedbyInward = (req, res) => {
    //  console.log("req.params==============")
    // console.log(req.query)
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
        httpService.get(encodeURI("/batches/count?created_by_d2.digitizationcenter=" + req.session.user.user.digitizationcenter.id + "&batchstatus=" + BatchStatusEnum.batchstatus.Createcommitted + "&deliveryschedule_lt=" + moment().format('YYYY-MM-DD HH:mm:ss')), req.body, function (count) {
            httpService.get(encodeURI("/batchesfindAllbyCreatedby?created_by_d2.digitizationcenter=" + req.session.user.user.digitizationcenter.id + "&batchstatus=" + BatchStatusEnum.batchstatus.Createcommitted + "&deliveryschedule_lt=" + moment().format('YYYY-MM-DD HH:mm:ss') + "&_sort=bundlenumber:ASC&_start=" + start + "&_limit=" + req.query.pagination.perpage), req.body, function (node) {
                var meta = req.query.pagination;
                meta.total = count;
                res.send({ status: true, data: JSON.parse(node), meta: meta });
            })
        })
    } else if (req.params.id == 2) {
        httpService.get(encodeURI("/batches/count?created_by_d2.digitizationcenter=" + req.session.user.user.digitizationcenter.id + "&batchstatus=" + BatchStatusEnum.batchstatus.Createcommitted + "&deliveryschedule_gte=" + moment().format('YYYY-MM-DD HH:mm:ss')), req.body, function (count) {
            httpService.get(encodeURI("/batchesfindAllbyCreatedby?created_by_d2.digitizationcenter=" + req.session.user.user.digitizationcenter.id + "&batchstatus=" + BatchStatusEnum.batchstatus.Createcommitted + "&deliveryschedule_gte=" + moment().format('YYYY-MM-DD HH:mm:ss') + "&_sort=bundlenumber:ASC&_start=" + start + "&_limit=" + req.query.pagination.perpage), req.body, function (node) {
                var meta = req.query.pagination;
                meta.total = count;
                res.send({ status: true, data: JSON.parse(node), meta: meta });
            })
        })
    }
    else if (req.params.id == 3) {
        httpService.get(encodeURI("/batches/count?inwardcommited_by=" + req.session.user.user.id + "&batchstatus_gte=" + BatchStatusEnum.batchstatus.inwardcommited), req.body, function (count) {
            httpService.get(encodeURI("/batchesfindAllbyCreatedby?inwardcommited_by=" + req.session.user.user.id + "&batchstatus_gte=" + BatchStatusEnum.batchstatus.inwardcommited + "&_sort=bundlenumber:ASC&_start=" + start + "&_limit=" + req.query.pagination.perpage), req.body, function (node) {
                var meta = req.query.pagination;
                meta.total = count;
                res.send({ status: true, data: JSON.parse(node), meta: meta });
            })
        })
    }
    else if (req.params.id == 4) {
        httpService.get(encodeURI("/batches/count?inwardcommited_by=" + req.session.user.user.id + "&batchstatus_gte=" + BatchStatusEnum.batchstatus.inwardcommited), req.body, function (count) {
            httpService.get(encodeURI("/batchesfindAllbyCreatedby?inwardcommited_by=" + req.session.user.user.id + "&batchstatus_gte=" + BatchStatusEnum.batchstatus.inwardcommited + "&_sort=bundlenumber:ASC&_start=" + start + "&_limit=" + req.query.pagination.perpage), req.body, function (node) {
                var meta = req.query.pagination;
                meta.total = count;
                res.send({ status: true, data: JSON.parse(node), meta: meta });
            })
        })

    }
}

InwardBatchController.prototype.inwardbatchupdate = (req, res) => {
    let bundlenumber = req.body.bundlenumber;
    console.log("req.body.gapbatch...", req.body.gapbatch);
    if (req.body.gapbatch == 'true') {
        console.log("inside ifffff.....", req.body.gapbatch);
        if (bundlenumber.split("-").length == 4) {
            req.body.bundlenumber = bundlenumber;
        } else {
            req.body.bundlenumber = "INC-" + bundlenumber;
        }

    } else {
        console.log("inside elsessssssssssss.....", bundlenumber.split("-").length);
        if (bundlenumber.split("-").length == 4) {
            bundlenumber = bundlenumber.split("INC-")[1];
            req.body.bundlenumber = bundlenumber;
        } else {
            req.body.bundlenumber = bundlenumber;
        }

    }
    httpService.put("/batches/" + req.params.id, req.body, function (node) {
        res.send({ status: true, data: JSON.parse(node) });
    })
}


InwardBatchController.prototype.editBatchinward = (req, res) => {
    httpService.get("/batches/" + req.params.id, req.body, function (node) {

        var batch = JSON.parse(node);

        res.send({ status: true, data: batch });
    })
}
InwardBatchController.prototype.inwardFIRUpdate = (req, res) => {
    httpService.put("/firs/" + req.params.id, req.body, function (node) {
        res.send({ status: true, data: JSON.parse(node) });
    })

}
InwardBatchController.prototype.isvalidFIRInward = (req, res) => {
    var query = ""
    var yy = req.body.year.toString().slice(2, 4);
    query = "?firregisternumber=" + req.session.batch.bundlenumber.split("-")[1] + "" + yy + req.body.firserialnumber;
    httpService.get("/firs" + query, req.body, function (node) {
        node = JSON.parse(node)
        if (node.length == 0) {
            res.send({ status: true })
        } else {
            res.send({ status: false, data: node[0] })
        }
    })
    // res.send({ status: true});
}
InwardBatchController.prototype.inwardBatchCommit = (req, res) => {
    console.log("************************************");
    console.log(req.body);
    console.log("************************************");
    req.body.batchstatus = BatchStatusEnum.batchstatus.inwardcommited;
    req.body.inwardcommited_at = new Date();
    req.body.inwardcommited_by = req.session.user.user.id;
    req.body.islock = false;
    httpService.put("/batches/" + req.params.id, req.body, function (node1) {
        CIPAService.UpdateexecuteSQL("update firs set imagestatus=0,islock=false where batch=" + req.params.id, function (node) {
            console.log("node=====================")
            res.send({ status: true, data: JSON.parse(node1) })
        });
    })
}
InwardBatchController.prototype.inwardBatchReceive = (req, res) => {
    httpService.get("/batchesfindOnebycreatedby?id=" + req.params.id, req.body, function (node) {

        var batch = JSON.parse(node);

        if (batch.islock) {
            if (batch.inwardcommited_by != null) {
                if (batch.inwardcommited_by.id == req.session.user.user.id) {
                    // console.log( req.session.batch)
                    req.session.batch = { id: batch.id, bundlenumber: batch.bundlenumber };
                    // console.log( req.session.batch)
                    res.send({ status: true, data: batch });
                } else {
                    res.send({ status: false, data: null });
                }
            } else {
                res.send({ status: false, data: null });
            }
        } else {
            req.body.inwardcommited_by = req.session.user.user.id;
            req.body.islock = true;
            req.body.inwardreceive_at = new Date();
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

module.exports = new InwardBatchController();