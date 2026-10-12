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

    var actiontype = parseInt($('#filter').val());
    var pushObject = { action: actiontype };
    var fileName = "";
    if (actiontype == 0) {
        fileName = "Scan-Report-Pending.xlsx";
    } else if (actiontype == 1) {
        fileName = "ScanQC-Report-Pending.xlsx";
    } else if (actiontype == 6) {
        fileName = "Data-Entry-Report-Pending.xlsx";
    } else if (actiontype == 7) {
        fileName = "First-IM-Pending.xlsx";
    }

    else if (actiontype == 2) {
        fileName = "Classfication-Report-Pending.xlsx";
    } else if (actiontype == 3) {
        fileName = "PDF-Report-Pending.xlsx";
    } else if (actiontype == 4) {
        fileName = "L1-Report-Pending.xlsx";
    } else if (actiontype == 5) {
        fileName = "Uploaded-Report-Pending.xlsx";
    } else if (actiontype == 8) {
        fileName = "L2-Report-Pending.xlsx";
    } else if (actiontype == 9) {
        fileName = "L3-Report-Pending.xlsx";
    } 
    else {
        fileName = "Pending-report.xlsx";
    }

    $.ajax({
        url: '/PEndingprogressReportAuditreport.dwf',
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


function showdata() {
    pushtoSrever(null, "/pendingauditreportfilter.dwf?action=" + $('#filter').val(), "GET", function (node) {
        datatable.destroy();
        KTDatatableDataLocalDemo._rendareTable(node.data);
    })

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
                field: 'pagecount',
                title: 'page Count',
                width: 110,
            }, {
                field: 'scancommited_at',
                title: 'Date',
                width: 110,
                template: function (row) {
                    return moment.utc(row.scancommited_at).format("DD/MM/YYYY hh:mm A")
                }
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
    // KTBootstrapDatepicker.init();
    KTDatatableDataLocalDemo.init([]);

});