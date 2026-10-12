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
function getPerfromance(id, node) {

  $('#inwardbatchesPR' + id).html(node.totalinwardbatch + " Batches")
  $('#inwardfirsPR' + id).html(node.totalfirinward + " Cases")

  $('#fileatchesPR' + id).html(node.totalfiletagbatch + " Batches")
  $('#filefirsPR' + id).html(node.totalfirfiletag + " Cases")

  $('#scanningbatchesPR' + id).html(node.totalscaningbatch + " Batches")
  $('#scanningfirsPR' + id).html(node.totalfirscaning + " Cases")

  $('#qcbatchesPR' + id).html(node.totalscanqcbatch + " Batches")
  $('#qcfirsPR' + id).html(node.totalfirscanqc + " Cases")

  $('#qabatchesPR' + id).html(node.totalqarejectbatch + " Batches")
  $('#qafirsPR' + id).html(node.totalfirqareject + " Cases")

  $('#outwardbatchesPR' + id).html(node.totaloutwradbatch + " Batches")
  $('#outwardfirsPR' + id).html(node.totalfiroutward + " Cases")

  $('#returnbatchesPR' + id).html(node.totalreceivebatch + " Batches")
  $('#returnfirsPR' + id).html(node.totalfirreceived + " Cases")

  var workhigh = '<i class="icon-2x fas fa-caret-up" style="color:#4CAF50"></i> <h7  style="color:#4CAF50">  #data % Cases</h7>';
  var worklow = '<i class="icon-2x fas fa-caret-down text-danger" ></i> <h7 class="text-danger"> #data % Cases</h7>'
  if (node.totalfirscaning_ != null) {
    if (node.totalfirscaning_ > 0) {
      $('#percentage_scanning' + id).html(workhigh.replace("#data", parseInt(node.totalfirscaning_)));
    } else {
      var totalfirscaning_ = node.totalfirscaning_ * -1;
      $('#percentage_scanning' + id).html(worklow.replace("#data", parseInt(totalfirscaning_)));
    }
  } else {
    $('#percentage_scanning' + id).html("");
  }
  // totalfirscanqc_=((totalfirscanqc-totalfirscanqc_)*100)/totalfirscanqc_;
  if (node.totalfirscanqc_ != null) {
    if (node.totalfirscanqc_ > 0) {
      $('#percentage_qc' + id).html(workhigh.replace("#data", parseInt(node.totalfirscanqc_)));
    } else {
      var totalfirscanqc_ = node.totalfirscanqc_ * -1;
      $('#percentage_qc' + id).html(worklow.replace("#data", parseInt(totalfirscanqc_)));
    }
  } else {
    $('#percentage_qc' + id).html("");
  }
  // totalfirqareject_=((totalfirqareject-totalfirqareject_)*100)/totalfirqareject_;
  if (node.totalfirqareject_ != null) {
    if (node.totalfirqareject_ > 0) {
      $('#percentage_qa' + id).html(workhigh.replace("#data", parseInt(node.totalfirqareject_)));
    } else {
      var totalfirqareject_ = node.totalfirqareject_ * -1;
      $('#percentage_qa' + id).html(worklow.replace("#data", parseInt(totalfirqareject_)));
    }
  } else {
    $('#percentage_qa' + id).html("");
  }
  // totalfiroutward_=((totalfiroutward-totalfiroutward_)*100)/totalfiroutward_;
  if (node.totalfiroutward_ != null) {
    if (node.totalfiroutward_ > 0) {
      $('#percentage_outward' + id).html(workhigh.replace("#data", parseInt(node.totalfiroutward_)));
    } else {
      var totalfiroutward_ = node.totalfiroutward_ * -1;
      $('#percentage_outward' + id).html(worklow.replace("#data", parseInt(totalfiroutward_)));
    }
  } else {
    $('#percentage_outward' + id).html("");
  }
  // totalfirreceived_=((totalfirreceived-totalfiroutward_)*100)/totalfirreceived_;
  if (node.totalfirreceived_ != null) {
    if (node.totalfirreceived_ > 0) {
      $('#percentage_return' + id).html(workhigh.replace("#data", parseInt(node.totalfirreceived_)));
    } else {
      var totalfirreceived_ = node.totalfirreceived_ * -1;
      $('#percentage_return' + id).html(worklow.replace("#data", parseInt(totalfirreceived_)));
    }
  } else {
    $('#percentage_return' + id).html("");
  }
  if (node.totalfirinward_ != null) {
    if (node.totalfirinward_ > 0) {
      $('#percentage_inward' + id).html(workhigh.replace("#data", parseInt(node.totalfirinward_)));
    } else {
      var totalfirinward_ = node.totalfirinward_ * -1;
      $('#percentage_inward' + id).html(worklow.replace("#data", parseInt(totalfirinward_)));
    }
  } else {
    $('#percentage_inward' + id).html("");
  }

  if (node.totalfirfiletag_ != null) {
    if (node.totalfirfiletag_ > 0) {
      $('#percentage_file' + id).html(workhigh.replace("#data", parseInt(node.totalfirfiletag_)));
    } else {
      var totalfirfiletag_ = node.totalfirfiletag_ * -1;
      $('#percentage_file' + id).html(worklow.replace("#data", parseInt(totalfirfiletag_)));
    }
  } else {
    $('#percentage_file' + id).html("");
  }

}

function getReplotcompletd(dom) {
  pushtoSrever({ 'id': $(dom).attr('selectcenter') }, "/progressReportSupperadmin.dwf/" + $(dom).val(), "GET", function (node1) {
    getPerfromance(node1.id, node1);
  })
}

function previewData(node, text) {
  console.log(node)
  var samplehtml = $('#samplereport').html();
  samplehtml = samplehtml.replace('#DIGIID', node.id).replace("#centername", text)
    .replace("#selectreport", node.id).replaceAll("#centeridPR", node.id);
  $('#appendRepot').append(samplehtml);

  $('#inwardbatches' + node.id).html(node.totalinwardbatch + " Batches | ")
  $('#inwardfirs' + node.id).html(node.totalfirinward + " Cases")
  $('#filebatch' + node.id).html(node.totalfiletagbatch + " Batches | ")
  $('#filefirs' + node.id).html(node.totalfirfiletag + " Cases")

  $('#allotmentbatches' + node.id).html(node.totalscaningbatch + " Batches | ")
  $('#allotmentfirs' + node.id).html(node.totalfirscaning + " Cases")

  $('#scanbatches' + node.id).html(node.totalscanqcbatch + " Batches | ")
  $('#scanfirs' + node.id).html(node.totalfirscanqc + " Cases")

  $('#qabatches' + node.id).html(node.totalqarejectbatch + " Batches | ")
  $('#qafirs' + node.id).html(node.totalfirqareject + " Cases")
  $('#outwardbatches' + node.id).html(node.totaloutwradbatch + " Batches | ")
  $('#outwardfirs' + node.id).html(node.totalfiroutward + " Cases")
  $('#deliverybatches' + node.id).html(node.totalreceivebatch + " Batches | ")
  $('#deliveryfirs' + node.id).html(node.totalfirreceived + " Cases")

  pushtoSrever({ 'id': node.id }, "/progressReportSupperadmin.dwf/1", "GET", function (node1) {
    getPerfromance(node.id, node1);
  })
}
function getdigitalUser(id, text) {
  pushtoSrever({ 'id': id }, "/admincounter.dwf", "GET", function (node) {
    previewData(node, text)
  })

}
var selectdigital = null;
var centername = "";

/*
jQuery(document).ready(function () {
    pushtoSrever(null, "/getAllUser.dwf?type=1", "GET", function (node) {
        for (var i = 0; i < node.data.length; i++) {
            if (i == 0) {
                selectdigital = node.data[i].id;
                centername = node.data[i].name;
                $('#digitaluser').append("<option selected value='" + node.data[i].id + "'>" + node.data[i].name + "</option>");
            } else {
                $('#digitaluser').append("<option value='" + node.data[i].id + "'>" + node.data[i].name + "</option>");
            }

        }
        $('#digitaluser').select2({
            placeholder: 'Select a Digitization Center',
        });
        $('#digitaluser').on("select2:unselecting", function (e) {
            $('#row' + e.params.args.data.id).remove();
        })

        $("#digitaluser").on("select2:select", function (e) {
            getdigitalUser(e.params.data.id, e.params.data.text);

        });
        if (selectdigital != null) {
            pushtoSrever({ 'id': selectdigital }, "/admincounter.dwf", "GET", function (node) {
                previewData(node, centername)
            });
        }

    })


    // getPerfromance(1);
});

*/