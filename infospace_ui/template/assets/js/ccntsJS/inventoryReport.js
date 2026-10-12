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

function getpendingBatch() {
    setTimeout(() => {
        pandingDatatable.init();
        // pushtoSrever(null, "/batchesfindAllbyCreatedby.dwf/4", "GET", function (node) {
        //     pandingDatatable.init(node.data);
        // })
    }, 200);
}
var pandingDatatable = function () {
    // Private functions
    var subTableInit = function (e) {
        $('<div/>').attr('id', 'child_data_local_' + e.data.id).appendTo(e.detailCell).KTDatatable({
            data: {
                type: 'local',
                source: e.data.firs,
                pageSize: 5,
            },
            // layout definition
            layout: {
                scroll: true,
                height: 400,
                footer: false,
            },
            sortable: true,
            // columns definition
            columns: [
                {
                    field: 'inwardstatus',
                    title: 'Acceptance Status',
                    template: function (row) {
                        var status = {
                            0: { 'title': 'Pending', 'class': 'bg-warning-o-50  text-warning' },
                            1: { 'title': 'Accepted', 'class': ' text-green' },
                            2: { 'title': 'Rejected', 'class': 'bg-danger-o-50 text-danger' },
                        };
                        return '<span class="label ' + status[row.inwardstatus].class + ' label-inline font-weight-bold label-lg">' + status[row.inwardstatus].title + '</span>';
                    }
                }, {
                    field: 'crn',
                    title: 'CRN',
                }, {
                    field: 'year',
                    title: 'Year',
                }, {
                    field: 'pagecount',
                    title: 'Page Count',
                }, {
                    field: 'firremarks',
                    title: 'Remarks',
                }],
        }).sort("crn", "asc");
    };
    // demo initializer
    var mainTableInit = function (batchdata) {
        var pandingdatatable = $('#kt_datatable').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: '/batchesfindAllbyCreatedby.dwf/4',
                        method: 'GET',
                        // sample custom headers
                        // headers: {'x-my-custom-header': 'some value', 'x-test-header': 'the value'},
                        map: function (raw) {
                            // sample data mapping
                            var dataSet = raw;
                            if (typeof raw.data !== 'undefined') {
                                dataSet = raw.data;
                            }
                            return dataSet;
                        },
                    },
                },
                pageSize: 10,
                serverPaging: true,
                serverFiltering: false,
                serverSorting: false,
                saveState: false,
            },
            // layout definition
            layout: {
                scroll: false,
                height: null,
                footer: false,
                icons: {
                    rowDetail: {
                        expand: 'fa fa-minus',
                        collapse: 'fa fa-plus'
                    }
                }
            },
            sortable: true,
            filterable: false,
            pagination: true,
            detail: {
                title: 'Load sub table',
                content: subTableInit,
            },
            search: {
                input: $('#kt_datatable_search_query'),
                key: 'generalSearch'
            },
            // columns definition
            columns: [{
                field: 'id',
                title: '',
                sortable: false,
                width: 30,
                textAlign: 'center',
            }, {
                field: 'bundlenumber',
                title: 'Batch ID',
                width: 150,
            }, {
                field: 'Total Cases',
                title: 'Total Cases',
                width: 80,
                template: function (row) {
                    return row.firs.length;
                }
            }, {
                field: 'created_at_d2',
                title: 'Creation Date',
                width: 125,
                template: function (row) {
                    return moment(row.created_at_d2).format("DD/MM/YYYY hh:mm A");
                }
            }, {
                field: 'deliveryschedule',
                title: 'Scheduled Delivery date',
                width: 200,
                template: function (row) {
                    return moment.utc(row.deliveryschedule).format("DD/MM/YYYY")
                }
            }, {
                field: 'Action',
                title: 'Select',
                overflow: 'visible',
                autoHide: false,
                width: 100,
                textAlign: 'center',
                template: function (row) {
                    return '<button onclick="addprint(this,' + row.id + ')"  id="print' + row.id + '" class="btn btn-icon btn-light btn-hover-primary btn-sm" title="Generate Report"><i class="flaticon2-print text-dark icon-nm"></i></button>';
                }
            }],
        });
    };
    var eventsCapture = function () {
        $('#kt_datatable').on('datatable-on-layout-updated', function () {

            $('.batchspan').each(function () {
                var id = $(this).attr('value');
                $('#print' + id).attr("disabled", true);
            });
        })
    };
    return {
        // Public functions
        init: function (batchdata) {
            // init dmeo
            mainTableInit(batchdata);
            eventsCapture();
        },
    };
}();
function genrateReport(dom) {
    $(dom).addClass('spinner spinner-white spinner-right');
    var selectedBatchs = [];
    $('.batchspan').each(function () {
        selectedBatchs.push(parseInt($(this).attr('value')));
    });
    if (selectedBatchs.length == 0) {
        $(dom).removeClass('spinner spinner-white spinner-right');
        toastr.error('Select  atleast one batch!');
    } else {
        pushtoSrever({ 'selectedBatches': selectedBatchs }, "/inventoryReportPrint.dwf", "GET", function (node) {
            $(dom).removeClass('spinner spinner-white spinner-right');
            var w = window.open();
            $(w.document.body).html(node.data);
            jQuery(w.document).ready(function () {
                w.print();
                w.close();
            });
        })
    }
}
function resetData() {
    $('.batchspan').each(function () {
        removeBatch(this, $(this).attr('value'));
    });
}
function addprint(domobjec, id) {
    $('#print' + id).attr("disabled", true);
    label = $(domobjec).closest('tr').find('td')[1];
    var html = '<span value="' + id + '" class="batchspan label label-xl label-primary label-inline font-weight-lighter m-2">' + $(label).find('span:first').html() + '<a onclick="removeBatch(this,' + id + ')" href="javascript:;" class="btn btn-icon btn-sm" title="Delete"><i class="flaticon-delete text-white icon-md"></i></a></span>';
    $('#selectedbatch').append(html)
}
function removeBatch(domobjec, id) {
    $('#print' + id).attr("disabled", false)
    $(domobjec).closest('span').remove();
}
jQuery(document).ready(function () {
    getpendingBatch();

});