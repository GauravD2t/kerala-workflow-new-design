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

var datatable=null;
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
            columns: [
                {
                    field: 'bundlenumber',
                    title: 'Bundle number',
                    width: 140,

                },{
                    field: 'case_full',
                title: 'Case number',
                width: 140,

                }, {
                    field: 'pdfpagecount',
                    title: 'Pages',       
                }, {
                field: 'mode',
                title:'Mode',
                width: 110,
            }, {
                    field: 'verifydate',
                    title: 'Date',
                    template: function (row) { 
                        return row.verifydate ? moment(row.verifydate).format("DD/MM/YYYY HH:mm") : '';
                    },
                    width: 140,
              

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

function showData() {
    var startDate = $('#start').val();
    var enddate = $('#end').val();
    if ($('#start').val() == "" || $('#end').val() == "") {
        toastr.error("Select vaild date")
    } else {
        pushtoSrever(null, "/ownworkingreport.dwf?start=" + startDate + "&end=" + enddate  , "GET", function (node) {
            if (datatable != null) {
                datatable.destroy();
            }
                // Destroy the previous datatable instance  
            
            KTDatatableDataLocalDemo._rendareTable(node.data);
        })
    }
}

function downloadExcel() {
   
    if ($('#start').val() == "" || $('#end').val() == "") {
        toastr.error("Select vaild date")
    } else {

        var pushObject = { start: $('#start').val(), end: $('#end').val() };
        var fileName = "ownReport.xlsx";
        $.ajax({
            url: '/ownworkingreportdownload.dwf',
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

jQuery(document).ready(function () {
    KTBootstrapDatepicker.init();
    
    $('#start').val(moment().format("DD/MM/YYYY"));
    $('#end').val(moment().format("DD/MM/YYYY"));
    showData();
   
});