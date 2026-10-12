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


function showdata() {
    var startDate = $('#start').val();
    var enddate = $('#end').val();
    if ($('#start').val() == "" || $('#end').val() == "") {
        toastr.error("Select vaild date")
    } else {
        pushtoSrever(null, "/batchwisereportfilter.dwf?start=" + startDate + "&end=" + enddate, "GET", function (node) {
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
                field: 'createed_date',
                title: 'Date of Creation',
                type: 'date',
                width: 100,
            }, {
                field: 'bundlenumber',
                title: 'Batch number',
                width: 120,
            }, {
                field: 'recivefiles',
                title: 'Received File',
                width: 55,
            }, {
                field: 'scanfiles',
                title: 'Scanned',
                width: 55,
            }, {
                field: 'qcfile',
                title: 'Image QC',
                width: 50,
            }, {
                field: 'firstverifyfile',
                title: 'Verification',
                width: 80,
            }, {
                field: 'dataentryfile',
                title: 'Data Entry',
                width: 50,
            }, {
                field: 'pdffile',
                title: 'PDF',
                width: 50,
            }, {
                field: 'verifyfile',
                title: 'Customer Verification',
                width: 100,
            }, {
                field: 'uploadfile',
                title: 'Uploaded In DMS',
                width: 55,
            }, {
                field: 'pendingprocess',
                title: 'Pending in process',
                width: 55,
            },
            ],
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