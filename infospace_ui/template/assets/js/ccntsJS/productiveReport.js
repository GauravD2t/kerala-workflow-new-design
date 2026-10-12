// Class definition
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

function downloadExcle() {
    if ($('#start').val() == "" || $('#end').val() == "") {
        toastr.error("Select vaild date")
    } else {
        var actiontype = parseInt($('#filter').val());
        var pushObject = { start: $('#start').val(), end: $('#end').val(), action: actiontype };
        var fileName = "";
        if (actiontype == 0) {
            fileName = "Scan-Report.xlsx";
        } else if (actiontype == 1) {
            fileName = "ScanQC-Report.xlsx";
        } else if (actiontype == 2) {
            fileName = "Classfication-Report.xlsx";
        } else if (actiontype == 3) {
            fileName = "Verify-Report.xlsx";
        } else if (actiontype == 4) {
            fileName = "CaseRejected-Report.xlsx";
        } else if (actiontype == 5) {
            fileName = "Uploaded-Report.xlsx";
        }

        $.ajax({
            url: '/progressReportAuditreport.dwf',
            cache: false,
            type: 'get',
            data: pushObject,
            xhr: function () {
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 2) {
                        if (xhr.status == 200) {
                            xhr.responseType = "blob";
                        } else {
                            xhr.responseType = "text";
                        }
                    }
                };
                return xhr;
            },
            success: function (data) {
                //Convert the Byte Data to BLOB object.
                var blob = new Blob([data], { type: "application/octetstream" });

                //Check the Browser type and download the File.
                var isIE = false || !!document.documentMode;
                if (isIE) {
                    window.navigator.msSaveBlob(blob, fileName);
                } else {
                    var url = window.URL || window.webkitURL;
                    link = url.createObjectURL(blob);
                    var a = $("<a />");
                    a.attr("download", fileName);
                    a.attr("href", link);
                    $("body").append(a);
                    a[0].click();
                    $("body").remove(a);
                }
            }
        });
    }

}
var KTBootstrapDatepicker = function () {

    var arrows;
    if (KTUtil.isRTL()) {
        arrows = {
            leftArrow: '<i class="la la-angle-right"></i>',
            rightArrow: '<i class="la la-angle-left"></i>'
        }
    } else {
        arrows = {
            leftArrow: '<i class="la la-angle-left"></i>',
            rightArrow: '<i class="la la-angle-right"></i>'
        }
    }

    // Private functions
    var demos = function () {
        // range picker
        $('#kt_datepicker_5').datepicker({
            format: "dd-mm-yyyy",
            rtl: KTUtil.isRTL(),
            todayHighlight: true,
            templates: arrows
        });


    }

    return {
        // public functions
        init: function () {
            demos();
        }
    };
}();

function showdata() {
    var startDate = $('#start').val();
    var enddate = $('#end').val();
    if ($('#start').val() == "" || $('#end').val() == "") {
        toastr.error("Select vaild date")
    } else {
        pushtoSrever(null, "/prductivityfilter.dwf?start=" + startDate + "&end=" + enddate, "GET", function (node) {
            console.log(node.data);
            let trtotal = "";
            $('.datespan').html("Date : " + $('#start').val() + " To " + $('#end').val());
            let reviceTT = 0;
            let reviceTTotal = 0;
            let scanfileTT = 0;
            let scanfileTTotal = 0;
            let scanpageTT = 0;
            let scanpageTTtotal = 0;
            let bookfileTT = 0;
            let bookfileTTotal = 0;
            let bookpageTT = 0;
            let bookpageTTtotal = 0;
            let verifyfileTT = 0;
            let verifyfileTTotal = 0;
            let verifypageTT = 0;
            let verifypageTTtotal = 0;
            let uploadfileTT = 0;
            let uploadfileTTotal = 0;
            let uploadpageTT = 0;
            let uploadpageTTtotal = 0;


            for (let c of node.data) {
                let scan_file = c.scannedfile + " / " + c.scannedpage;
                let scan_filetotal = c.totalscannedfile + " / " + c.totalscannedpage;

                let imageqc_file = c.imageqcfile + " / " + c.imageqcpage;
                let imageqctotal = c.totalimageqcfile + " / " + c.totalimageqcpage;

                let bookmarfile = c.bookmarkfile + " / " + c.bookmarkpaged;
                let totalbookmarfile = c.totalbookmarkfile + " / " + c.totalbookmarkpage;

                let verifyfile = c.verifyfile + " / " + c.verifypages;
                let totalverifyfile = c.totalverifyfile + " / " + c.totalverifypages;

                let uploadfile = c.uploadfile + " / " + c.uploadpages;
                let totaluploadfile = c.totaluploadfile + " / " + c.totaluploadpages;

                let dataentry_file = c.metadatafile + " / " + c.metadatapage;
                let dataentrytotal = c.totalmetadatafile + " / " + c.totalmetadatapage;

                let pdf_file = c.pdffile + " / " + c.pdfpage;
                let pdftotal = c.totalpdffile + " / " + c.totalpdfpage;


                let firstverify_file = c.firstverifyfile + " / " + c.firstverifypage;
                let firstverifytotal = c.totalfirstverifyfile + " / " + c.totalfirstverifypage;
              
                let secondfirstverify_file = c.secondverifyfile + " / " + c.secondverifypage;
                let secondfirstverifytotal = c.totalsecondverifyfile + " / " + c.totalsecondverifypage;

                let thiidfirstverify_file = c.thirdverifyfile + " / " + c.thirdverifypage;
                let thidfirstverifytotal = c.totalthirdverifyfile + " / " + c.totalthirdverifypage;


                if (c.id == 95) {
                    let tr95 = "<tr> <td>Files Received </td><td><b>" + c.filereceived + "</b></td><td><b>" + c.totalfilereceived + "</b></td> </tr> ";
                    tr95 = tr95 + "<tr><td>Files / Images Scanned </td><td><b>" + scan_file + "</b></td><td><b>" + scan_filetotal + "</b></td> </tr>";
                    tr95 = tr95 + "<tr><td>Files / Images QC </td><td><b>" + imageqc_file + "</b></td><td><b>" + imageqctotal + "</b></td> </tr>";
                    tr95 = tr95 + "<tr><td>Files Bookmarked </td><td><b>" + bookmarfile + "</b></td><td><b>" + totalbookmarfile + "</b></td> </tr> ";
                    tr95 = tr95 + "<tr><td>Files Verified</td><td><b>" + verifyfile + "</b></td><td><b>" + totalverifyfile + "</b></td></tr>  ";
                    tr95 = tr95 + "<tr><td>Files Verified</td><td><b>" + verifyfile + "</b></td><td><b>" + totalverifyfile + "</b></td></tr>  ";
                    tr95 = tr95 + "<tr><td>Files uploaded in DMS</td><td><b>" + uploadfile + "</b></td><td><b>" + totaluploadfile + "</b></td>  </tr>";
                    $('#admin95').html(tr95);
                } else if (c.id == 89) {
                    let tr95 = "<tr> <td>Files Received </td><td><b>" + c.filereceived + "</b></td><td><b>" + c.totalfilereceived + "</b></td> </tr> ";
                    tr95 = tr95 + "<tr><td>Files / Images Scanned </td><td><b>" + scan_file + "</b></td><td><b>" + scan_filetotal + "</b></td> </tr>";
                    tr95 = tr95 + "<tr><td>Files / Images QC </td><td><b>" + imageqc_file + "</b></td><td><b>" + imageqctotal + "</b></td> </tr>";
                    tr95 = tr95 + "<tr><td>Files / Data Entry </td><td><b>" + dataentry_file + "</b></td><td><b>" + dataentrytotal + "</b></td> </tr>";
                    tr95 = tr95 + "<tr><td>Files Bookmarked </td><td><b>" + bookmarfile + "</b></td><td><b>" + totalbookmarfile + "</b></td> </tr> ";
                    tr95 = tr95 + "<tr><td>Files / PDF </td><td><b>" + pdf_file + "</b></td><td><b>" + pdftotal + "</b></td> </tr>";
                    tr95 = tr95 + "<tr><td>Files / IM Verification </td><td><b>" + firstverify_file + "</b></td><td><b>" + firstverifytotal + "</b></td> </tr>";
                    tr95 = tr95 + "<tr><td>L1 Verified</td><td><b>" + verifyfile + "</b></td><td><b>" + totalverifyfile + "</b></td></tr>  ";
                    tr95 = tr95 + "<tr><td>L2 Verified</td><td><b>" + secondfirstverify_file + "</b></td><td><b>" + secondfirstverifytotal + "</b></td></tr>  ";
                    tr95 = tr95 + "<tr><td>L3  Verified</td><td><b>" + thiidfirstverify_file + "</b></td><td><b>" + thidfirstverifytotal + "</b></td></tr>  ";
                    tr95 = tr95 + "<tr><td>Files uploaded in DMS</td><td><b>" + uploadfile + "</b></td><td><b>" + totaluploadfile + "</b></td>  </tr>";

                    $('#admin89').html(tr95);
                }
            }




        })
    }
}
function print() {
    var w = window.open();
    var html = '<html><head><style>@page {  margin-left: 0px; margin-right: 0px}@media print {table { page-break-after:auto }tr { page-break-inside:avoid; page-break-after:auto } td{ page-break-inside:avoid; page-break-after:auto }  thead { display:table-header-group }  tfoot { display:table-footer-group }.tdc{width: 50mm;height:20.1mm; padding-bottom: 0px;}.imgcls{width: 48mm;height:16mm;    margin-left: 5px;margin-bottom: 3px;}}.tdc{width: 50mm;height:20.1mm; padding-bottom: 0px;}.imgcls{width: 48mm;height:16mm;    margin-left: 5px;margin-bottom: 3px;}        </style><style>table { border:1px solid black; border-collapse: collapse; width:100%; text-align: center; } table thead tr { border-left: 1px solid #000; border-right: 1px solid #000; border-bottom: 1px solid; } table tbody tr { border-left: 1px solid #000; border-right: 1px solid #000; border-bottom: 1px solid; } table tbody tr td { border-left: 1px solid #000; border-right: 1px solid #000; } table thead tr th { border: 1px solid #000; } .thwidth{ width:5px; }</style><title>Track control Chart</title> </head><body>';
    html = html + $('.printdiv').html() + "</body></html>"
    $(w.document.body).html(html);
    jQuery(w.document).ready(function () {
        w.print();
        w.close();
    });
}

jQuery(document).ready(function () {
    KTBootstrapDatepicker.init();
    // KTDatatableDataLocalDemo.init([]);
    $('#start').val(moment().format("DD-MM-YYYY"));
    $('#end').val(moment().format("DD-MM-YYYY"));
});
