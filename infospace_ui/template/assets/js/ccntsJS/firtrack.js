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
        init: function() {
            demos(); 
        }
    };
}();

function showdata(){
    var startDate=$('#start').val();
    var enddate=$('#end').val();
    pushtoSrever(null, "/firreportfilter.dwf?start="+startDate+"&end="+enddate, "GET", function (node) {
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
                placeholder: 'Search FIR'
            },
            columns: [{
                field: 'firregisternumber',
                title: 'FIR Reg number',
                width: 125,
            }, {
                field: 'firserialnumber',
                title: 'FIR Serial Number',
                width: 140,
            }, {
                field: 'year',
                title: 'Year',
                width: 60,
            }, {
                field: 'pagecount',
                title: 'page Count',
                width: 110,
            },{
                field: 'iif1',
                title: 'Forms Included',
                width: 150,
                template: function (row) {
                    var form="";
                    if(row.iif1)
                    form=form+"IFF 1 ";
                    if(row.iif2)
                    form=form+" | IFF 2 ";
                    if(row.iif3)
                    form=form+"| IFF 3 ";
                    if(row.iif4)
                    form=form+"| IFF 4 ";
                    if(row.iif5)
                    form=form+"| IFF 5 ";
                    if(row.iif6)
                    form=form+"| IFF 6 ";
                    if(row.iif7)
                    form=form+"| IFF 7";
                    return form;
                }
            }, {
                field: 'firremarks',
                title: 'Remarks',
                width: 200,
            }, {
                field: 'Actions',
                title: 'Actions',
                sortable: false,
                width: 100,
                overflow: 'visible',
                autoHide: false,
                template: function (row) {
                    return '<a onclick="editMenu(' + row.id + ')"  class="editbtn btn btn-icon btn-light btn-hover-primary btn-sm" title="Edit details"><i class="flaticon-edit text-dark icon-nm"></i></a>\
                              <a onclick="popupdeleteMenu(this,' + row.id + ')" href="javascript:;" class="deletebtn btn btn-icon btn-light btn-hover-primary btn-sm" title="Delete"><i class="flaticon-delete text-danger icon-nm"></i></a>	';
                },
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
jQuery(document).ready(function() {    
    KTBootstrapDatepicker.init();
    KTDatatableDataLocalDemo.init([]);
    $('#start').val(moment().format("DD/MM/YYYY")); 
    $('#end').val(moment().format("DD/MM/YYYY"));
});