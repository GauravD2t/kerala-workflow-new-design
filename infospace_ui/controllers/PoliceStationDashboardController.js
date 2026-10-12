
var httpService = require('../service/httpService.js');
var BatchNoGenrate = require('../util/batchNumberGenrate.js')
var moment = require('moment');
function PoliceStationDashboardController() {
}
PoliceStationDashboardController.prototype.policestationDashboardPage = function (req, res) {
    res.render('policestationDashboard', { title: 'Dashboard', locals: res.locals });
}
PoliceStationDashboardController.prototype.suersetdashbord = function (req, res) {
    res.render('suersetdashbord', { title: 'Dashboard', locals: res.locals });
}
PoliceStationDashboardController.prototype.inwardDashboard = function (req, res) {
    res.render('inwardDashboard', { title: 'Dashboard', locals: res.locals });
}

PoliceStationDashboardController.prototype.inwardDashboardCouter = (req, res) => {
    let user = req.session.user.user;

    //total received
    httpService.get(encodeURI("/batches?inwardcommited_by=" + user.id), req.body, function (node) {
        var data = JSON.parse(node);
        var totlabatch_received = data.length;
        var totalfir_received = 0;
        var totalfir_pendingreceipt = 0;
        var totalbatch_pendingreceipt;
        var totalbatch_returned, totalfir_returned = 0;
        for (var i = 0; i < data.length; i++) {
            totalfir_received = totalfir_received + data[i].firs.length;
        }
        httpService.get(encodeURI("/batches?inwardcommited_by=" + user.id + "&batchstatus_gte=" + BatchStatusEnum.batchstatus.inwardcommited + "&batchstatus_lt=" + BatchStatusEnum.batchstatus.outwardcommited), req.body, function (node2) {
            // return completed
            httpService.get(encodeURI("/batches?inwardcommited_by=" + user.id + "&batchstatus_gte=" + BatchStatusEnum.batchstatus.outwardcommited), req.body, function (node3) {
                var data = JSON.parse(node3);
                totalbatch_returned = data.length;
                for (var i = 0; i < data.length; i++) {
                    totalfir_returned = totalfir_returned + data[i].firs.length;
                }
                httpService.get(encodeURI("/batches?created_by_d2.digitizationcenter=" + user.digitizationcenter.id + "&batchstatus=" + BatchStatusEnum.batchstatus.Createcommitted + "&deliveryschedule_lt=" + moment().format('YYYY-MM-DD HH:mm:ss')), req.body, function (delay_receipt) {
                    httpService.get(encodeURI("/batches?created_by_d2.digitizationcenter=" + user.digitizationcenter.id + "&batchstatus=" + BatchStatusEnum.batchstatus.Createcommitted + "&deliveryschedule_gte=" + moment().format('YYYY-MM-DD HH:mm:ss')), req.body, function (pending_receipt) {
                        res.send({
                            status: true,
                            totlabatch_received: totlabatch_received, totalfir_received: totalfir_received,
                            totalbatch_returned: totalbatch_returned, totalfir_returned: totalfir_returned,
                            delay_receipt: JSON.parse(delay_receipt),
                            pending_receipt: JSON.parse(pending_receipt),
                            due_receipt: JSON.parse(node2),
                            locals: res.locals
                        });
                    })

                })
            });
        });

    })


}
PoliceStationDashboardController.prototype.batch = (req, res) => {
    httpService.get("/batches", "", function (node) {
        res.send({ status: true, data: JSON.parse(node) });
    })
}

PoliceStationDashboardController.prototype.dashboradcounter = (req, res) => {
    let user = req.session.user.user;
    httpService.get(encodeURI("/batches?created_by_d2=" + user.id + "&batchstatus_gte=" + BatchStatusEnum.batchstatus.Createcommitted + "&_limit=-1"), req.body, function (node) {
        var data = JSON.parse(node);
        var totalfircreate = 0;
        var totlacreatebatch = data.length;

        var totlareceivedbatch;
        var totalfirreceived = 0;
        for (var i = 0; i < data.length; i++) {
            totalfircreate = totalfircreate + data[i].firs.length;
        }
        httpService.get(encodeURI("/batches?created_by_d2=" + user.id + "&batchstatus_gte=" + BatchStatusEnum.batchstatus.inwardcommited + "&batchstatus_lt=" + BatchStatusEnum.batchstatus.receivecommited + "&_limit=-1"), req.body, function (node1) {
            httpService.get(encodeURI("/batches?created_by_d2=" + user.id + "&batchstatus=" + BatchStatusEnum.batchstatus.receivecommited + "&_limit=-1"), req.body, function (nod2) {
                var data = JSON.parse(nod2);
                totlareceivedbatch = data.length;
                for (var i = 0; i < data.length; i++) {
                    totalfirreceived = totalfirreceived + data[i].firs.length;
                }
                httpService.get(encodeURI("/batches?created_by_d2=" + user.id + "&batchstatus=" + BatchStatusEnum.batchstatus.Createcommitted + "&deliveryschedule_lt=" + moment().format('YYYY-MM-DD HH:mm:ss') + "&_limit=-1"), req.body, function (node) {
                    httpService.get(encodeURI("/batches?created_by_d2=" + user.id + "&batchstatus=" + BatchStatusEnum.batchstatus.Createcommitted + "&deliveryschedule_gte=" + moment().format('YYYY-MM-DD HH:mm:ss') + "&_limit=-1"), req.body, function (pendingdelivery) {
                        res.send({
                            status: true,
                            totlacreatebatch: totlacreatebatch, totalfircreate: totalfircreate,
                            totlareceivedbatch: totlareceivedbatch, totalfirreceived: totalfirreceived,
                            delivery_delayed: JSON.parse(node),
                            Due_Delivery: JSON.parse(pendingdelivery),
                            due_receipt: JSON.parse(node1),
                            locals: res.locals
                        });
                    })

                })
            });

        });
    })


}
PoliceStationDashboardController.prototype.delete = (req, res) => {
    httpService.delete("/batches/" + req.params.id, "", function (node) {
        res.send({ status: true, data: JSON.parse(node) });
    })
    // res.send({ status: true});
}
PoliceStationDashboardController.prototype.edit = (req, res) => {
    httpService.get("/batches/" + req.params.id, "", function (node) {
        res.send({ status: true, data: JSON.parse(node) });
    })
    // res.send({ status: true});
}

PoliceStationDashboardController.prototype.batchUpdateStatus = (req, res) => {
    httpService.get("/findbatchstatusesByindex/" + req.params.status, req.body, function (node) {
        if (node != null) {
            var batchstatus = JSON.parse(node)
            req.body.batchstatus = batchstatus.id;
            httpService.put("/batches/" + req.params.id, req.body, function (node1) {
                res.send({ status: true, data: JSON.parse(node1) });
            })
        } else {

        }
    });
}
module.exports = new PoliceStationDashboardController();