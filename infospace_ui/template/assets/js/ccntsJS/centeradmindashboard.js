

function pushtoSrever(pushObject, url, method, callback) {
  $.ajax({
    async: true,
    type: method,
    dataType: 'json',
    url: url,
    data: pushObject,
    success: function (response) {
      //toastr.success('Data InserteId Successfully!');                
      callback(response);
    },
    error: function (response) {
      //toastr.error('Problem in Deleting Data!');
      console.log("error")
      callback(response)
    }
  });
}


function getPerfromance(id) {
  pushtoSrever(null, "/progressReportadmin.dwf/" + id, "GET", function (node) {


    $('#inwardbatchesPR').html(node.totalinwardbatch + " Batches")
    $('#inwardfirsPR').html(node.totalfirinward + " Cases")

    $('#fileatchesPR').html(node.totalfiletagbatch + " Batches")
    $('#filefirsPR').html(node.totalfirfiletag + " Cases")

    $('#scanningbatchesPR').html(node.totalscaningbatch + " Batches")
    $('#scanningfirsPR').html(node.totalfirscaning + " Cases")

    $('#qcbatchesPR').html(node.totalscanqcbatch + " Batches")
    $('#qcfirsPR').html(node.totalfirscanqc + " Cases")

    $('#qabatchesPR').html(node.totalqarejectbatch + " Batches")
    $('#qafirsPR').html(node.totalfirqareject + " Cases")

    $('#outwardbatchesPR').html(node.totaloutwradbatch + " Batches")
    $('#outwardfirsPR').html(node.totalfiroutward + " Cases")

    $('#returnbatchesPR').html(node.totalreceivebatch + " Batches")
    $('#returnfirsPR').html(node.totalfirreceived + " Cases")

    var workhigh = '<i class="icon-2x fas fa-caret-up" style="color:#4CAF50"></i> <h7  style="color:#4CAF50">  #data % Cases</h7>';
    var worklow = '<i class="icon-2x fas fa-caret-down text-danger" ></i> <h7 class="text-danger"> #data % Cases</h7>'
    if (node.totalfirscaning_ != null) {
      if (node.totalfirscaning_ > 0) {
        $('#percentage_scanning').html(workhigh.replace("#data", parseInt(node.totalfirscaning_)));
      } else {
        var totalfirscaning_ = node.totalfirscaning_ * -1;
        $('#percentage_scanning').html(worklow.replace("#data", parseInt(totalfirscaning_)));
      }
    } else {
      $('#percentage_scanning').html("");
    }
    // totalfirscanqc_=((totalfirscanqc-totalfirscanqc_)*100)/totalfirscanqc_;
    if (node.totalfirscanqc_ != null) {
      if (node.totalfirscanqc_ > 0) {
        $('#percentage_qc').html(workhigh.replace("#data", parseInt(node.totalfirscanqc_)));
      } else {
        var totalfirscanqc_ = node.totalfirscanqc_ * -1;
        $('#percentage_qc').html(worklow.replace("#data", parseInt(totalfirscanqc_)));
      }
    } else {
      $('#percentage_qc').html("");
    }
    // totalfirqareject_=((totalfirqareject-totalfirqareject_)*100)/totalfirqareject_;
    if (node.totalfirqareject_ != null) {
      if (node.totalfirqareject_ > 0) {
        $('#percentage_qa').html(workhigh.replace("#data", parseInt(node.totalfirqareject_)));
      } else {
        var totalfirqareject_ = node.totalfirqareject_ * -1;
        $('#percentage_qa').html(worklow.replace("#data", parseInt(totalfirqareject_)));
      }
    } else {
      $('#percentage_qa').html("");
    }
    // totalfiroutward_=((totalfiroutward-totalfiroutward_)*100)/totalfiroutward_;
    if (node.totalfiroutward_ != null) {
      if (node.totalfiroutward_ > 0) {
        $('#percentage_outward').html(workhigh.replace("#data", parseInt(node.totalfiroutward_)));
      } else {
        var totalfiroutward_ = node.totalfiroutward_ * -1;
        $('#percentage_outward').html(worklow.replace("#data", parseInt(totalfiroutward_)));
      }
    } else {
      $('#percentage_outward').html("");
    }
    // totalfirreceived_=((totalfirreceived-totalfiroutward_)*100)/totalfirreceived_;
    if (node.totalfirreceived_ != null) {
      if (node.totalfirreceived_ > 0) {
        $('#percentage_return').html(workhigh.replace("#data", parseInt(node.totalfirreceived_)));
      } else {
        var totalfirreceived_ = node.totalfirreceived_ * -1;
        $('#percentage_return').html(worklow.replace("#data", parseInt(totalfirreceived_)));
      }
    } else {
      $('#percentage_return').html("");
    }
    if (node.totalfirinward_ != null) {
      if (node.totalfirinward_ > 0) {
        $('#percentage_inward').html(workhigh.replace("#data", parseInt(node.totalfirinward_)));
      } else {
        var totalfirinward_ = node.totalfirinward_ * -1;
        $('#percentage_inward').html(worklow.replace("#data", parseInt(totalfirinward_)));
      }
    } else {
      $('#percentage_inward').html("");
    }

    if (node.totalfirfiletag_ != null) {
      if (node.totalfirfiletag_ > 0) {
        $('#percentage_file').html(workhigh.replace("#data", parseInt(node.totalfirfiletag_)));
      } else {
        var totalfirfiletag_ = node.totalfirfiletag_ * -1;
        $('#percentage_file').html(worklow.replace("#data", parseInt(totalfirfiletag_)));
      }
    } else {
      $('#percentage_file').html("");
    }


  });

}

jQuery(document).ready(function () {

  pushtoSrever(null, "/centeradmincounter.dwf", "GET", function (node) {
    console.log(node.data)
    data = node.data[0];
    $('#inwardbatches').html(data.pendingforinward + " Files  ");

    $('#scanbatch').html(data.pendingforscanning + " Files  ");
    $('#qcbatch').html(data.pendingforqc + " Files  ");
    $('#classbatch').html(data.pendingforclassfication + " Files  ");
    $('#verifybatch').html(data.pendingforverify + " Files  ");
    $('#uploadbatch').html(data.pendingforupload + " Files  ");
    $('#pdfbatch').html(data.pendingforpdf + " Files  ");





    // $('#inwardfirs').html(node.totalfirinward +" Cases")
    // $('#filebatch').html(node.totalfiletagbatch+" Batches | ")
    // $('#filefirs').html(node.totalfirfiletag+" Cases")

    // $('#allotmentbatches').html(node.totalscaningbatch+" Batches | ")
    // $('#allotmentfirs').html(node.totalfirscaning+" Cases")

    // $('#scanbatches').html(node.totalscanqcbatch+" Batches | ")
    // $('#scanfirs').html(node.totalfirscanqc+" Cases")

    // $('#qabatches').html(node.totalqarejectbatch+" Batches | ")
    // $('#qafirs').html(node.totalfirqareject+" Cases")
    // $('#outwardbatches').html(node.totaloutwradbatch+" Batches | ")
    // $('#outwardfirs').html(node.totalfiroutward+" Cases")
    // $('#deliverybatches').html(node.totalreceivebatch+" Batches | ")
    // $('#deliveryfirs').html(node.totalfirreceived+" Cases")


  });
  // getPerfromance(1);
});
