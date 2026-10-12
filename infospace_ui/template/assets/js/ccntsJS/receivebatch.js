var pandingdatatable, receiveddatatablekt, delayeddatatable, datatable;
var statusdelivr = 0, statusdelay = 0; statuspendding = 0;
function getdeliveryBatch() {
    if (statusdelivr == 0) {
        statusdelivr = 1;
        setTimeout(() => {
            ReceivedDatatable.init();
            // pushtoSrever(null, "/batchesfindAllbyCreatedbyReceive.dwf/3", "GET", function (node) {
            //     ReceivedDatatable.init(node.data);
            // })
        }, 200);
    }
} function getdelayedBatch() {
    if (statusdelay == 0) {
        statusdelay = 1;
        setTimeout(() => {
            DelayedReceiptDatatable.init();
            // pushtoSrever(null, "/batchesfindAllbyCreatedbyReceive.dwf/1", "GET", function (node) {
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
            // pushtoSrever(null, "/batchesfindAllbyCreatedbyReceive.dwf/2", "GET", function (node) {
            //     PandingReceiptDatatable.init(node.data);
            // })
        }, 200);
    }
}

var ReceivedDatatable = function () {
    // Private functions
    var subTableInit = function (e) {
        var local=e.data;
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
                },{
                    field: 'returnstatus',
                    title: 'Return Status',
                    template: function (row) {
                        var status = {
                            0: { 'title': 'Pending', 'class': 'bg-warning-o-50  text-warning' },
                            1: { 'title': 'Accepted', 'class': ' text-green' },
                           
                        };
                        return '<span class="label ' + status[row.returnstatus].class + ' label-inline font-weight-bold label-lg">' + status[row.returnstatus].title + '</span>';
                    }
                },{
                    field: 'problematiceFIR',
                    title: 'Problematice',
                    template: function (row) {
                        if(row.problematiceFIR){
                            return   '<i class="flaticon-warning-sign text-warning icon-md"></i>';
                        }else{
                          return   '<i class="flaticon-warning-sign text-dark icon-md"></i>';
                        }
                      
                    }
                }, {
                    field: 'crn',
                    title: 'CRN',
                }, {
                    field: 'year',
                    title: 'CaseNo',
                    template: function (row) {
                        return row.casetype+"_"+row.caseno+"_"+row.year;
                    }
                }, {
                    field: 'pagecount',
                    title: 'Page Count',
                }, {
                    field: 'receiveremarks',
                    title: 'Remarks',
                }, {
                    field: 'firinwardremarks',
                    title: "Digitization Team's remarks",
                  
                    template: function (row) {
                        var remarks = row.firinwardremarks != null ? row.firinwardremarks : "";
                        var tagremarks = row.tagremarks != null ? row.tagremarks : "";
                        var outwordremks= row.outwardremarks!= null ? row.outwardremarks : "";
                        if (remarks == "" && tagremarks == "" ) {
                            return outwordremks;
                        } else {
                            if(tagremarks!=""){
                                tagremarks=   tagremarks+" . <strong>"+moment.utc(local.filetagcommitted_at).format("DD/MM/YYYY HH:mm")+" "+local.filetagcommitted_by.name+"</strong>"+ "<div class='separator separator-dashed mt-8 mb-5'></div>";
                            }
                            if(remarks!=""){
                                remarks=   remarks+" . <strong>"+moment.utc(local.inwardcommited_at).format("DD/MM/YYYY HH:mm")+" "+local.inwardcommited_by.name+"</strong>"+ "<div class='separator separator-dashed mt-8 mb-5'></div>";
                               }
                            var remarksfinal = remarks  + " " +tagremarks;
                            return outwordremks + '&nbsp <a type="button" class="btn" data-container="body" data-toggle="popover" data-original-title="Remarks" data-html="true" data-placement="left" data-content="' + remarksfinal + '" onmouseover="popover(this)"  onmouseout="remocepopover(this)"><i class="icon-md fas fa-exclamation"></i> </a>';
                          
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
                        url:  '/batchesfindAllbyCreatedbyReceive.dwf/3',
                        method:'GET',
                        // sample custom headers
                        // headers: {'x-my-custom-header': 'some value', 'x-test-header': 'the value'},
                        map: function(raw) {
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
                saveState:false,
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
            }, {
                field: 'bundlenumber',
                title: 'Batch ID',
                width: 150,
            }, {
                field: 'Total Cases',
                title: 'Total Cases',
               
                template: function (row) {
                    return row.firs.length;
                }
            },{
                field: 'outwardcommited_by',
                title: 'Dispatcher',
               
                template: function (row) {
                    return row.outwardcommited_by.name
                }
            }, {
                field: 'deliveryschedule',
                title: 'Scheduled Delivery date',
            
                template: function (row) {
                    return moment.utc(row.deliveryschedule).format("DD/MM/YYYY")
                }
            },{
                field: 'receivecommited_at',
                title: 'Actual Return date',
               
                template: function (row) {
                    return moment.utc(row.receivecommited_at).format("DD/MM/YYYY")
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
        var local=e.data;
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
                    field: 'returnstatus',
                    title: 'Return Status',
                    template: function (row) {
                        var status = {
                            0: { 'title': 'Pending', 'class': 'bg-warning-o-50  text-warning' },
                            1: { 'title': 'Accepted', 'class': ' text-green' },
                            2: { 'title': 'Rejected', 'class': 'bg-danger-o-50 text-danger' },
                        };
                        if(row.returnstatus!=null)
                        return '<span class="label ' + status[row.returnstatus].class + ' label-inline font-weight-bold label-lg">' + status[row.returnstatus].title + '</span>';
                    }
                }, {
                    field: 'crn',
                    title: 'CRN',
                }, {
                    field: 'year',
                    title: 'CaseNo',
                    template: function (row) {
                        return row.casetype+"_"+row.caseno+"_"+row.year;
                    }
                    
                }, {
                    field: 'pagecount',
                    title: 'Page Count',
                }, {
                    field: 'firremarks',
                    title: 'Remarks',
                }, {
                    field: 'outwardremarks',
                    title: "Digitization Team's remarks",
                   
                    template: function (row) {
                        var remarks = row.firinwardremarks != null ? row.firinwardremarks : "";
                        var tagremarks = row.tagremarks != null ? row.tagremarks : "";
                        var outwordremks= row.outwardremarks!= null ? row.outwardremarks : "";
                        if (remarks == "" && tagremarks == "" ) {
                            return outwordremks;
                        } else {
                            if(tagremarks!=""){
                                tagremarks=   tagremarks+". <strong>"+moment.utc(local.filetagcommitted_at).format("DD/MM/YYYY HH:mm")+" "+local.filetagcommitted_by.name+"</strong>"+ "<div class='separator separator-dashed mt-8 mb-5'></div>";
                            }
                            if(remarks!=""){
                                remarks=   remarks+". <strong>"+moment.utc(local.inwardcommited_at).format("DD/MM/YYYY HH:mm")+" "+local.inwardcommited_by.name+"</strong>"+ "<div class='separator separator-dashed mt-8 mb-5'></div>";
                               }
                            var remarksfinal = remarks + " " +tagremarks;
                            return outwordremks + '&nbsp <a type="button" class="btn" data-container="body" data-toggle="popover" data-original-title="Remarks" data-html="true" data-placement="left" data-content="' + remarksfinal + '" onmouseover="popover(this)"  onmouseout="remocepopover(this)"><i class="icon-md fas fa-exclamation"></i> </a>';
                          
                        }
                    }
                }],
        }).sort("crn", "asc");;
    };
    // demo initializer
    var mainTableInitdelayed = function (batchdata) {
        delayeddatatable = $('#kt_datatable_delayed').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url:  '/batchesfindAllbyCreatedbyReceive.dwf/1',
                        method:'GET',
                        // sample custom headers
                        // headers: {'x-my-custom-header': 'some value', 'x-test-header': 'the value'},
                        map: function(raw) {
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
                saveState:false,
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
            }, {
                field: 'bundlenumber',
                title: 'Batch ID',
                width: 150,
            }, {
                field: 'Total Cases',
                title: 'Total Cases',
               
                template: function (row) {
                    return row.firs.length;
                }
            }, {
                field: 'deliveryschedule',
                title: 'Scheduled Delivery date',
               
                template: function (row) {
                    return moment.utc(row.deliveryschedule).format("DD/MM/YYYY")
                }
            }, {
                field: 'batchstatus',
                title: 'Current Status',
               
                template: function (row) {
                   if(row.batchstatus==1){
                    return '<span class="label bg-o-50  text-dark label-inline font-weight-bold label-lg">Inward</span>';
                   }else if(row.batchstatus==2){
                        return '<span class="label bg-o-50  text-dark label-inline font-weight-bold label-lg">Cases Allotment</span>';
                    }else if(row.batchstatus==3){
                        return '<span class="label bg-o-50  text-dark label-inline font-weight-bold label-lg">Scanning</span>';
                    }else if(row.batchstatus==4){
                        return '<span class="label bg-o-50  text-dark label-inline font-weight-bold label-lg">QC</span>';
                    }else if(row.batchstatus==5){
                        return '<span class="label bg-o-50  text-dark label-inline font-weight-bold label-lg">Outward</span>';
                    }else if(row.batchstatus==6){
                        return '<span class="label bg-o-50  text-dark label-inline font-weight-bold label-lg">Receive</span>';
                    }else if(row.batchstatus==7){
                        return '<span class="label bg-o-50  text-dark label-inline font-weight-bold label-lg">Received</span>';
                    }
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
        var local=e.data;
        $('<div/>').attr('id', 'child_data_local_' + e.data.id).appendTo(e.detailCell).KTDatatable({
            data: {
                responsive: true,
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
                    width:80,
                    template: function (row) {
                        var status = {
                           0: { 'title': 'Pending', 'class': 'bg-warning-o-50  text-warning' },
                            1: { 'title': 'Accepted', 'class': ' text-green' },
                            2: { 'title': 'Rejected', 'class': 'bg-danger-o-50 text-danger' },
                        };
                        return '<span class="label ' + status[row.inwardstatus].class + ' label-inline font-weight-bold label-lg">' + status[row.inwardstatus].title + '</span>';
                    }
                },{
                    field: 'returnstatus',
                    title: 'Return Status',
                    width:80,
                    template: function (row) {
                        var status = {
                          
                            0: { 'title': 'Pending', 'class': 'bg-warning-o-50  text-warning' },
                            1: { 'title': 'Accepted', 'class': ' text-green' },
                            
                        };
                       
                            return '<span class="label ' + status[row.returnstatus].class + ' label-inline font-weight-bold label-lg">' + status[row.returnstatus].title + '</span>';
                    }
                },{
                    field: 'problematiceFIR',
                    title: 'Problematice',
                    width:85,
                    template: function (row) {
                        if(row.problematiceFIR){
                            return   '<i class="flaticon-warning-sign text-warning icon-md"></i>';
                        }else{
                          return   '<i class="flaticon-warning-sign text-dark icon-md"></i>';
                        }
                      
                    }
                }, {
                    field: 'crn',
                    title: 'CRN',
                    width:50,
                }, {
                    field: 'year',
                    title: 'CaseNo',
                    template: function (row) {
                        return row.casetype+"_"+row.caseno+"_"+row.year;
                    }
                    
                }, {
                    field: 'pagecount',
                    title: 'Page Count',
                    width:50,
                }, {
                    field: 'firremarks',
                    title: 'Remarks',
                    width:110,
                }, {
                    field: 'outwardremarks',
                    title: "Digitization Team's remarks",
                    width:110,
                    template: function (row) {
                        var remarks = row.firinwardremarks != null ? row.firinwardremarks : "";
                        var tagremarks = row.tagremarks != null ? row.tagremarks : "";
                        var outwordremks= row.outwardremarks!= null ? row.outwardremarks : "";
                        if (remarks == "" && tagremarks == "" ) {
                            return outwordremks;
                        } else {
                            if(tagremarks!=""){
                                tagremarks=   tagremarks+". <strong>"+moment.utc(local.filetagcommitted_at).format("DD/MM/YYYY HH:mm")+" "+local.filetagcommitted_by.name+"</strong>"+ "<div class='separator separator-dashed mt-8 mb-5'></div>";
                            }
                            if(remarks!=""){
                                remarks=   remarks+". <strong>"+moment.utc(local.inwardcommited_at).format("DD/MM/YYYY HH:mm")+" "+local.inwardcommited_by.name+"</strong>"+ "<div class='separator separator-dashed mt-8 mb-5'></div>";
                               }
                            var remarksfinal =remarks  + " " +tagremarks;
                            return outwordremks + '&nbsp <a type="button" class="btn" data-container="body" data-toggle="popover" data-original-title="Remarks" data-html="true" data-placement="left" data-content="' + remarksfinal + '" onmouseover="popover(this)"  onmouseout="remocepopover(this)"><i class="icon-md fas fa-exclamation"></i> </a>';
                          
                        }
                    }
                }],
        }).sort("crn", "asc");;
    };
    // demo initializer
    var mainTableInitpending = function (batchdata) {
        pandingdatatable = $('#kt_datatable_pending').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url:  '/batchesfindAllbyCreatedbyReceive.dwf/2',
                        method:'GET',
                        // sample custom headers
                        // headers: {'x-my-custom-header': 'some value', 'x-test-header': 'the value'},
                        map: function(raw) {
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
                saveState:false,
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
            },{
                field: 'checkbox',
                title: '',
                template: '{{id}}',
                sortable: false,
                width: 20,
                textAlign: 'center',
                selector: {class: 'kt-checkbox--solid'},
            }, {
                field: 'bundlenumber',
                title: 'Batch ID',
               
            }, {
                field: 'Total Cases',
                title: 'Total Cases',
                
                template: function (row) {
                    return row.firs.length;
                }
            },{
                field: 'outwardcommited_by',
                title: 'Dispatcher',
               
                template: function (row) {
                    return row.outwardcommited_by.name
                }
            } , {
                field: 'deliveryschedule',
                title: 'Scheduled Delivery date',
               
                template: function (row) {
                    return moment.utc(row.deliveryschedule).format("DD/MM/YYYY")
                }
            }, {
                field: 'returndate',
                title: 'Actual Return date',
               
                template: function (row) {
                    return moment.utc(row.returndate).format("DD/MM/YYYY")
                }
            },{
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
var KTDatatablesDataSourceAjaxClient = function () {

    var initTable1 = function (data) {

        datatable = $('#kt_datatable').DataTable({
            responsive: true,
            "ordering": true,
            "searching": false,
            "bAutoWidth": false,
            "bPaginate": false,
            data: data,
            "orderFixed": [ 1, 'asc' ],
            "columns": [
                {
                    data: 'inwardstatus',
                    title: 'Acceptance Status',
                    render: function (data, type, full, meta) {
                        var status = {
                           0: { 'title': 'Pending', 'class': 'bg-warning-o-50  text-warning' },
                            1: { 'title': 'Accepted', 'class': ' text-green' },
                            2: { 'title': 'Rejected', 'class': 'bg-danger-o-50 text-danger' },
                        };
                        return '<span class="label ' + status[full.inwardstatus].class + ' label-inline font-weight-bold label-lg">' + status[full.inwardstatus].title + '</span>';
                    }
                },
                
                {data: 'crn'},
                { data: 'year',
                 render: function (data, type, full, meta) {
                    console.log(full)
                    return full.casetype+"_"+full.caseno+"_"+full.year;
                }
                },
                { data: 'pagecount'},
                {data: 'firremarks',
                    render: function (data, type, full, meta) {
                        return full.firremarks == null ? "" : full.firremarks;
                    }    
                },
                
                {
                    data: 'receiveremarks',
                    render: function (data, type, full, meta) {
                       
                        var digiremarks = full.receiveremarks == null ? "" : full.receiveremarks;
                        if(full.inwardstatus==2){
                            return full.firinwardremarks;
                        }else{
                        return '<div class=" form-group"><textarea tabindex="' + tabindex + '" name="receiveremarks' + full.id + '"  id="receiveremarks' + full.id + '" class="  form-control" placeholder=""  rows="3">' + digiremarks + '</textarea></div>';
                        }
                    }
                },{ data: 'caseno',
                render: function (data, type, full, meta) {
                   
                    if (full.inwardstatus != 2) {
                        if(full.problematiceFIR){
                            return   '<a tabindex="' + tabindex + '" onclick="updateFIR(this,1,' + full.id + ')"  class="editbtn btn btn-icon btn-light font-weight-bolder btn-hover-primary btn-sm" title="Update Case" onkeypress="return runScript(event,this);"><i class="flaticon-refresh text-dark icon-md"></i></a>&nbsp\
                            <a tabindex="' + tabindex + '" onclick="updateFIR(this,3,' + full.id + ')" id="problematic'+full.id+'"  class=" btn btn-icon btn-light font-weight-bolder btn-hover-primary btn-sm" title="Update Case" onkeypress="return runScript(event,this);"><i class="flaticon-warning-sign text-warning icon-md"></i></a>\
                            <a style="display:none" tabindex="' + tabindex + '" onclick="updateFIR(this,2,' + full.id + ')"  id="noproblem'+full.id+'"  class="editbtn btn btn-icon btn-light font-weight-bolder btn-hover-primary btn-sm" title="Problematic Case" onkeypress="return runScript(event,this);"><i class="flaticon-warning-sign text-dark icon-md"></i></a>';
                             
                         }else{
                            return  '<a tabindex="' + tabindex + '" onclick="updateFIR(1,' + full.id + ')"  class="editbtn btn btn-icon btn-light font-weight-bolder btn-hover-primary btn-sm" title="Update Case" onkeypress="return runScript(event,this);"><i class="flaticon-refresh text-dark icon-md"></i></a>&nbsp\
                            <a style="display:none" tabindex="' + tabindex + '" onclick="updateFIR(this,3,' + full.id + ')" id="problematic'+full.id+'"  class="editbtn btn btn-icon btn-light font-weight-bolder btn-hover-primary btn-sm" title="Update Case" onkeypress="return runScript(event,this);"><i class="flaticon-warning-sign text-warning icon-md"></i></a>\
                            <a tabindex="' + tabindex + '" onclick="updateFIR(this,2,' + full.id + ')" id="noproblem'+full.id+'" class="editbtn btn btn-icon btn-light font-weight-bolder btn-hover-primary btn-sm" title="Problematic Case" onkeypress="return runScript(event,this);"><i class="flaticon-warning-sign text-dark icon-md"></i></a>';
                         }
                    } else {
                        return ' ';
                    }
               }
            }

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

function genrateBarCode(dom,id){
   // $(dom).addClass('spinner spinner-white spinner-right');
    var selectedBatchs=[];
    selectedBatchs.push(id)
    pushtoSrever({'selectedBatches':selectedBatchs}, "/barcodeReportPrint.dwf", "GET", function (node) {
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
    pushtoSrever(null, "/ReceiveBatchCommit.dwf/" + parseInt($('#batchiddp').val()), "PUT", function (node) {
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
function updateFIR(dom,type,firid) {
    $('.fv-plugins-message-container').remove();
    const receiveremarks = {
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
    if(type==2){
        validator.addField("receiveremarks" + firid, receiveremarks);
    }else{
        $('#firinwardremarks'+firid).removeClass('is-invalid')
       // validator.removeField("firinwardremarks" + firid, firinwardremarks);
    }
   
    validator.validate().then(function (status) {
       
        if (status != "Invalid") {
            var fir =
            {
                receiveremarks: $("#receiveremarks" + firid).val(),
                problematiceFIR: type == 2 ? true :false,
            };
            pushtoSrever(fir, "/ReceiveFIRUpdate.dwf/" + firid, "PUT", function (node) {
                if (node.data != null) {
                  if(type==2){
                    $(dom).hide();
                    $('#problematic'+firid).show()

                  }else if(type==3){
                    $(dom).hide();
                    $('#noproblem'+firid).show()
                  }
                    toastr.success(" Case updated successfully.")
                } else {
                    toastr.error("Problem in updating Case.")
                }
            })
        }
    });
}
var firtablerefe = 1;

function receivedBatch(id) {
    pushtoSrever(null, "/ReceiveBatchReceive.dwf/" + id, "GET", function (node) {
        if (node.status) {
            $('#batchiddp').val(id);
           
            if (firtablerefe == 1) {
                firtablerefe = 2;
                KTDatatablesDataSourceAjaxClient.init(node.data.firs)
                // KTDatatableDataLocalDemo.init(node.data.firs);
            } else {
                datatable.destroy();
                KTDatatablesDataSourceAjaxClient.init(node.data.firs)
                // KTDatatableDataLocalDemo._rendareTable(node.data.firs)
            }
                                            
           // $('#district').html(node.data.created_by_d2.policestation.district.district);
            //$('#ps').html(node.data.created_by_d2.policestation.ps);
            //$('#ps_cd').html(node.data.created_by_d2.policestation.ps_cd);

            $('#totalFIR').html(node.data.firs.length);
            $('#batchname').html(node.data.bundlenumber);
            $('#batchdispatcher').html(node.data.outwardcommited_by.name);
            $('#receiptdate').html(moment.utc(node.data.outwardcommited_at).format("DD/MM/YYYY"));
            $('#usercontact').html(node.data.outwardcommited_by.contactnumber == null ? "" : node.data.outwardcommited_by.contactnumber);
            $('#usermail').html(node.data.outwardcommited_by.email == null ? "" : node.data.outwardcommited_by.email);
            $('.containbatch').show(500);
        } else {
            toastr.error("batch already received by another user");
        }
    })
}
function cancleCommitBatch() {
    $('.containbatch').hide();
}
function bulkCommit(type){
    
    var selectedBatch=[];
    KTApp.blockPage({
		overlayColor: '#000',
		state: 'danger',
		message: 'Please wait...'
    });
    if(type==1){
        $('div#kt_datatable_delayed   input[type=checkbox]').each(function() {
            if ($(this).is(":checked")) {
                if($(this).attr('value')!=undefined)
                     selectedBatch.push($(this).attr('value'));
            }
          
        });
    }else if(type==2){
        $('div#kt_datatable_pending   input[type=checkbox]').each(function() {
            if ($(this).is(":checked")) {
                if($(this).attr('value')!=undefined)
                     selectedBatch.push($(this).attr('value'));
            }
          
        });
    }
    
    if(selectedBatch.length==0){
        toastr.error('Select  atleast one batch!');
        KTApp.unblockPage();
        return false;
    }else{
        pushtoSrever({'selectedBatches':selectedBatch}, "/bulkReturnOnBatch.dwf", "GET", function (node) {
            KTApp.unblockPage();
            if(node.data.status){
                toastr.success("Retrun  Batches successfully");
                location.reload()
            }else{
                toastr.error("problem in retruning Batches");
            }
           
        })
    }
    
		
}
function popover(dom){
    $('[data-toggle="popover"]').popover();
    
}

function remocepopover(dom){
    $('.popover ').popover('hide')

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