var pandingdatatable, receiveddatatablekt, delayeddatatable, datatable;
var statusdelivr = 0, statusdelay = 0; statuspendding = 0;
function getdeliveryBatch() {
    if (statusdelivr == 0) {
        statusdelivr = 1;
        setTimeout(() => {
            ReceivedDatatable.init();
            // pushtoSrever(null, "/batchesfindAllbyCreatedbyInward.dwf/3", "GET", function (node) {
            //     ReceivedDatatable.init(node.data);
            // })
        }, 200);
    }
} function getdelayedBatch() {
    if (statusdelay == 0) {
        statusdelay = 1;
        setTimeout(() => {
            DelayedReceiptDatatable.init();
            // pushtoSrever(null, "/batchesfindAllbyCreatedbyInward.dwf/1", "GET", function (node) {
            //     DelayedReceiptDatatable.init(node.data);
            // })
        }, 200);
    }
}

function getpendingBatch() {
    if (statuspendding == 0) {
        statuspendding = 1;
        setTimeout(() => {
            PandingReceiptDatatable.init();
            // pushtoSrever(null, "/batchesfindAllbyCreatedbyInward.dwf/2", "GET", function (node) {
            //     PandingReceiptDatatable.init(node.data);
            // })
        }, 200);
    }
}

var ReceivedDatatable = function () {
    // Private functions
    var subTableInit = function (e) {
        var local = e.data;
        $('<div/>').attr('id', 'child_data_local_' + e.data.id).appendTo(e.detailCell).KTDatatable({
            data: {
                type: 'local',
                source: e.data.firs,

            },
            // layout definition
            layout: {
                scroll: true,
                height: 400,
                footer: false,
            },
            sortable: false,
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
                    title: 'CNR',
                }, {
                    field: 'year',
                    title: 'CaseNo',
                    template: function (row) {
                        return row.casetype + "_" + row.caseno + "_" + row.year;
                    }
                }, {
                    field: 'firinwardremarks',
                    title: "Digitization Team's remarks",

                    template: function (row) {
                        var remarks = row.firinwardremarks != null ? row.firinwardremarks : "";
                        var tagremarks = row.tagremarks != null ? row.tagremarks : "";
                        var outwordremks = row.outwardremarks != null ? row.outwardremarks : "";
                        if (outwordremks == "" && tagremarks == "") {
                            return remarks;
                        } else {
                            if (tagremarks != "") {
                                tagremarks = tagremarks + " . <strong>" + moment.utc(local.filetagcommitted_at).format("DD/MM/YYYY HH:mm") + " " + local.filetagcommitted_by.name + "</strong>" + "<div class='separator separator-dashed mt-8 mb-5'></div>";
                            }
                            if (outwordremks != "") {
                                outwordremks = outwordremks + " . <strong>" + moment.utc(local.outwardcommited_at).format("DD/MM/YYYY HH:mm") + " " + local.outwardcommited_by.name + "</strong>" + "<div class='separator separator-dashed mt-8 mb-5'></div>";
                            }
                            var remarksfinal = tagremarks + " " + outwordremks;
                            return remarks + '&nbsp <a type="button" class="btn" data-container="body" data-toggle="popover" data-original-title="Remarks" data-html="true" data-placement="left" data-content="' + remarksfinal + '" onmouseover="popover(this)"  onmouseout="remocepopover(this)"><i class="icon-md fas fa-exclamation"></i> </a>';

                        }
                    }

                }],
        }).sort("crn", "asc");;
    };
    // demo initializer
    var mainTableInitreceive = function (batchdata) {
        receiveddatatablekt = $('#kt_datatable_received').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: '/batchesfindAllbyCreatedbyInward.dwf/3',
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
                serverSorting: true,
                saveState: false,
            },


            // layout definition
            layout: {
                scroll: true,
                height: null,
                footer: false,
                icons: {
                    rowDetail: {
                        expand: 'fa fa-minus',
                        collapse: 'fa fa-plus'
                    }
                }
            },
            sortable: false,
            filterable: false,
            pagination: true,
            detail: {
                title: 'Load sub table',
                content: subTableInit,
            },
            //   search: {
            //       input: $('#kt_datatable_search_query_pending'),
            //       key: 'generalSearch'
            //   },
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
                field: 'Total cases',
                title: 'Total cases',
                sortable: false,
                template: function (row) {
                    return row.firs.length;
                }
            }, {
                field: 'created_by_d2',
                title: 'Created by',

                template: function (row) {
                    return row.created_by_d2.name
                }
            }, {
                field: 'deliveryschedule',
                title: 'Scheduled Delivery date',

                template: function (row) {
                    return moment.utc(row.deliveryschedule).format("DD/MM/YYYY")
                }
            }, {
                field: 'inwardcommited_at',
                title: 'Actual Delivery Date',

                template: function (row) {
                    return moment.utc(row.inwardcommited_at).format("DD/MM/YYYY")
                }
            }, {
                field: 'batchstatus',
                title: 'Current Status',

                template: function (row) {
                    if (row.batchstatus == 1) {
                        return '<span class="label bg-o-50  text-dark label-inline font-weight-bold label-lg">Inward</span>';
                    } else if (row.batchstatus == 2) {
                        return '<span class="label bg-o-50  text-dark label-inline font-weight-bold label-lg">Cases Allotment</span>';
                    } else if (row.batchstatus == 3) {
                        return '<span class="label bg-o-50  text-dark label-inline font-weight-bold label-lg">Scanning</span>';
                    } else if (row.batchstatus == 4) {
                        return '<span class="label bg-o-50  text-dark label-inline font-weight-bold label-lg">QC</span>';
                    } else if (row.batchstatus == 5) {
                        return '<span class="label bg-o-50  text-dark label-inline font-weight-bold label-lg">Outward</span>';
                    } else if (row.batchstatus == 6) {
                        return '<span class="label bg-o-50  text-dark label-inline font-weight-bold label-lg">Receive</span>';
                    } else if (row.batchstatus == 7) {
                        return '<span class="label bg-o-50  text-dark label-inline font-weight-bold label-lg">Received</span>';
                    }
                }
            }, {
                field: 'Action',
                title: 'Action',
                overflow: 'visible',
                autoHide: false,
                width: 100,
                textAlign: 'center',
                template: function (row) {
                    return '<a onclick="genrateBarCode(this,' + row.id + ')"  class="editbtn btn btn-icon btn-light btn-hover-primary btn-sm" title="Generate BarCode"><i class="fas fa-barcode text-dark icon-nm"></i></a>';
                }
            }],
        });
    };
    return {
        // Public functions
        init: function (batchdata) {
            // init dmeo
            mainTableInitreceive(batchdata);
        },
        _rendareTable: function () {
            pushtoSrever(null, "/batchesfindAllbyCreatedbyInward.dwf/3", "GET", function (node) {
                mainTableInitreceive(node.data);
            })
        }
    };
}();
var DelayedReceiptDatatable = function () {
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
            sortable: false,
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
                    title: 'CNR',
                }, {
                    field: 'year',
                    title: 'CaseNo',
                    template: function (row) {
                        return row.casetype + "_" + row.caseno + "_" + row.year;
                    }
                }, {
                    field: 'firinwardremarks',
                    title: "Digitization Team's remarks",
                }],
        }).sort("crn", "asc");
    };
    // demo initializer
    var mainTableInitdelayed = function (batchdata) {
        delayeddatatable = $('#kt_datatable_delayed').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: '/batchesfindAllbyCreatedbyInward.dwf/1',
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
                serverSorting: true,
                saveState: false,
            },
            // layout definition
            layout: {
                scroll: true,
                height: null,
                footer: false,
                icons: {
                    rowDetail: {
                        expand: 'fa fa-minus',
                        collapse: 'fa fa-plus'
                    }
                }
            },
            sortable: false,
            filterable: false,
            pagination: true,
            detail: {
                title: 'Load sub table',
                content: subTableInit,
            },
            //   search: {
            //       input: $('#kt_datatable_search_query_pending'),
            //       key: 'generalSearch'
            //   },
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
                field: 'Total Case',
                title: 'Total Case',
                sortable: false,
                template: function (row) {
                    return row.firs.length;
                }
            }, {
                field: 'created_by_d2',
                title: 'Created by',

                template: function (row) {
                    return row.created_by_d2.name
                }
            }, {
                field: 'deliveryschedule',
                title: 'Scheduled Delivery date',

                template: function (row) {
                    return moment.utc(row.deliveryschedule).format("DD/MM/YYYY")
                }
            }, {
                field: 'Action',
                title: 'Action',
                overflow: 'visible',
                autoHide: false,
                width: 100,
                template: function (row) {
                    return '<a onclick="receivedBatch(' + row.id + ')"  class="editbtn btn btn-icon btn-light btn-hover-primary btn-sm" title=""><i class="fa fa-list-alt text-dark icon-nm"></i></a>';
                }
            }],
        });
    };
    return {
        // Public functions
        init: function (batchdata) {
            // init dmeo
            mainTableInitdelayed(batchdata);
        },
        _rendareTable: function () {
            pushtoSrever(null, "/batchesfindAllbyCreatedbyInward.dwf/1", "GET", function (node) {
                mainTableInitdelayed(node.data);
            })
        }
    };
}();
var PandingReceiptDatatable = function () {
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
            sortable: false,
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
                    title: 'CNR',
                }, {
                    field: 'year',
                    title: 'CaseNo',
                    template: function (row) {
                        return row.casetype + "_" + row.caseno + "_" + row.year;
                    }
                }, {
                    field: 'firinwardremarks',
                    title: "Digitization Team's remarks",
                }],
        }).sort("crn", "asc");
    };
    // demo initializer
    var mainTableInitpending = function (batchdata) {
        pandingdatatable = $('#kt_datatable_pending').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: '/batchesfindAllbyCreatedbyInward.dwf/2',
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
                serverSorting: true,
                saveState: false,
            },
            // layout definition
            layout: {
                scroll: true,
                height: null,
                footer: false,
                icons: {
                    rowDetail: {
                        expand: 'fa fa-minus',
                        collapse: 'fa fa-plus'
                    }
                }
            },
            sortable: false,
            filterable: false,
            pagination: true,
            detail: {
                title: 'Load sub table',
                content: subTableInit,
            },
            //   search: {
            //       input: $('#kt_datatable_search_query_pending'),
            //       key: 'generalSearch'
            //   },
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
                sortable: false,
                template: function (row) {
                    return row.firs.length;
                }
            }, {
                field: 'created_by_d2',
                title: 'Created by',

                template: function (row) {
                    return row.created_by_d2.name
                }
            }, {
                field: 'deliveryschedule',
                title: 'Scheduled Delivery date',

                template: function (row) {
                    return moment.utc(row.deliveryschedule).format("DD/MM/YYYY")
                }
            }, {
                field: 'Action',
                title: 'Action',
                overflow: 'visible',
                autoHide: false,
                width: 100,
                template: function (row) {
                    return '<a onclick="receivedBatch(' + row.id + ')"  class="editbtn btn btn-icon btn-light btn-hover-primary btn-sm" title=""><i class="fa fa-list-alt text-dark icon-nm"></i></a>';
                }
            }],
        });
    };
    return {
        // Public functions
        init: function (batchdata) {
            // init dmeo
            mainTableInitpending(batchdata);
        },
        _rendareTable: function () {
            pushtoSrever(null, "/batchesfindAllbyCreatedbyInward.dwf/2", "GET", function (node) {
                mainTableInitpending(node.data);
            })
        }
    };
}();


function retrunjson(fieldarry, callback) {
    var jsonform = {};
    $('#batchcommitForm input[type="checkbox"]:not(:checked)').each(function () {
        jsonform[this.name] = this.value
    })
    $.each(fieldarry, function () {
        jsonform[this.name] = this.value
    })
    callback(jsonform);
}
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
var tabindex = 1;

'use strict';
function selectedTreeid(dom, id) {

    $('#itemid' + id).val($(dom).attr('id'))
    $('#crn' + id).val($(dom).attr('crn'));
    $('#year' + id).val($(dom).attr('caseyear'));
    $("#casetypeno" + id).html($(dom).attr('casetype') + "_" + $(dom).attr('caseno') + "_" + $(dom).attr('caseyear'))
    $('#casetype' + id).val($(dom).attr('casetype'));
    $('#caseno' + id).val($(dom).attr('caseno'));
    $('#search-results' + id).hide()
    $('#search-results' + id).find('.crnli').remove();

}

function findcrndy(id) {
    if ($('#crn' + id).val().length > 2) {
        pushtoSrever(null, "/getcrnFromDMS.dwf/" + $('#crn' + id).val(), "GET", function (node) {
            $('#search-results' + id).show()
            $('#search-results' + id).find('.crnli').remove();
            if (node.data.page.totalElements != 0) {
                $('#noducment' + id).hide()

                for (var i = 0; i < node.data.page.totalElements; i++) {
                    var CRN = node.data._embedded.items[i].metadata['casefile.case.cnrnumber'][0].value;
                    var ITEMID = node.data._embedded.items[i].id;
                    var CaseYear = node.data._embedded.items[i].metadata['casefile.case.registrationyear'][0].value
                    var CaseType = node.data._embedded.items[i].metadata['casefile.case.typename'][0].value;
                    var CaseNo = node.data._embedded.items[i].metadata['dc.title'] != undefined ? node.data._embedded.items[i].metadata['dc.title'][0].value : "Untitled";
                    var li = ' <li  caseno="' + CaseNo + '" casetype="' + CaseType + '" caseyear="' + CaseYear + '" crn="' + CRN + '" id="' + ITEMID + '" class="list-group-item crnli" onclick="selectedTreeid(this,' + id + ')">' +
                        '<span  >' + CRN + '</span> ' +
                        '</li>';
                    $('#search-results' + id).append(li)
                }
            } else {
                $('#noducment' + id).show()
            }

        })
    }


}
var KTDatatablesDataSourceAjaxClient = function () {

    var initTable1 = function (data) {

        datatable = $('#kt_datatable').DataTable({
            responsive: true,
            "ordering": false,
            "searching": false,
            "bAutoWidth": false,
            "bPaginate": false,
            "orderFixed": [1, 'asc'],
            data: data,
            "columns": [
                {
                    data: 'inwardstatus',
                    render: function (data, type, full, meta) {
                        var status = {

                            1: { 'select': '<div class=" form-group"><select  previousselect="1" tabindex="' + tabindex + '" class="text-green  form-control-sm"  onchange="this.className=this.options[this.selectedIndex].className" name="" id="inwardstatus' + full.id + '" ><option class="text-green form-control-sm" value="1" selected>Accept</option><option class="text-danger form-control-sm" value="2">Reject</option></select></div>' },
                            2: { 'select': '<div class=" form-group"><select  previousselect="2" tabindex="' + tabindex + '" class="text-danger  form-control-sm"  onchange="this.className=this.options[this.selectedIndex].className" name="" id="inwardstatus' + full.id + '" ><option class="text-green form-control-sm" value="1" >Accept</option><option class="text-danger form-control-sm" value="2" selected>Reject</option></select></div>' }

                        };
                        return status[full.inwardstatus].select;
                    }
                },
                {
                    data: 'crn',
                    render: function (data, type, full, meta) {

                        return '<div class=" form-group"><input type="text" tabindex="' + tabindex + '" name="crn' + full.id + '" id="crn' + full.id + '"  class="   form-control" value="' + full.crn + '"orignalvalue="' + full.crn + '" onkeyup="findcrndy(' + full.id + ')"> <ul id="search-results' + full.id + '" class="list-group searchcrn"  style="cursor: pointer;display: none;"> <li id="noducment' + full.id + '" style="display: nonne;"><strong>No CNR(s) Found </strong></li></ul> <input type="hidden" tabindex="' + tabindex + '" name="itemid' + full.id + '" id="itemid' + full.id + '"  class="   form-control" value="' + full.itemid + '"orignalvalue="' + full.itemid + '"></div>';
                    }
                }, {
                    data: 'caseno',
                    render: function (data, type, full, meta) {
                        return '<div class=" form-group"><label  id="casetypeno' + full.id + '"  class="form-control"  >' + full.casetype + '_' + full.caseno + '_' + full.year + ' </label> <input type="hidden" tabindex="' + tabindex + '" name="casetype' + full.id + '" id="casetype' + full.id + '"  class="   form-control" value="' + full.casetype + '"orignalvalue="' + full.casetype + '"><input type="hidden" tabindex="' + tabindex + '" name="caseno' + full.id + '" id="caseno' + full.id + '"  class="   form-control" value="' + full.caseno + '"orignalvalue="' + full.caseno + '"><input type="hidden" tabindex="' + tabindex + '" name="year' + full.id + '" id="year' + full.id + '" onfocusout="yearvalidate(this)" onpaste=="numberOnly(this)"  onkeyup="numberOnly(this)"  class=" year numberOnly form-control" maxlength="4" value="' + full.year + '" ></div>';
                    }
                },
               
                

                {
                    data: 'firinwardremarks',
                    render: function (data, type, full, meta) {

                        var digiremarks = full.firinwardremarks == null ? "" : full.firinwardremarks;
                        return '<div class=" form-group"><textarea tabindex="' + tabindex + '" name="firinwardremarks' + full.id + '"  id="firinwardremarks' + full.id + '" class="  form-control" placeholder=""  rows="3">' + digiremarks + '</textarea></div>';
                    }
                }, { data: null },

            ],
            columnDefs: [
                {
                    aTargets: [4],
                    title: 'Actions',
                    orderable: false,
                    render: function (data, type, full, meta) {
                        return '<a tabindex="' + tabindex + '" onclick="updateFIR(' + full.id + ')"  class="editbtn btn btn-icon btn-light font-weight-bolder btn-hover-primary btn-sm" title="Update Case" onkeypress="return runScript(event,this);"><i class="flaticon-refresh text-dark icon-md"></i></a>';
                    },
                },

            ],
        });
    };

    return {

        //main function to initiate the module
        init: function (data) {
            initTable1(data);
            $('.ckhform').map(function () {
                if ($(this).val() == "true") {
                    $(this).prop('checked', true)
                } else {
                    $(this).prop('checked', false)
                }
            })
            $(".ckhform").on('change', function () {
                if ($(this).is(':checked')) {
                    $(this).attr('value', 'true');
                } else {
                    $(this).attr('value', 'false');
                }


            });
        },

    };

}();

function genrateBarCode(dom, id) {
    // $(dom).addClass('spinner spinner-white spinner-right');
    var selectedBatchs = [];
    selectedBatchs.push(id)
    pushtoSrever({ 'selectedBatches': selectedBatchs }, "/barcodeReportPrint.dwf", "GET", function (node) {
        // $(dom).removeClass('spinner spinner-white spinner-right');
        var w = window.open();
        $(w.document.body).html(node.data);
        jQuery(w.document).ready(function () {
            w.print();
            w.close();
        });
    })



}

function commitBatch() {
    $('.fv-plugins-message-container').remove();

    var validator = FormValidation.formValidation(
        document.getElementById('firForm'),
        {
            fields: {
            }, plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                bootstrap: new FormValidation.plugins.Bootstrap(),
            }
        }
    );
    // Establishment Name validation code 
    // $(".pageconutvalidate").each(function(){
    //    validator.addField($(this).attr('id'), est_code);
    // });


    validator.validate().then(function (status) {
        console.log(status)
        if (status != "Invalid") {
            retrunjson($('#batchcommitForm').serializeArray(), function (formdata) {
                pushtoSrever(formdata, "/inwardBatchCommit.dwf/" + parseInt($('#batchiddp').val()), "PUT", function (node) {
                    if (node.data != null) {
                        $('.containbatch').hide(500);
                        toastr.success(" Batch Committied successfully.");
                        location.reload()
                    } else {
                        toastr.error("Problem in Committiing Batch.");
                    }
                });
            });
        }

    })





}
function runScript(e, dom) {
    e.preventDefault();
    if (e.keyCode == 13) {
        $(dom).click()
    }
    else {
        return false;
    }
}
function updateFIR(firid) {
    $('.fv-plugins-message-container').remove();


    const crn = {
        validators: {
            notEmpty: {
                message: 'Mandatory field'
            }
        }
    };
    const firinwardremarks = {
        validators: {
            notEmpty: {
                message: 'Mandatory field'
            }
        }
    };
    var validator = FormValidation.formValidation(
        document.getElementById('firForm'),
        {
            fields: {
            }, plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                bootstrap: new FormValidation.plugins.Bootstrap(),
            }
        }
    );
    if ($('#inwardstatus' + firid).val() == 2) {
        validator.addField("firinwardremarks" + firid, firinwardremarks);
    } else {
        $('#firinwardremarks' + firid).removeClass('is-invalid')
        // validator.removeField("firinwardremarks" + firid, firinwardremarks);
    }


    validator.addField('crn' + firid, crn);

    validator.validate().then(function (status) {
        console.log(status)
        if (status != "Invalid") {
            $('#crn' + firid).removeClass('is-valid');


            var fir =
            {
                crn: $('#crn' + firid).val(),
                firinwardremarks: $("#firinwardremarks" + firid).val(),
                inwardstatus: $('#inwardstatus' + firid).val(),
                
                year: $('#year' + firid).val(),
                casetype: $('#casetype' + firid).val(),
                caseno: $('#caseno' + firid).val(),

            };
            pushtoSrever(fir, "/inwardFIRUpdate.dwf/" + firid, "PUT", function (node) {
                if (node.data != null) {
                    $('#crn' + firid).html(node.data.crn);
                    if ($('#inwardstatus' + firid).attr('previousselect') == "1") {
                        --acceptedFIR;
                    } else if ($('#inwardstatus' + firid).attr('previousselect') == "2") {
                        --rejectedFIR;
                    }
                    if ($('#inwardstatus' + firid).val() == 1) {
                        $('#inwardstatus' + firid).attr('previousselect', 1)
                        acceptedFIR++;
                    } else if ($('#inwardstatus' + firid).val() == 2) {
                        $('#inwardstatus' + firid).attr('previousselect', 2)
                        rejectedFIR++;
                    }

                    $('#acceptFIR').html(acceptedFIR);
                    $('#rejectFIR').html(rejectedFIR);

                    //  KTDatatableDataLocalDemo._rendareTable();
                    toastr.success(" Case updated successfully.")
                } else {
                    toastr.error("Problem in updating Case.")
                }
            })
        }
    });
}
var firtablerefe = 1;
var acceptedFIR = 0, rejectedFIR = 0;
function receivedBatch(id) {
    pushtoSrever(null, "/inwardBatchReceive.dwf/" + id, "GET", function (node) {
        if (node.status) {
            $('#batchiddp').val(id);
            acceptedFIR = 0; rejectedFIR = 0;


            if (firtablerefe == 1) {
                firtablerefe = 2;
                KTDatatablesDataSourceAjaxClient.init(node.data.firs)
                // KTDatatableDataLocalDemo.init(node.data.firs);
            } else {
                datatable.destroy();
                KTDatatablesDataSourceAjaxClient.init(node.data.firs)
                // KTDatatableDataLocalDemo._rendareTable(node.data.firs)
            }
            for (var i = 0; i < node.data.firs.length; i++) {
                if (node.data.firs[i].inwardstatus == 1) {
                    acceptedFIR++;
                } else if (node.data.firs[i].inwardstatus == 2) {
                    rejectedFIR++;
                }
            }

            $('#acceptFIR').html(acceptedFIR);
            $('#rejectFIR').html(rejectedFIR);

            // $('#district').html(node.data.created_by_d2.policestation.district.district);
            //  $('#ps').html(node.data.created_by_d2.policestation.ps);
            //  $('#ps_cd').html(node.data.created_by_d2.policestation.ps_cd);

            $('#totalFIR').html(node.data.firs.length);
            $('#batchname').html(node.data.bundlenumber);
            $('#batchcreater').html(node.data.created_by_d2.name);
            $('#scheduleddate').html(moment.utc(node.data.deliveryschedule).format("DD/MM/YYYY"));
            $('#batchcreationdate').html(moment(node.data.created_at_d2).format("DD/MM/YYYY hh:mm A"));
            $('#usercontact').html(node.data.created_by_d2.contactnumber == null ? "" : node.data.created_by_d2.contactnumber);
            $('#usermail').html(node.data.created_by_d2.email == null ? "" : node.data.created_by_d2.email);
            $('.containbatch').show(500);
        } else {
            toastr.error("batch already received by another user");
        }
    })
}
function cancleCommitBatch() {
    $('.containbatch').hide();
}

function yearvalidate(dom) {
    var current_year = new Date().getFullYear();
    if (parseInt($(dom).val()) > current_year) {
        $(dom).val("");
        $(dom).focus();
        toastr.error("Year should be less than current year")
    }
}
function firnumbergen(dom) {
    if ($(dom).val().length == 3) {
        $(dom).val("0" + $(dom).val())
        //  this.value = "0" + this.value;
    } else if ($(dom).val().length == 2) {
        $(dom).val("00" + $(dom).val())
        // this.value = "00" + this.value;
    } else if ($(dom).val().length == 1) {
        $(dom).val("000" + $(dom).val())
        //this.value = "000" + this.value;
    }
};
function popover(dom) {

    $('[data-toggle="popover"]').popover();

}

function remocepopover(dom) {
    $('.popover ').popover('hide')

}
function numberOnly(dom) {
    $(dom).val($(dom).val().replace(/[^0-9]/g, ''));
}
function editbatchcommitBatch() {

    pushtoSrever(null, "/editBatchinward.dwf/" + $('#batchiddp').val(), "GET", function (node) {
        console.log(node.data);
        $('#orientation').val(node.data.orientation == null ? "" : node.data.orientation),
            $("#photocopy").val(node.data.photocopy == null ? "" : node.data.photocopy),

            $('#quality_image').val(node.data.quality_image == null ? "" : node.data.quality_image),
            $('#agent_associated').val(node.data.agent_associated == null ? "" : node.data.agent_associated),
            $('#considerations').val((node.data.considerations == null || !node.data.considerations) ? "false" : node.data.considerations),
            $('#edits_performed').val((node.data.edits_performed == null || !node.data.edits_performed) ? "false" : node.data.edits_performed),
            $('#integrity').val((node.data.Integrity == null || !node.data.Integrity) ? "false" : node.data.Integrity),
            $('#comparison').val((node.data.comparison == null || !node.data.comparison) ? "false" : node.data.comparison),
            $('#legibility').val((node.data.legibility == null || !node.data.legibility) ? "false" : node.data.legibility),

            $('#gapbatch').val((node.data.gapbatch == null || !node.data.gapbatch) ? "false" : node.data.gapbatch),
            $('#bundlenumber').val(node.data.bundlenumber);
        $('#capture_device').val(node.data.capture_device == null ? "" : node.data.capture_device),
            $('#date_last_calibration').val(node.data.Date_last_calibration == null ? "" : node.data.Date_last_calibration)


        $('#comparison').prop('checked', (node.data.comparison == null || !node.data.comparison) ? false : node.data.comparison)
        $('#legibility').prop('checked', (node.data.legibility == null || !node.data.legibility) ? false : node.data.legibility)
        $('#considerations').prop('checked', (node.data.considerations == null || !node.data.considerations) ? false : node.data.considerations)
        $('#edits_performed').prop('checked', (node.data.edits_performed == null || !node.data.edits_performed) ? false : node.data.edits_performed)
        $('#integrity').prop('checked', (node.data.Integrity == null || !node.data.Integrity) ? false : node.data.Integrity);
        $('#gapbatch').prop('checked', (node.data.gapbatch == null || !node.data.gapbatch) ? false : node.data.gapbatch)

    })
    $('#editBatchModal').modal('show');
}
function savebatchdetails() {
    var fir =
    {
        orientation: $('#orientation').val(),
        photocopy: $("#photocopy").val(),
        quality_image: $('#quality_image').val(),
        agent_associated: $('#agent_associated').val(),
        comparison: $('#comparison').val(),
        legibility: $('#legibility').val(),
        bundlenumber: $('#bundlenumber').val(),
        gapbatch: $('#gapbatch').val(),
        considerations: $('#considerations').val(),
        edits_performed: $('#edits_performed').val(),
        Integrity: $('#integrity').val(),
        capture_device: $('#capture_device').val(),
        Date_last_calibration: $('#date_last_calibration').val()

    };
    pushtoSrever(fir, "/inwardbatchupdate.dwf/" + $('#batchiddp').val(), "PUT", function (node) {
        if (node.data != null) {
            console.log(node.data);
            $('#batchname').html(node.data.bundlenumber);
            toastr.success(" Batches details updated successfully.")
        } else {
            toastr.error("Problem in updating Batch!")
        }
    })
}
function validateFIR(id) {
    var itemid = $('#itemid' + id).val();
    var year = $('#year' + id).val()
    if (itemid != "" && year != "" && itemid != $('#itemid' + id).attr("orignalvalue")) {
        var obj = {
            itemid: itemid,
            year: year
        }
        pushtoSrever(obj, "/isvalidFIRInward.dwf", "POST", function (node) {
            if (!node.status) {
                toastr.error($('#itemid' + id).val() + " Item Id already exists in  batch " + node.data.batch.bundlenumber);
                $('#itemid' + id).val("")
                $('#itemid' + id).focus();
            }
        });
    }
}
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
jQuery(document).ready(function () {
    $('.containbatch').hide()
    $('a').bind('keypress', function (e) {
        debugger;
    });
    $('.numberOnly').bind('keyup paste', function () {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
    $('.year').focusout(function () {


    });
    $('#datePicker').datepicker({
        format: "dd/mm/yyyy",
        rtl: KTUtil.isRTL(),
        todayBtn: "linked",
        todayHighlight: true,
        templates: arrows,
        autoclose: true,

    });
    $(".ckhform").on('change', function () {
        if ($(this).is(':checked')) {
            $(this).attr('value', 'true');
        } else {
            $(this).attr('value', 'false');
        }


    });

    getpendingBatch();
});

