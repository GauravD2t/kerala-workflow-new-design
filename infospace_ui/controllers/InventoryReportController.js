var httpService = require('../service/httpService.js')
var BatchNoGenrate = require('../util/batchNumberGenrate.js')
var moment = require('moment');
const { createCanvas } = require('canvas');
var JsBarcode = require('jsbarcode');
const canvas = createCanvas(242, 128);
function InventoryReportController() {
}

InventoryReportController.prototype.inventoryReportdPage = function (req, res) {
  res.render('inventoryReport', { title: 'Batch Management – Inventory Report Generation', locals: res.locals });
}
InventoryReportController.prototype.barcodereportPage = function (req, res) {
  res.render('barcodereport', { title: 'Inventory Management – Barcode Generation', locals: res.locals });
}


InventoryReportController.prototype.inventoryReportPrint = function (req, res) {
  var query = "?"
  var selectedbatch = req.query.selectedBatches;
  for (var i = 0; i < selectedbatch.length; i++) {
    if (i != selectedbatch.length - 1) {
      query = query + "id_in=" + parseInt(selectedbatch[i]) + "&";
    } else {
      query = query + "id_in=" + parseInt(selectedbatch[i]) + "&_sort=id:ASC";
    }
  }
  console.log(query)
  var html = "";
  httpService.get("/batches" + query, req.body, function (node) {
    // var StateName=req.session.user.user.policestation.district.state.state;
    // var policestationname=req.session.user.user.policestation.ps;
    // var districenname=req.session.user.user.policestation.district.district;
    var data = JSON.parse(node);

    html = '<html><head><style>thead {display: table-header-group;}</style><title>Inventory Sheet</title> </head><body><h3 style="text-align: center;" >Inventory Sheet </h3>';

    for (var i = 0; i < data.length; i++) {
      var dilievrydate = moment.utc(data[i].deliveryschedule).format("DD/MM/YYYY")
      html = html + '<hr style="width:850px;margin-left:auto;margin-right:auto;border: 1px solid;color: black;display: block;height: 2px;margin: 0.5em auto;border-right: none;border-left: none;"/><table style=" border-collapse: collapse;width:500px;border:0px solid;margin-left:auto;margin-top:10px;margin-right:auto"><tr>' +
        '<td><p style="font-size: 16px;font-weight: bold;">Bundle / Batch No </p></td><td ><p style="font-size: 16px;font-weight: bold;text-align: center">Total Case in Bundle / Batch</p></td>' +
        '<td><p style="font-size: 16px;font-weight: bold;text-align: right"> Batch Delivery Date</p></td></tr>' +
        '<tr><td><p style="margin-left:10px;font-size: 13px;margin-top: 6px">' + data[i].bundlenumber + '</p></td>' +
        '<td><p  style="margin-right:10px;font-size: 13px;text-align: center;margin-top: 6px" >' + data[i].firs.length + '</p></td>' +
        '<td><p  style="margin-right:10px;font-size: 13px;text-align: center;margin-top: 6px" >' + dilievrydate + '</p></td></tr></table>' +
        '<hr style="width:850px;margin-left:auto;margin-right:auto;border: 1px solid;color: black;display: block;height: 2px;margin: 0.5em auto;border-right: none;border-left: none;"/>';

      html = html + '<table style=" border-collapse: collapse;width:850px;border:0px solid;margin-left:auto;margin-top:10px;margin-right:auto">' +
        ' <thead><tr style="border-top:1px solid"><td > <p style="font-size: 13px;font-weight: bold;margin-left:10px"> CNR</p></td>' +
        ' <td > <p style="font-size: 13px;font-weight: bold;text-align: center">Case Type/Case No/Year</p></td>' +
        ' <td><p style="font-size: 13px;font-weight: bold;text-align: center">Page Count</p></td>' +
        ' <td> <p style="font-size: 13px;font-weight: bold;text-align: center">Accept/Reject</p></td>' +
        '<td><p style="font-size: 13px;font-weight: bold;text-align: center">Remarks</p></td></tr> </thead><tbody>';
      ;
      data[i].firs.sort(GetSortOrder("id"));
      for (var j = 0; j < data[i].firs.length; j++) {

        html = html + '<tr style="border-top:1px solid"><td ><p style="font-size: 13px;margin: 10px;">' + data[i].firs[j].crn + '</p> </td>' +
          ' <td ><p style="font-size: 13px;text-align: center;margin: 10px;">' + data[i].firs[j].casetype + '/' + data[i].firs[j].caseno + '/' + data[i].firs[j].year + '</p></td>' +
          '<td> <p style="font-size: 13px; bold;text-align: center;margin: 10px;">' + data[i].firs[j].pagecount + '</p></td>' +
          '<td><p style="font-size: 13px;text-align: center;margin: 10px;"></p></td>' +
          '<td><p style="font-size: 13px;text-align: center;margin: 10px;">' + data[i].firs[j].remarks + '</p></td></tr>';

      }
      html = html + '</tbody> </table>';
    }
    html = html + '<table style=" border-collapse: collapse;width:850px;border:0px solid;margin-left:auto;margin-top:40px;margin-right:auto">' +
      ' <tr style="border-top:1px solid"><td > <p style="font-size: 13px;font-weight: bold;"> Batch Handover Date	</p></td>' +
      '<td > <p style="font-size: 13px;font-weight: bold;text-align: right"> Batch Receiving Date</p></td></tr>' +
      '<tr><td > <p style="font-size: 13px;font-weight: bold;margin-top: 34px;"> Batch Handover by	</p></td>' +
      '<td > <p style="font-size: 13px;font-weight: bold;text-align: right;margin-top: 34px;"> Batch Received by</p></td></tr></table>';
    html = html + '</body></html>';

    res.send({ status: true, data: html });

  })

  // res.render('inventoryReport', { title: 'Batch Management – Inventory Report Generation',locals:res.locals});
}

InventoryReportController.prototype.barcodeReportPrint = function (req, res) {
  var query = "?"
  var selectedbatch = req.query.selectedBatches;
  for (var i = 0; i < selectedbatch.length; i++) {
    if (i != selectedbatch.length - 1) {
      query = query + "id_in=" + parseInt(selectedbatch[i]) + "&";
    } else {
      query = query + "id_in=" + parseInt(selectedbatch[i]) + "&_sort=id:ASC";
    }
  }
  console.log(query)
  var html = "";
  httpService.get("/batches" + query, req.body, function (node) {

    var data = JSON.parse(node);

    //  html=html+'<html><body><h3 style="text-align: center;" >Barcode Sheet </h3><h5 style="text-align: center;margin-top: 31px">Data Digitization and Migration for Crime and Criminal Tracking Network & Systems (CCTNS) Project, '+StateName+'</h6>'+
    //           '<div > <table style=" border-collapse: collapse;width:500px;border:0px solid;margin-left:auto;margin-top:25px;margin-right:auto">'+
    //           '<tr><td ><p style="font-size: 16px;font-weight: bold;"> District / SP Office</p></td><td style="font-size: 16px;font-weight: bold;">'+
    //           '<p style="font-size: 16px;font-weight: bold;text-align: right"> Police Station</p></td></tr><tr><td> <p style="margin-left:10px;font-size: 13px;">'+districenname+'</p>'+
    //           '</td><td><p  style="margin-right:10px;font-size: 13px;text-align: right">'+policestationname+'</p></td></tr></table></div>'+
    //           '<hr style="width:650px;margin-left:auto;margin-right:auto;border: 1px solid;color: black;display: block;height: 2px;margin: 0.5em auto;border-right: none;border-left: none;"/>';
    html = html + '<html><head><style>@page {margin-top: 10px;margin-bottom: 0px;  margin-left: 0px; margin-right: 0px } @page :first { margin-top: 0px;margin-bottom: 0px;  margin-left: 0px; margin-right: 0px}@media print {table { page-break-after:auto }tr { page-break-inside:avoid; page-break-after:auto } td{ page-break-inside:avoid; page-break-after:auto }  thead { display:table-header-group }  tfoot { display:table-footer-group }.tdc{width: 50mm;height:20.1mm; padding-bottom: 0px;}.imgcls{width: 48mm;height:16mm;    margin-left: 5px;margin-bottom: 3px;}}.tdc{width: 50mm;height:20.1mm; padding-bottom: 0px;}.imgcls{width: 48mm;height:16mm;    margin-left: 5px;margin-bottom: 3px;}        </style><title>Barcode Sheet</title> </head><body><table style="border:0px solid;margin-left:auto;margin-right:auto">' +
      // html=html+'<html><head><style>.tdc{width: 50mm;height:20.1mm; padding-bottom: 0px;}.imgcls{width: 48mm;height:16mm;    margin-left: 5px;margin-bottom: 3px;}</style><title>Barcode Sheet</title> </head><body><table style="border:0px solid;margin-left:auto;margin-right:auto">'+
      '<tbody>';
    var counter = 0;
    var flag = 1;
    var firconter = 0;
    for (var i = 0; i < data.length; i++) {
      data[i].firs.sort(GetSortOrder("id"));
      // 
      for (var j = 0; j < data[i].firs.length; j++) {
        if (flag == 1) {
          flag = 2;
          html = html + '<tr>';
        }

        // html=html+'<td > <svg class="barcode" jsbarcode-value="'+data[i].firs[j].firregisternumber+'"> </td>'
        if (counter < 4) {
          const canvas = createCanvas(189, 75);
          JsBarcode(canvas, data[i].firs[j].crn);
          // JsBarcode(canvas, "27542039000001");

          html = html + '<td class="tdc"  ><img  class="imgcls" src="' + canvas.toDataURL('image/png', 1.0) + ' "/></td>';
          counter++;
        } else {
          flag = 2;
          counter = 0;
          const canvas = createCanvas(189, 75);
          JsBarcode(canvas, data[i].firs[j].crn);
          // JsBarcode(canvas, "27542039000001");


          html = html + '</tr><tr><td class="tdc" ><img   class="imgcls" src="' + canvas.toDataURL('image/png', 1.0) + ' "/></td>';
          counter++;
        }


      }
    }
    if (flag != 1) {
      html = html + '</tr>';
    }
    html = html + '</tbody></table></body></html>';
    //  console.log(html)
    res.send({ status: true, data: html });
  })

  // res.render('inventoryReport', { title: 'Batch Management – Inventory Report Generation',locals:res.locals});
}
function GetSortOrder(prop) {
  return function (a, b) {
    if (a[prop] > b[prop]) {
      return 1;
    } else if (a[prop] < b[prop]) {
      return -1;
    }
    return 0;
  }
}

module.exports = new InventoryReportController();