function getpendingBatch() {
    PandingReceiptDatatable.init();
    // pushtoSrever(null, "/batchesfindAllForFileTag.dwf", "GET", function (node) {
    //     PandingReceiptDatatable.init(node.data);
    // })
}
var pandingdatatable;
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
                    field: 'tagstatus',
                    title: 'Tag Status',
                    template: function (row) {
                        if (row.tagstatus && row.inwardstatus == 1) {
                            return '<span style="width: 65px;" class="label bg-gray-o-50 label-inline font-weight-bold label-lg text-green"> Tagged </span>';
                        } else if (row.inwardstatus == 2) {
                            return '<span style="width: 65px;" class="label bg-gray-o-50 label-inline font-weight-bold label-lg"> N/A </span>';
                        } else if (!row.tagstatus && row.inwardstatus == 1) {
                            return '<span style="width: 65px;" class="label bg-warning-o-50 label-inline font-weight-bold label-lg text-warning"> Pending </span>';
                        }
                    }
                }, {
                    field: 'firregisternumber',
                    title: 'FIR Reg Number',
                }, {
                    field: 'firserialnumber',
                    title: 'FIR Serial Number',
                }, {
                    field: 'year',
                    title: 'Year',
                }, {
                    field: 'pagecount',
                    title: 'Page Count',
                }, {
                    field: 'firremarks',
                    title: 'Remarks',
                }, {
                    field: 'firinwardremarks',
                    title: "Digitization Team's remarks",
                    template: function (row) {

                        return row.firinwardremarks == null ? "" : row.firinwardremarks;
                    }

                }],
        }).sort("firregisternumber", "asc");
    };
    // demo initializer
    var mainTableInitpending = function (batchdata) {
        pandingdatatable = $('#kt_datatable_pending').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: '/batchesfindAllForFileTag.dwf',
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
            sortable: true,
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
            },
            {
                field: 'checkbox',
                title: '',
                template: '{{id}}',
                sortable: false,
                width: 20,
                textAlign: 'center',
                selector: { class: 'kt-checkbox--solid' },
            }, {
                field: 'bundlenumber',
                title: 'Batch ID',
                width: 150,
            }, {
                field: 'Total FIRs',
                title: 'Total FIRs',

                template: function (row) {
                    return row.firs.length;
                }
            }, {
                field: 'created_by_d2.policestation',
                title: 'Police Station',

                template: function (row) {
                    return row.created_by_d2.policestation.ps
                }
            }, {
                field: 'inwardcommited_by',
                title: 'Dispatcher',

                template: function (row) {
                    return row.inwardcommited_by.name
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

var KTDatatablesDataSourceAjaxClient = function () {

    var initTable1 = function (data) {

        datatable = $('#kt_datatable').DataTable({
            responsive: true,
            "ordering": true,
            "searching": false,
            "bAutoWidth": false,
            "bPaginate": false,
            "orderFixed": [2, 'asc'],
            data: data,
            "columns": [
                {
                    data: 'inwardstatus',
                    render: function (data, type, full, meta) {
                        var status = {
                            0: { 'title': 'Pending', 'class': 'bg-warning-o-50  text-warning' },
                            1: { 'title': 'Accepted', 'class': ' text-green' },
                            2: { 'title': 'Rejected', 'class': 'bg-danger-o-50 text-danger' },
                        };
                        return '<span class="label ' + status[full.inwardstatus].class + ' label-inline font-weight-bold label-lg">' + status[full.inwardstatus].title + '</span>';

                    }
                },
                {
                    data: 'tagstatus',
                    render: function (data, type, full, meta) {
                        if (full.tagstatus && full.inwardstatus == 1) {
                            return '<span class="switch switch-icon"><label><input type="checkbox" checked="checked" tabindex="' + tabindex + '" name="tagstatus' + full.id + '" id="tagstatus' + full.id + '" value="true" onchange="setvaluetag(this)"/><span></span></label></span>';
                        } else if (full.inwardstatus == 2) {
                            return '<span class="label bg-gray-o-50 label-inline font-weight-bold label-lg"> N/A </span>';
                        } else if (!full.tagstatus && full.inwardstatus == 1) {
                            return '<span class="switch switch-icon"><label><input type="checkbox"  tabindex="' + tabindex + '" name="tagstatus' + full.id + '" id="tagstatus' + full.id + '"  value="false" onchange="setvaluetag(this)"/><span></span></label></span>';
                        }

                    }
                },
                { data: 'firregisternumber' },
                { data: 'firserialnumber' },
                { data: 'year' },
                { data: 'pagecount' },
                { data: 'firremarks' },
                {
                    data: 'tagremarks',
                    render: function (data, type, full, meta) {

                        var digiremarks = full.tagremarks == null ? "" : full.tagremarks;
                        if (full.inwardstatus != 2) {
                            return '<div class=" form-group"><textarea tabindex="' + tabindex + '" name="tagremarks' + full.id + '"  id="tagremarks' + full.id + '" class="  form-control" placeholder=""  rows="3">' + digiremarks + '</textarea></div>';
                        } else {
                            return full.firinwardremarks == null ? "" : full.firinwardremarks;
                        }


                    }
                },
                { data: null },

            ],
            columnDefs: [
                {
                    aTargets: [8],
                    title: 'Actions',
                    orderable: false,
                    render: function (data, type, full, meta) {
                        if (full.inwardstatus != 2) {
                            return '<a tabindex="' + tabindex + '" onclick="updateFIR(' + full.id + ')"  class="editbtn btn btn-icon btn-light font-weight-bolder btn-hover-primary btn-sm" title="Update FIR" onkeypress="return runScript(event,this);"><i class="flaticon-refresh text-dark icon-md"></i></a>';
                        } else {
                            return "";
                        }
                    },
                },

            ],
        });
    };

    return {

        //main function to initiate the module
        init: function (data) {
            initTable1(data);
        },

    };

}();
function setvaluetag(dom) {
    if ($(dom).attr('value') == "true") {
        $(dom).attr('value', "false");
    } else {
        $(dom).attr('value', "true");
    }

}
function commitBatch() {
    pushtoSrever(null, "/filetagCommit.dwf/" + parseInt($('#batchiddp').val()), "PUT", function (node) {
        if (node.data != null) {
            $('.containbatch').hide(500);
            toastr.success(" Batch Committied successfully.");
            location.reload()
        } else {
            toastr.error("Problem in Committiing Batch.");
        }
    });
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
    debugger;
    var fir =
    {
        tagstatus: $("#tagstatus" + firid).val() == "true" ? true : false,
        tagremarks: $('#tagremarks' + firid).val()

    };
    pushtoSrever(fir, "/filetaGFIRUpdate.dwf/" + firid, "PUT", function (node) {
        if (node.data != null) {

            if (node.data.inwardstatus == 1 && node.data.tagstatus) {
                tagPendding--;
                tagaccepted++;
            }
            else if (node.data.inwardstatus == 1 && !node.data.tagstatus) {
                tagPendding++;
                tagaccepted--;
            }
            if (tagPendding > 0) {
                $('#commitBatchButton').attr('disabled', true);
            } else {
                $('#commitBatchButton').attr('disabled', false);
            }
            $('#acceptFIR').html(tagaccepted);
            $('#pendingFIR').html(tagPendding);
            toastr.success(" FIR updated successfully.")
        } else {
            toastr.error("Problem in updating FIR.")
        }
    })


}



var firtablerefe = 1;
var tagPendding = 0, tagaccepted = 0, tagrejected = 0;;
function receivedBatch(id) {
    pushtoSrever(null, "/filetagReceive.dwf/" + id, "GET", function (node) {
        if (node.status) {
            $('#batchiddp').val(id);
            tagPendding = 0;
            tagaccepted = 0;
            tagrejected = 0;
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
                if (node.data.firs[i].inwardstatus == 1 && !node.data.firs[i].tagstatus) {
                    tagPendding++;
                } else if (node.data.firs[i].inwardstatus == 1 && node.data.firs[i].tagstatus) {
                    tagaccepted++;
                } else {
                    tagrejected++;
                }
            }
            if (tagPendding > 0) {
                $('#commitBatchButton').attr('disabled', true);
            } else {
                $('#commitBatchButton').attr('disabled', false);
            }
            $('#rejectFIR').html(tagrejected);
            $('#pendingFIR').html(tagPendding);
            $('#acceptFIR').html(tagaccepted);
            $('#district').html(node.data.created_by_d2.policestation.district.district);
            $('#ps').html(node.data.created_by_d2.policestation.ps);
            $('#ps_cd').html(node.data.created_by_d2.policestation.ps_cd);
            $('#totalFIR').html(node.data.firs.length);
            $('#batchname').html(node.data.bundlenumber);
            $('#batchcreater').html(node.data.created_by_d2.name);
            $('#scheduleddate').html(moment.utc(node.data.deliveryschedule).format("DD/MM/YYYY"));
            $('#dispatchddate').html(moment.utc(node.data.inwardcommited_at).format("DD/MM/YYYY"));
            $('#batchcreationdate').html(moment.utc(node.data.created_at_d2).format("DD/MM/YYYY"));
            $('#usercontact').html(node.data.created_by_d2.contactnumber == null ? "" : node.data.created_by_d2.contactnumber);
            $('#usermail').html(node.data.created_by_d2.email == null ? "" : node.data.created_by_d2.email);
            $('.containbatch').show(500);
        } else {
            toastr.error("batch already received by another user");
        }
    })
}

function bulkCommit() {
    var selectedBatch = [];
    KTApp.blockPage({
        overlayColor: '#000',
        state: 'danger',
        message: 'Please wait...'
    });
    $('div#kt_datatable_pending   input[type=checkbox]').each(function () {
        if ($(this).is(":checked")) {
            if ($(this).attr('value') != undefined)
                selectedBatch.push($(this).attr('value'));
        }

    });
    if (selectedBatch.length == 0) {
        toastr.error('Select  atleast one batch!');
        KTApp.unblockPage();
        return false;
    } else {
        pushtoSrever({ 'selectedBatches': selectedBatch }, "/bulkTagOnBatch.dwf", "GET", function (node) {
            KTApp.unblockPage();
            if (node.data.status) {
                toastr.success("Taged all file successfully");
                location.reload()
            } else {
                toastr.error("problem in tagging file");
            }

        })
    }


}
function cancleCommitBatch() {
    $('.containbatch').hide();
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
    getpendingBatch();
});