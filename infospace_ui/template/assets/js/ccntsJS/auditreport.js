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
function downloadUserwiseDate() {


    if ($('#start').val() == "" || $('#end').val() == "") {
        toastr.error("Select vaild date")
    } else {
        var actiontype = parseInt($('#filter').val());
        var pushObject = { start: $('#start').val(), end: $('#end').val(), action: actiontype };
        var fileName = "";
        if (actiontype == 0) {
            fileName = "userWise-Scan-Report.xlsx";
        } else if (actiontype == 1) {
            fileName = "userWise-ScanQC-Report.xlsx";
        }
        else if (actiontype == 6) {
            fileName = "userWise-DataEntry-Report.xlsx";
        }
        else if (actiontype == 7) {
            fileName = "userWise-PDF-Report.xlsx";
        }
        else if (actiontype == 8) {
            fileName = "userWise-IM-Report.xlsx";
        }
        else if (actiontype == 2) {
            fileName = "userWise-Classfication-Report.xlsx";
        } else if (actiontype == 3) {
            fileName = "userWise-L!-Verify-Report.xlsx";
        } else if (actiontype == 4) {
            fileName = "userWise-L1-VerifyCaseRejected-Report.xlsx";
        } else if (actiontype == 5) {
            fileName = "userWise-Uploaded-Report.xlsx";
        } else if (actiontype == 9) {
            fileName = "userWise-L2-Verify-Report.xlsx";
        } else if (actiontype == 10) {
            fileName = "userWise-L2-CaseRejected-Report.xlsx";
        } else if (actiontype == 11) {
            fileName = "userWise-L3-Verify-Report.xlsx";
        } else if (actiontype == 12) {
            fileName = "userWise-L3-CaseRejected-Report.xlsx";
        } 

        $.ajax({
            url: '/progressReportByUSerWiseExcel.dwf',
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
        } else if (actiontype == 6) {
            fileName = "DataEntry-Report.xlsx";
        }
        else if (actiontype == 7) {
            fileName = "PDF-Report.xlsx";
        }
        else if (actiontype == 8) {
            fileName = "IM-Report.xlsx";
        }
        else if (actiontype == 2) {
            fileName = "Classfication-Report.xlsx";
        } else if (actiontype == 3) {
            fileName = "L1-Verify-Report.xlsx";
        } else if (actiontype == 4) {
            fileName = "L1-CaseRejected-Report.xlsx";
        } else if (actiontype == 5) {
            fileName = "Uploaded-Report.xlsx";
        } else if (actiontype == 9) {
            fileName = "L2-Verify-Report.xlsx";
        } else if (actiontype == 10) {
            fileName = "L2-Verify-CaseRejected-Report.xlsx";
        } else if (actiontype == 11) {
            fileName = "L3-Verify-Report.xlsx";
        } else if (actiontype == 12) {
            fileName = "L3-Verify-CaseRejected-Report.xlsx";
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
            format: "dd/mm/yyyy",
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
        pushtoSrever(null, "/auditreportfilter.dwf?start=" + startDate + "&end=" + enddate + "&action=" + $('#filter').val(), "GET", function (node) {
            datatable.destroy();
            KTDatatableDataLocalDemo._rendareTable(node.data);
        })
    }
}
var datatable;
var KTDatatableDataLocalDemo = function () {
    var rendareTable = function (dataJSONArray) {
        datatable = $('#kt_datatable').KTDatatable({
            data: {
                type: 'local',
                source: dataJSONArray,
                pageSize: 10,
            },
            layout: {
                scroll: true, // enable/disable datatable scroll both horizontal and vertical when needed.              
                height: 450,
                footer: false, // display/hide footer
            },
            sortable: true,
            pagination: true,
            search: {
                input: $('#kt_datatable_search_query'),
                key: 'generalSearch',
                placeholder: 'Search data'

            },
            columns: [{
                field: 'casetype',
                title: 'Case number',
                width: 140,

            }, {
                field: 'bundlenumber',
                title: 'Bundle number',
                width: 140,

            }, {
                field: 'username',
                title: 'User Name',
                width: 100,

            }, {
                field: 'pagecount',
                title: 'page Count',
                width: 110,
            }, {
                field: 'scancommited_at',
                title: 'Date',
                width: 140,
                type: 'date'

            }],
        })
        //KTDatatableDataLocalDemo=datatable
    }
    return {
        init: function (data) {
            rendareTable(data);
        },
        _rendareTable: function (data) {
            rendareTable(data);
        }
    };
}();
jQuery(document).ready(function () {

    KTBootstrapDatepicker.init();
    KTDatatableDataLocalDemo.init([]);
    $('#start').val(moment().format("DD/MM/YYYY"));
    $('#end').val(moment().format("DD/MM/YYYY"));
});