
var httpService = require('../service/httpService.js');
var CIPAService = require("../service/CIPAService");
var moment = require('moment');
function CenterAdminDashboardcontroller() {
}
CenterAdminDashboardcontroller.prototype.centeradminDashboard = function (req, res) {
    res.render('centeradmindashboard', { title: 'Dashboard - Center Admin', locals: res.locals });
}
CenterAdminDashboardcontroller.prototype.superAdminDashboard = function (req, res) {
    res.render('superAdminDashboard', { title: 'Dashboard -  Admin', locals: res.locals });
}

CenterAdminDashboardcontroller.prototype.centeradmincounter = function (req, res) {
    let user = req.session.user.user;

    let query = "select COALESCE(sum(case when (f.imagestatus=-1 and b.batchstatus=1 ) then 1 else 0 end),0) AS pendingforinward,COALESCE(sum(case when (f.imagestatus=0 and b.batchstatus=2) then 1 else 0 end),0) AS pendingforscanning,COALESCE(sum(case when (f.imagestatus=1  ) then 1 else 0 end),0) AS pendingforqc,COALESCE(sum(case when (f.imagestatus=2 ) then 1 else 0 end),0) AS pendingforclassfication,COALESCE(sum(case when (f.imagestatus=3 ) then 1 else 0 end),0) AS pendingforpdf,COALESCE(sum(case when (f.imagestatus=5 ) then 1 else 0 end),0) AS pendingforVerify,COALESCE(sum(case when (f.imagestatus=6 and isupload=false  ) then 1 else 0 end),0) AS pendingforupload from firs f join batches b on b.id=f.batch join 'users-permissions_user' u on u.id=b.created_by_d2 where u.digitizationcenter=" + user.id
    query = query.replace(/'users/g, '"users');
    query = query.replace(/user'/g, 'user"');
    CIPAService.executeSQL(query, function (batchdata) {
        var resdata = batchdata[0];
        // res.send({ status: true, data: resultbat });

        res.send({ status: true, data: resdata });
    })
    //    var totalinwardbatch=0;
    //    var totalfirinward=0;
    //    var totalfiletagbatch=0;
    //    var totalfirfiletag=0;
    //    var totalscaningbatch=0;
    //    var totalfirscaning=0;
    //    var totalscanqcbatch=0;
    //    var totalfirscanqc=0;
    //    var totalqarejectbatch=0;
    //    var totalfirqareject=0;
    //    var totaloutwradbatch=0;
    //    var totalfiroutward=0;
    //    var totalreceivebatch=0; 
    //    var totalfirreceived=0;

    //     httpService.get(encodeURI("/batches?created_by_d2.digitizationcenter=" + user.id+"&batchstatus_gte="+BatchStatusEnum.batchstatus.Createcommitted+"&batchstatus_lt="+BatchStatusEnum.batchstatus.receivecommited+"&_limit=-1"), req.body, function (node) {
    //         var data=JSON.parse(node);
    //         for(var i=0;i<data.length;i++){
    //             var batch=data[i];
    //             if(batch.batchstatus==BatchStatusEnum.batchstatus.Createcommitted){
    //                 totalinwardbatch++;
    //                 totalfirinward=totalfirinward+batch.firs.length;
    //             }else if(batch.batchstatus==BatchStatusEnum.batchstatus.inwardcommited){
    //                 totalfiletagbatch++;
    //                 totalfirfiletag=totalfirfiletag+batch.firs.length;
    //             }else if(batch.batchstatus==BatchStatusEnum.batchstatus.inwardcommited){
    //                 console.log("=======ALLOACTED===="+batch.id)
    //                 totalscaningbatch++;
    //                 totalfirscaning=totalfirscaning+batch.firs.length;
    //             }else if(batch.batchstatus==BatchStatusEnum.batchstatus.scanningcommited){
    //                 //console.log("==========="+batch.id)

    //                 totalscanqcbatch++;
    //                 totalfirscanqc=totalfirscanqc+batch.firs.length;
    //             }else if(batch.batchstatus==BatchStatusEnum.batchstatus.Qccommited){
    //                 totalqarejectbatch++;
    //                 totalfirqareject=totalfirqareject+batch.firs.length;
    //             }else if(batch.batchstatus==BatchStatusEnum.batchstatus.QArejectCommit){
    //                 totaloutwradbatch++;
    //                 totalfiroutward=totalfiroutward+batch.firs.length;
    //             }else if(batch.batchstatus==BatchStatusEnum.batchstatus.outwardcommited){
    //                 totalreceivebatch++;
    //                 totalfirreceived=totalfirreceived+batch.firs.length;
    //             }
    //         }

    //         res.send({
    //             status: true,
    //             totalinwardbatch: totalinwardbatch, totalfirinward: totalfirinward,
    //             totalfiletagbatch: totalfiletagbatch, totalfirfiletag: totalfirfiletag,
    //             totalscaningbatch: totalscaningbatch,totalfirscaning:totalfirscaning,
    //             totalscanqcbatch: totalscanqcbatch,totalfirscanqc:totalfirscanqc,
    //             totalqarejectbatch: totalqarejectbatch,totalfirqareject:totalfirqareject,
    //             totaloutwradbatch: totaloutwradbatch, totalfiroutward: totalfiroutward,
    //             totalreceivebatch: totalreceivebatch, totalfirreceived: totalfirreceived,

    //         });
    //     })
}

CenterAdminDashboardcontroller.prototype.progressReportadmin = function (req, res) {
    let user = req.session.user.user;
    var start_date;
    var from_date;
    var prverwee_to;
    var pervious_from;

    if (req.params.id == 1) {
        start_date = moment().format('YYYY-MM-DD HH:mm:ss')
        from_date = moment().startOf('week').format('YYYY-MM-DD HH:mm:ss');
        prverwee_to = moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD HH:mm:ss');
        pervious_from = moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD HH:mm:ss');
    } else {
        start_date = moment().format('YYYY-MM-DD HH:mm:ss')
        from_date = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
        prverwee_to = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD HH:mm:ss');
        pervious_from = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD HH:mm:ss');
    }

    // console.log("from_date:"+from_date)
    // console.log("pervious_from:"+pervious_from)
    // console.log("prverwee_to:"+prverwee_to)
    // console.log("start_date::"+start_date)
    var totalinwardbatch = 0;
    var totalfirinward = 0;
    var totalfiletagbatch = 0;
    var totalfirfiletag = 0;
    var totalscaningbatch = 0;
    var totalfirscaning = 0;
    var totalscanqcbatch = 0;
    var totalfirscanqc = 0;
    var totalqarejectbatch = 0;
    var totalfirqareject = 0;
    var totaloutwradbatch = 0;
    var totalfiroutward = 0;
    var totalreceivebatch = 0;
    var totalfirreceived = 0;

    httpService.get(encodeURI("/batches?created_by_d2.digitizationcenter=" + user.id + "&batchstatus_gte=" + BatchStatusEnum.batchstatus.Createcommitted + "&created_at_d2_lte=" + start_date + "&created_at_d2_gte=" + from_date + "&_limit=-1"), req.body, function (currentweek) {
        var data = JSON.parse(currentweek);
        console.log("Current Week Data===" + data.length)
        for (var i = 0; i < data.length; i++) {
            var batch = data[i];
            console.log("Current Week Data===" + batch.id)
            //     console.log("===========")
            //    console.log(moment(batch.inwardcommited_at).format('YYYY-MM-DD HH:mm:ss')<=start_date);
            //    console.log(moment(batch.inwardcommited_at).format('YYYY-MM-DD HH:mm:ss'))
            //    console.log("===========")
            if (batch.inwardcommited_at != null && moment(batch.inwardcommited_at).format('YYYY-MM-DD HH:mm:ss') <= start_date && moment(batch.inwardcommited_at).format('YYYY-MM-DD HH:mm:ss') >= from_date) {
                totalinwardbatch++;
                totalfirinward = totalfirinward + batch.firs.length;
            } if (batch.filetagcommitted_at != null && moment(batch.filetagcommitted_at).format('YYYY-MM-DD HH:mm:ss') <= start_date && moment(batch.filetagcommitted_at).format('YYYY-MM-DD HH:mm:ss') >= from_date) {
                totalfiletagbatch++;
                totalfirfiletag = totalfirfiletag + batch.firs.length;
            } if (batch.scanningcommited_at != null && moment(batch.scanningcommited_at).format('YYYY-MM-DD HH:mm:ss') <= start_date && moment(batch.scanningcommited_at).format('YYYY-MM-DD HH:mm:ss') >= from_date) {
                totalscaningbatch++;
                totalfirscaning = totalfirscaning + batch.firs.length;
            } if (batch.qccommited_at != null && moment(batch.qccommited_at).format('YYYY-MM-DD HH:mm:ss') <= start_date && moment(batch.qccommited_at).format('YYYY-MM-DD HH:mm:ss') >= from_date) {
                totalscanqcbatch++;
                totalfirscanqc = totalfirscanqc + batch.firs.length;
            } if (batch.outwardcommited_at != null && moment(batch.outwardcommited_at).format('YYYY-MM-DD HH:mm:ss') <= start_date && moment(batch.outwardcommited_at).format('YYYY-MM-DD HH:mm:ss') >= from_date) {
                totaloutwradbatch++;
                totalfiroutward = totalfiroutward + batch.firs.length;
            } if (batch.receivecommited_at != null && moment(batch.receivecommited_at).format('YYYY-MM-DD HH:mm:ss') <= start_date && moment(batch.receivecommited_at).format('YYYY-MM-DD HH:mm:ss') >= from_date) {
                totaloutwradbatch++;
                totalfiroutward = totalfiroutward + batch.firs.length;
            }
        }
        httpService.get(encodeURI("/batches?created_by_d2.digitizationcenter=" + user.id + "&batchstatus_gte=" + BatchStatusEnum.batchstatus.Createcommitted + "&created_at_d2_gte=" + pervious_from + "&created_at_d2_lte=" + prverwee_to), req.body, function (inwardbatch) {
            var data1 = JSON.parse(inwardbatch);
            //  console.log("Pervious Week Data"+data1.length)
            var totalfirinward_ = 0;
            var totalfirfiletag_ = 0;
            var totalfirscaning_ = 0;
            var totalfirscanqc_ = 0;
            var totalfirqareject_ = 0;
            var totalfiroutward_ = 0;
            var totalfirreceived_ = 0;

            for (var i = 0; i < data1.length; i++) {
                var batch = data1[i];

                if (batch.inwardcommited_at != null && moment(batch.inwardcommited_at).format('YYYY-MM-DD HH:mm:ss') >= pervious_from && moment(batch.inwardcommited_at).format('YYYY-MM-DD HH:mm:ss') <= prverwee_to) {

                    totalfirinward_ = totalfirinward_ + batch.firs.length;
                } if (batch.filetagcommitted_at != null && moment(batch.filetagcommitted_at).format('YYYY-MM-DD HH:mm:ss') >= pervious_from && moment(batch.filetagcommitted_at).format('YYYY-MM-DD HH:mm:ss') <= prverwee_to) {

                    totalfirfiletag_ = totalfirfiletag_ + batch.firs.length;
                } if (batch.scanningcommited_at != null && moment(batch.scanningcommited_at).format('YYYY-MM-DD HH:mm:ss') >= pervious_from && moment(batch.scanningcommited_at).format('YYYY-MM-DD HH:mm:ss') <= prverwee_to) {

                    totalfirscaning_ = totalfirscaning_ + batch.firs.length;
                } if (batch.qccommited_at != null && moment(batch.qccommited_at).format('YYYY-MM-DD HH:mm:ss') >= pervious_from && moment(batch.qccommited_at).format('YYYY-MM-DD HH:mm:ss') <= prverwee_to) {

                    totalfirscanqc_ = totalfirscanqc_ + batch.firs.length;
                } if (batch.outwardcommited_at != null && moment(batch.outwardcommited_at).format('YYYY-MM-DD HH:mm:ss') >= pervious_from && moment(batch.outwardcommited_at).format('YYYY-MM-DD HH:mm:ss') <= prverwee_to) {

                    totalfiroutward_ = totalfiroutward_ + batch.firs.length;
                } if (batch.receivecommited_at != null && moment(batch.receivecommited_at).format('YYYY-MM-DD HH:mm:ss') >= pervious_from && moment(batch.receivecommited_at).format('YYYY-MM-DD HH:mm:ss') <= prverwee_to) {

                    totalfirreceived_ = totalfirreceived_ + batch.firs.length;
                }
            }

            totalfirinward_ = ((totalfirinward - totalfirinward_) * 100) / totalfirinward_;
            //  console.log("totalfirfiletag_::"+totalfirfiletag_+" totalfirfiletag::"+totalfirfiletag);
            totalfirfiletag_ = ((totalfirfiletag - totalfirfiletag_) * 100) / totalfirfiletag_;
            // console.log("totalfirfiletag_::"+totalfirfiletag_);
            totalfirscaning_ = ((totalfirscaning - totalfirscaning_) * 100) / totalfirscaning_;
            totalfirscanqc_ = ((totalfirscanqc - totalfirscanqc_) * 100) / totalfirscanqc_;
            totalfirqareject_ = ((totalfirqareject - totalfirqareject_) * 100) / totalfirqareject_;
            totalfiroutward_ = ((totalfiroutward - totalfiroutward_) * 100) / totalfiroutward_;
            totalfirreceived_ = ((totalfirreceived - totalfiroutward_) * 100) / totalfirreceived_;
            res.send({
                status: true,
                totalinwardbatch: totalinwardbatch, totalfirinward: totalfirinward,
                totalfiletagbatch: totalfiletagbatch, totalfirfiletag: totalfirfiletag,
                totalscaningbatch: totalscaningbatch, totalfirscaning: totalfirscaning,
                totalscanqcbatch: totalscanqcbatch, totalfirscanqc: totalfirscanqc,
                totalqarejectbatch: totalqarejectbatch, totalfirqareject: totalfirqareject,
                totaloutwradbatch: totaloutwradbatch, totalfiroutward: totalfiroutward,
                totalreceivebatch: totalreceivebatch, totalfirreceived: totalfirreceived,
                totalfirinward_: totalfirinward_,
                totalfirfiletag_: totalfirfiletag_,
                totalfirscaning_: totalfirscaning_,
                totalfirscanqc_: totalfirscanqc_,
                totalfirqareject_: totalfirqareject_,
                totalfiroutward_: totalfiroutward_,
                totalfirreceived_: totalfirreceived_,

            });



        })
    })



}

CenterAdminDashboardcontroller.prototype.admincounter = function (req, res) {
    console.log("req.query.id" + req.query.id)
    var totalinwardbatch = 0;
    var totalfirinward = 0;
    var totalfiletagbatch = 0;
    var totalfirfiletag = 0;
    var totalscaningbatch = 0;
    var totalfirscaning = 0;
    var totalscanqcbatch = 0;
    var totalfirscanqc = 0;
    var totalqarejectbatch = 0;
    var totalfirqareject = 0;
    var totaloutwradbatch = 0;
    var totalfiroutward = 0;
    var totalreceivebatch = 0;
    var totalfirreceived = 0;

    httpService.get(encodeURI("/batches?created_by_d2.digitizationcenter=" + req.query.id + "&batchstatus_gte=" + BatchStatusEnum.batchstatus.Createcommitted + "&batchstatus_lt=" + BatchStatusEnum.batchstatus.receivecommited + "&_limit=-1"), req.body, function (node) {
        var data = JSON.parse(node);
        for (var i = 0; i < data.length; i++) {
            var batch = data[i];
            if (batch.batchstatus == BatchStatusEnum.batchstatus.Createcommitted) {
                totalinwardbatch++;
                totalfirinward = totalfirinward + batch.firs.length;
            } else if (batch.batchstatus == BatchStatusEnum.batchstatus.inwardcommited) {
                totalfiletagbatch++;
                totalfirfiletag = totalfirfiletag + batch.firs.length;
            } else if (batch.batchstatus == BatchStatusEnum.batchstatus.inwardcommited) {
                totalscaningbatch++;
                totalfirscaning = totalfirscaning + batch.firs.length;
            } else if (batch.batchstatus == BatchStatusEnum.batchstatus.scanningcommited) {
                totalscanqcbatch++;
                totalfirscanqc = totalfirscanqc + batch.firs.length;
            } else if (batch.batchstatus == BatchStatusEnum.batchstatus.Qccommited) {
                totalqarejectbatch++;
                totalfirqareject = totalfirqareject + batch.firs.length;
            } else if (batch.batchstatus == BatchStatusEnum.batchstatus.QArejectCommit) {
                totaloutwradbatch++;
                totalfiroutward = totalfiroutward + batch.firs.length;
            } else if (batch.batchstatus == BatchStatusEnum.batchstatus.outwardcommited) {
                totalreceivebatch++;
                totalfirreceived = totalfirreceived + batch.firs.length;
            }
        }

        res.send({
            status: true,
            id: req.query.id,
            totalinwardbatch: totalinwardbatch, totalfirinward: totalfirinward,
            totalfiletagbatch: totalfiletagbatch, totalfirfiletag: totalfirfiletag,
            totalscaningbatch: totalscaningbatch, totalfirscaning: totalfirscaning,
            totalscanqcbatch: totalscanqcbatch, totalfirscanqc: totalfirscanqc,
            totalqarejectbatch: totalqarejectbatch, totalfirqareject: totalfirqareject,
            totaloutwradbatch: totaloutwradbatch, totalfiroutward: totalfiroutward,
            totalreceivebatch: totalreceivebatch, totalfirreceived: totalfirreceived,

        });
    })


}
CenterAdminDashboardcontroller.prototype.progressReportSupperadmin = function (req, res) {
    console.log("req.query.id" + req.query.id)

    var start_date;
    var from_date;
    var prverwee_to;
    var pervious_from;

    if (req.params.type == 1) {
        start_date = moment().format('YYYY-MM-DD HH:mm:ss')
        from_date = moment().startOf('week').format('YYYY-MM-DD HH:mm:ss');
        prverwee_to = moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD HH:mm:ss');
        pervious_from = moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD HH:mm:ss');
    } else {
        start_date = moment().format('YYYY-MM-DD HH:mm:ss')
        from_date = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
        prverwee_to = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD HH:mm:ss');
        pervious_from = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD HH:mm:ss');
    }

    console.log("from_date:" + from_date)
    console.log("pervious_from:" + pervious_from)
    console.log("prverwee_to:" + prverwee_to)
    console.log("start_date::" + start_date)
    var totalinwardbatch = 0;
    var totalfirinward = 0;
    var totalfiletagbatch = 0;
    var totalfirfiletag = 0;
    var totalscaningbatch = 0;
    var totalfirscaning = 0;
    var totalscanqcbatch = 0;
    var totalfirscanqc = 0;
    var totalqarejectbatch = 0;
    var totalfirqareject = 0;
    var totaloutwradbatch = 0;
    var totalfiroutward = 0;
    var totalreceivebatch = 0;
    var totalfirreceived = 0;

    httpService.get(encodeURI("/batches?created_by_d2.digitizationcenter=" + req.query.id + "&batchstatus_gte=" + BatchStatusEnum.batchstatus.Createcommitted + "&created_at_d2_lte=" + start_date + "&created_at_d2_gte=" + from_date + "&_limit=-1"), req.body, function (currentweek) {
        var data = JSON.parse(currentweek);
        // console.log("Current Week Data==="+data.length)
        for (var i = 0; i < data.length; i++) {
            var batch = data[i];
            //     console.log("===========")
            //    console.log(moment(batch.inwardcommited_at).format('YYYY-MM-DD HH:mm:ss')<=start_date);
            //    console.log(moment(batch.inwardcommited_at).format('YYYY-MM-DD HH:mm:ss'))
            //    console.log("===========")
            if (batch.inwardcommited_at != null && moment(batch.inwardcommited_at).format('YYYY-MM-DD HH:mm:ss') <= start_date && moment(batch.inwardcommited_at).format('YYYY-MM-DD HH:mm:ss') >= from_date) {
                totalinwardbatch++;
                totalfirinward = totalfirinward + batch.firs.length;
            } if (batch.filetagcommitted_at != null && moment(batch.filetagcommitted_at).format('YYYY-MM-DD HH:mm:ss') <= start_date && moment(batch.filetagcommitted_at).format('YYYY-MM-DD HH:mm:ss') >= from_date) {
                totalfiletagbatch++;
                totalfirfiletag = totalfirfiletag + batch.firs.length;
            } if (batch.scanningcommited_at != null && moment(batch.scanningcommited_at).format('YYYY-MM-DD HH:mm:ss') <= start_date && moment(batch.scanningcommited_at).format('YYYY-MM-DD HH:mm:ss') >= from_date) {
                totalscaningbatch++;
                totalfirscaning = totalfirscaning + batch.firs.length;
            } if (batch.qccommited_at != null && moment(batch.qccommited_at).format('YYYY-MM-DD HH:mm:ss') <= start_date && moment(batch.qccommited_at).format('YYYY-MM-DD HH:mm:ss') >= from_date) {
                totalscanqcbatch++;
                totalfirscanqc = totalfirscanqc + batch.firs.length;
            } if (batch.outwardcommited_at != null && moment(batch.outwardcommited_at).format('YYYY-MM-DD HH:mm:ss') <= start_date && moment(batch.outwardcommited_at).format('YYYY-MM-DD HH:mm:ss') >= from_date) {
                totaloutwradbatch++;
                totalfiroutward = totalfiroutward + batch.firs.length;
            } if (batch.receivecommited_at != null && moment(batch.receivecommited_at).format('YYYY-MM-DD HH:mm:ss') <= start_date && moment(batch.receivecommited_at).format('YYYY-MM-DD HH:mm:ss') >= from_date) {
                totaloutwradbatch++;
                totalfiroutward = totalfiroutward + batch.firs.length;
            }
        }
        httpService.get(encodeURI("/batches?created_by_d2.digitizationcenter=" + req.query.id + "&batchstatus_gte=" + BatchStatusEnum.batchstatus.Createcommitted + "&created_at_d2_gte=" + pervious_from + "&created_at_d2_lte=" + prverwee_to + "&_limit=-1"), req.body, function (inwardbatch) {
            var data1 = JSON.parse(inwardbatch);
            //  console.log("Pervious Week Data"+data1.length)
            var totalfirinward_ = 0;
            var totalfirfiletag_ = 0;
            var totalfirscaning_ = 0;
            var totalfirscanqc_ = 0;
            var totalfirqareject_ = 0;
            var totalfiroutward_ = 0;
            var totalfirreceived_ = 0;

            for (var i = 0; i < data1.length; i++) {
                var batch = data1[i];

                if (batch.inwardcommited_at != null && moment(batch.inwardcommited_at).format('YYYY-MM-DD HH:mm:ss') >= pervious_from && moment(batch.inwardcommited_at).format('YYYY-MM-DD HH:mm:ss') <= prverwee_to) {

                    totalfirinward_ = totalfirinward_ + batch.firs.length;
                } if (batch.filetagcommitted_at != null && moment(batch.filetagcommitted_at).format('YYYY-MM-DD HH:mm:ss') >= pervious_from && moment(batch.filetagcommitted_at).format('YYYY-MM-DD HH:mm:ss') <= prverwee_to) {

                    totalfirfiletag_ = totalfirfiletag_ + batch.firs.length;
                } if (batch.scanningcommited_at != null && moment(batch.scanningcommited_at).format('YYYY-MM-DD HH:mm:ss') >= pervious_from && moment(batch.scanningcommited_at).format('YYYY-MM-DD HH:mm:ss') <= prverwee_to) {

                    totalfirscaning_ = totalfirscaning_ + batch.firs.length;
                } if (batch.qccommited_at != null && moment(batch.qccommited_at).format('YYYY-MM-DD HH:mm:ss') >= pervious_from && moment(batch.qccommited_at).format('YYYY-MM-DD HH:mm:ss') <= prverwee_to) {

                    totalfirscanqc_ = totalfirscanqc_ + batch.firs.length;
                } if (batch.outwardcommited_at != null && moment(batch.outwardcommited_at).format('YYYY-MM-DD HH:mm:ss') >= pervious_from && moment(batch.outwardcommited_at).format('YYYY-MM-DD HH:mm:ss') <= prverwee_to) {

                    totalfiroutward_ = totalfiroutward_ + batch.firs.length;
                } if (batch.receivecommited_at != null && moment(batch.receivecommited_at).format('YYYY-MM-DD HH:mm:ss') >= pervious_from && moment(batch.receivecommited_at).format('YYYY-MM-DD HH:mm:ss') <= prverwee_to) {

                    totalfirreceived_ = totalfirreceived_ + batch.firs.length;
                }
            }

            totalfirinward_ = ((totalfirinward - totalfirinward_) * 100) / totalfirinward_;
            // console.log("totalfirfiletag_::"+totalfirfiletag_+" totalfirfiletag::"+totalfirfiletag);
            totalfirfiletag_ = ((totalfirfiletag - totalfirfiletag_) * 100) / totalfirfiletag_;
            // console.log("totalfirfiletag_::"+totalfirfiletag_);
            totalfirscaning_ = ((totalfirscaning - totalfirscaning_) * 100) / totalfirscaning_;
            totalfirscanqc_ = ((totalfirscanqc - totalfirscanqc_) * 100) / totalfirscanqc_;
            totalfirqareject_ = ((totalfirqareject - totalfirqareject_) * 100) / totalfirqareject_;
            totalfiroutward_ = ((totalfiroutward - totalfiroutward_) * 100) / totalfiroutward_;
            totalfirreceived_ = ((totalfirreceived - totalfiroutward_) * 100) / totalfirreceived_;
            res.send({
                status: true,
                id: req.query.id,
                totalinwardbatch: totalinwardbatch, totalfirinward: totalfirinward,
                totalfiletagbatch: totalfiletagbatch, totalfirfiletag: totalfirfiletag,
                totalscaningbatch: totalscaningbatch, totalfirscaning: totalfirscaning,
                totalscanqcbatch: totalscanqcbatch, totalfirscanqc: totalfirscanqc,
                totalqarejectbatch: totalqarejectbatch, totalfirqareject: totalfirqareject,
                totaloutwradbatch: totaloutwradbatch, totalfiroutward: totalfiroutward,
                totalreceivebatch: totalreceivebatch, totalfirreceived: totalfirreceived,
                totalfirinward_: totalfirinward_,
                totalfirfiletag_: totalfirfiletag_,
                totalfirscaning_: totalfirscaning_,
                totalfirscanqc_: totalfirscanqc_,
                totalfirqareject_: totalfirqareject_,
                totalfiroutward_: totalfiroutward_,
                totalfirreceived_: totalfirreceived_,

            });



        })
    })


}



module.exports = new CenterAdminDashboardcontroller();