'use strict';
// Class definition
var datatable = null;
var editDatatable = null;
var validator;
var FormId = "firForm";
var casefile_ia_status=['PENDING', 'LIVE', 'DISPOSED'];
var State=['KERALA'];
var District=['ALAPPUZHA','ERNAKULAM','IDUKKI','KANNUR','KASARAGOD','KOCHI','KOLLAM','KOTTAYAM','KOZHIKODE','MALAPPURAM','PALAKKAD','PATHANAMTHITTA','THIRUVANANTHAPURAM','THRISSUR','WAYANAD'];
var Name_of_court=[];
var Name_of_transferee_court=[];
var Name_of_transferor_court=[];
function filldropdowns() {
    var options = '';
    casefile_ia_status.forEach(function(status) {
        options += '<option value="' + status + '">' + status + '</option>';
    });
    $('#casefile_ia_status').html(options);
    
    var options = '';
    Name_of_court.forEach(function(court) {
        options += '<option value="' + court + '">' + court + '</option>';
    });
    $('#casefile_trailcase_courtname').html(options);
    
    var options = '';
    Name_of_transferee_court.forEach(function(court) {
        options += '<option value="' + court + '">' + court + '</option>';
    });
    $('#casefile_transfercase_transfereecourt').html(options);
    
    var options = '';
    Name_of_transferor_court.forEach(function(court) {
        options += '<option value="' + court + '">' + court + '</option>';
    });
    $('#casefile_transfercase_transferorcourt').html(options);



    var options = '';
    State.forEach(function(state) {
        options += '<option value="' + state + '">' + state + '</option>';
    });
    $('#casefile_case_nameofstate').html(options);
    
    var options = '';
    District.forEach(function(district) {
        options += '<option value="' + district + '">' + district + '</option>';
    });
    $('#casefile_fir_district').html(options);
}


function metadatamasterlist() {
    pushtoSrever(null, "/metadatamasterlist.dwf", "GET", function (node) {
        let data = node.data;
        //$('#demo').attr('metadata', data.find(item => item.entityname == "demo").id);
        $('#casefile_case_registrationdate').attr('metadata', data.find(item => item.entityname == "casefile.case.registrationdate").id);
        $('#casefile_case_cnrnumber').attr('metadata', data.find(item => item.entityname == "casefile.case.cnrnumber").id);
        $('#casefile_status_dateofdisposal').attr('metadata', data.find(item => item.entityname == "casefile.status.dateofdisposal").id);
        $('#casefile_case_firsthearingdate').attr('metadata', data.find(item => item.entityname == "casefile.case.firsthearingdate").id);

        $('#casefile_caveat_caveatnumber').attr('metadata', data.find(item => item.entityname == "casefile.caveat.caveatnumber").id);
        $('#casefile_caveat_registrationdate').attr('metadata', data.find(item => item.entityname == "casefile.caveat.registrationdate").id);
        $('#casefile_caveat_caveatorname').attr('metadata', data.find(item => item.entityname == "casefile.caveat.caveatorname").id);
        $('#casefile_caveat_caveateename').attr('metadata', data.find(item => item.entityname == "casefile.caveat.caveateename").id);

        $('#casefile_petitioner_organization').attr('metadata', data.find(item => item.entityname == "casefile.petitioner.organization").id);
        $('#casefile_petitioner_name').attr('metadata', data.find(item => item.entityname == "casefile.petitioner.name").id);
        $('#casefile_petitioner_age').attr('metadata', data.find(item => item.entityname == "casefile.petitioner.age").id);
        $('#casefile_petitioner_gender').attr('metadata', data.find(item => item.entityname == "casefile.petitioner.gender").id);
        $('#casefile_petitioner_address').attr('metadata', data.find(item => item.entityname == "casefile.petitioner.address").id);
        $('#casefile_petitioner_emailid').attr('metadata', data.find(item => item.entityname == "casefile.petitioner.emailid").id);
        $('#casefile_petitioner_phonenumber').attr('metadata', data.find(item => item.entityname == "casefile.petitioner.phonenumber").id);
        $('#casefile_advocate_petitioner').attr('metadata', data.find(item => item.entityname == "casefile.advocate.petitioner").id);

        $('#casefile_respondent_organization').attr('metadata', data.find(item => item.entityname == "casefile.respondent.organization").id);
        $('#casefile_respondent_name').attr('metadata', data.find(item => item.entityname == "casefile.respondent.name").id);
        $('#casefile_respondent_age').attr('metadata', data.find(item => item.entityname == "casefile.respondent.age").id);
        $('#casefile_respondent_gender').attr('metadata', data.find(item => item.entityname == "casefile.respondent.gender").id);
        $('#casefile_respondent_address').attr('metadata', data.find(item => item.entityname == "casefile.respondent.address").id);
        $('#casefile_respondent_emailid').attr('metadata', data.find(item => item.entityname == "casefile.respondent.emailid").id);
        $('#casefile_respondent_phonenumber').attr('metadata', data.find(item => item.entityname == "casefile.respondent.phonenumber").id);
        $('#casefile_advocate_respondent').attr('metadata', data.find(item => item.entityname == "casefile.advocate.respondent").id);

        $('#casefile_case_actname').attr('metadata', data.find(item => item.entityname == "casefile.case.actname").id);
        $('#casefile_act_section').attr('metadata', data.find(item => item.entityname == "casefile.act.section").id);

        $('#casefile_case_nameofstate').attr('metadata', data.find(item => item.entityname == "casefile.case.nameofstate").id);
        $('#casefile_fir_district').attr('metadata', data.find(item => item.entityname == "casefile.fir.district").id);
        $('#casefile_fir_taluka').attr('metadata', data.find(item => item.entityname == "casefile.fir.taluka").id);
        $('#casefile_fir_policestationname').attr('metadata', data.find(item => item.entityname == "casefile.fir.policestationname").id);
        $('#casefile_fir_number').attr('metadata', data.find(item => item.entityname == "casefile.fir.number").id);
        $('#casefile_fir_chargesheetdate').attr('metadata', data.find(item => item.entityname == "casefile.fir.chargesheetdate").id);

        $('#casefile_trailcase_courtname').attr('metadata', data.find(item => item.entityname == "casefile.trailcase.courtname").id);
        $('#casefile_trailcase_dateofdecision').attr('metadata', data.find(item => item.entityname == "casefile.trailcase.dateofdecision").id);

        $('#casefile_transfercase_typename').attr('metadata', data.find(item => item.entityname == "casefile.transfercase.typename").id);
        $('#casefile_transfercase_transfereecourt').attr('metadata', data.find(item => item.entityname == "casefile.transfercase.transfereecourt").id);
        $('#casefile_transfercase_transferorcourt').attr('metadata', data.find(item => item.entityname == "casefile.transfercase.transferorcourt").id);
        $('#casefile_fir_dateofcrimeregistered').attr('metadata', data.find(item => item.entityname == "casefile.fir.dateofcrimeregistered").id);

        $('#casefile_ia_typename').attr('metadata', data.find(item => item.entityname == "casefile.ia.typename").id);
        $('#casefile_maincase_typename').attr('metadata', data.find(item => item.entityname == "casefile.maincase.typename").id);
        $('#casefile_ia_fillingdate').attr('metadata', data.find(item => item.entityname == "casefile.ia.fillingdate").id);
        $('#casefile_ia_petname').attr('metadata', data.find(item => item.entityname == "casefile.ia.petname").id);
        $('#casefile_ia_petaddress').attr('metadata', data.find(item => item.entityname == "casefile.ia.petaddress").id);
        $('#casefile_ia_resname').attr('metadata', data.find(item => item.entityname == "casefile.ia.resname").id);
        $('#casefile_ia_resaddress').attr('metadata', data.find(item => item.entityname == "casefile.ia.resaddress").id);
        $('#casefile_ia_dateoffilling').attr('metadata', data.find(item => item.entityname == "casefile.ia.dateoffilling").id);
        $('#casefile_ia_status').attr('metadata', data.find(item => item.entityname == "casefile.ia.status").id);
        $('#casefile_ia_dateofdecision').attr('metadata', data.find(item => item.entityname == "casefile.ia.dateofdecision").id);


        $('#casefile_petitioner_rank').attr('metadata', data.find(item => item.entityname == "casefile.petitioner.rank").id);
        $('#casefile_petitioner_pincode').attr('metadata', data.find(item => item.entityname == "casefile.petitioner.pincode").id);
        $('#casefile_respondent_rank').attr('metadata', data.find(item => item.entityname == "casefile.respondent.rank").id);
        $('#casefile_respondent_pincode').attr('metadata', data.find(item => item.entityname == "casefile.respondent.pincode").id);







    })
}
function getdeliveryBatch() {
    setTimeout(() => {
        deliveryDatatable.init();
        // pushtoSrever(null, "/batchesfindAllbyCreatedby.dwf/3", "GET", function (node) {
        //     deliveryDatatable.init(node.data);
        // })
    }, 200);
}
function getdelayedBatch() {
    setTimeout(() => {
        delayedDatatable.init();
        // pushtoSrever(null, "/batchesfindAllbyCreatedby.dwf/1", "GET", function (node) {
        //     delayedDatatable.init(node.data);
        // })
    }, 200);
}
function getpendingBatch() {
    setTimeout(() => {
        pandingDatatable.init();
        // pushtoSrever(null, "/batchesfindAllbyCreatedby.dwf/2", "GET", function (node) {
        //     pandingDatatable.init(node.data);
        // })
    }, 200);
}
var deliveryDatatable = function () {
    // Private functions
    var subTableInit = function (e) {
        var local = e.data;
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
                    field: 'est_code',
                    title: 'Establishment Name',
                }, {
                    field: 'remarks',
                    title: 'Remarks',
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
                            var remarksfinal = tagremarks + "" + outwordremks;
                            return remarks + '&nbsp <a type="button" class="btn" data-container="body" data-toggle="popover" data-original-title="Remarks" data-html="true" data-placement="left" data-content="' + remarksfinal + '" onmouseover="popover(this)"  onmouseout="remocepopover(this)"><i class="icon-md fas fa-exclamation"></i> </a>';

                        }
                    }
                }, {
                    field: 'Action',
                    title: 'Action',
                    template: function (row) {
                        return '<a onclick="viewHistory(' + row.id + ')"  class="editbtn btn btn-icon btn-light btn-hover-primary btn-sm" title=""><i class="fa  fa-info-circle text-dark icon-nm"></i></a>';
                    }
                }],
        }).sort("crn", "asc");;
    };
    // demo initializer
    var mainTableInit = function (batchdata) {
        var delivertdatatable = $('#kt_datatable_delivered').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: '/batchesfindAllbyCreatedby.dwf/3',
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
                field: 'created_at_d2',
                title: 'Creation Date',

                template: function (row) {
                    return moment(row.created_at_d2).format("DD/MM/YYYY hh:mm A");
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
                field: 'inwardcommited_by',
                title: 'Received by',

                template: function (row) {
                    return row.inwardcommited_by.name;
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
            }],
        });
    };
    return {
        // Public functions
        init: function (batchdata) {
            // init dmeo
            mainTableInit(batchdata);
        },
    };
}();
var delayedDatatable = function () {
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
                    field: 'est_code',
                    title: 'Establishment Name',
                }, {
                    field: 'remarks',
                    title: 'Remarks',
                }],
        }).sort("crn", "asc");;
    };
    // demo initializer
    var mainTableInit = function (batchdata) {
        var delayeddatatable = $('#kt_datatable_delayed').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: '/batchesfindAllbyCreatedby.dwf/1',
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
                width: 80,
                template: function (row) {
                    return row.firs.length;
                }
            }, {
                field: 'created_at_d2',
                title: 'Creation Date',
                width: 125,
                sortable: false,
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
                title: 'Action',
                overflow: 'visible',
                autoHide: false,
                width: 100,
                template: function (row) {
                    return '<a onclick="editBatch(' + row.id + ')"  class="editbtn btn btn-icon btn-light btn-hover-primary btn-sm" title=""><i class="fa fa-list-alt text-dark icon-nm"></i></a>';
                }
            }],
        });
    };
    return {
        // Public functions
        init: function (batchdata) {
            // init dmeo
            mainTableInit(batchdata);
        },
    };
}();
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
                    field: 'est_code',
                    title: 'Establishment Name',
                }, {
                    field: 'remarks',
                    title: 'Remarks',
                }],
        }).sort("crn", "asc");;
    };
    // demo initializer
    var mainTableInit = function (batchdata) {
        var pandingdatatable = $('#kt_datatable_pending').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: '/batchesfindAllbyCreatedby.dwf/2',
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
                title: 'Action',
                overflow: 'visible',
                autoHide: false,
                width: 100,
                template: function (row) {
                    return '<a onclick="editBatch(' + row.id + ')"  class="editbtn btn btn-icon btn-light btn-hover-primary btn-sm" title=""><i class="fa fa-list-alt text-dark icon-nm"></i></a>';
                }
            }],
        });
    };
    return {
        // Public functions
        init: function (batchdata) {
            // init dmeo
            mainTableInit(batchdata);
        },
    };
}();
function retrunjson(fieldarry, callback) {
    var jsonform = {};

    $('#' + FormId + ' input[type="checkbox"]:not(:checked)').each(function () {
        jsonform[this.name] = this.value
    })
    $.each(fieldarry, function () {
        jsonform[this.name] = this.value
    })
    callback(jsonform);
}
var tabindex = 1;
function updateFIR(firid) {
    $('#kt_datatable_edit  .fv-plugins-message-container').remove();
    const crn = {
        validators: {
            notEmpty: {
                message: 'Mandatory field'
            }
        }
    };
    const year = {
        validators: {
            notEmpty: {
                message: 'Mandatory field'
            }, stringLength: {
                max: 4,
                min: 4,
                message: 'Year is not Vaild'
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
    var validator1 = FormValidation.formValidation(
        document.getElementById('firForm2'),
        {
            fields: {
            }, plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                bootstrap: new FormValidation.plugins.Bootstrap(),
            }
        }
    );

    validator1.addField("crn" + firid, crn)

    validator1.validate().then(function (status) {
        //console.log(status)
        if (status != "Invalid") {
            $('#crn' + firid).removeClass('is-valid');

            var fir =
            {
                remarks: $("#firinwardremarks" + firid).val(),
                crn: $('#crn' + firid).val(),
                pagecount: $('#pagecount' + firid).val(),
                itemid: $('#itemid' + firid).val(),
                year: $('#year' + firid).val(),
                casetype: $('#casetype' + firid).val(),
                caseno: $('#caseno' + firid).val(),

            };
            pushtoSrever(fir, "/firUpdate.dwf/" + firid, "PUT", function (node) {
                if (node.data != null) {

                    toastr.success(" Case updated successfully.")
                } else {
                    toastr.error("Problem in updating Case.")
                }
            })
        }
    });
}
function editBatch(id) {
    pushtoSrever(null, "/editBatch.dwf/" + id, "GET", function (node) {
        if (node.status) {
            // console.log(node);
            $('#datePicker').datepicker('destroy');
            $('#datePicker').datepicker({
                format: "dd/mm/yyyy",
                rtl: KTUtil.isRTL(),
                todayBtn: "linked",
                todayHighlight: true,
                templates: arrows,
                autoclose: true,
                startDate: moment.utc(node.data.deliveryschedule).format('DD/MM/YYYY')
            }).datepicker("update", moment.utc(node.data.deliveryschedule).format('DD/MM/YYYY'));
            $('#deliveryschedule').val(moment.utc(node.data.deliveryschedule).format('DD/MM/YYYY'));
            editafter = 2;
            tabindex = 1;

            $('#gapbatch').val((node.data.gapbatch == null || !node.data.gapbatch) ? "false" : node.data.gapbatch);
            $('#gapbatch').prop('checked', (node.data.gapbatch == null || !node.data.gapbatch) ? false : node.data.gapbatch)

            $('#commitBatchButton').attr("disabled", false)
            $('#cancleButton').attr("disabled", false)
            $('.adddivfir').hide();
            $('.editdiv').show();
            $('#firCounts').html(node.data.firs.length)
            var firss = node.data.firs;
            firss.sort(GetSortOrder("crn"));
            if (editDatatable == null) {


                KTDatatablesDataSourceAjaxClient.init(firss)
            } else {
                editDatatable.destroy();
                KTDatatablesDataSourceAjaxClient.init(firss)
            }

        } else {
            toastr.error("batch already received by another user");
        }
    });
}
function numberOnly(dom) {
    $(dom).val($(dom).val().replace(/[^0-9]/g, ''));
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
function GetSortOrder(prop) {
    return function (a, b) {
        if (a[prop] > b[prop]) {
            return 1;
        } else if (a[prop] < b[prop]) {
            return -1;
        }
        return 0;
    }
}
function validateFILE() {
    var casetype = $('#casetypesearch').val();
    var year = $('#yearsearch').val();
    var caseno = $('#casenosearch').val();
    if (caseno != "" && year != "" && casetype != "") {
        var obj = {
            caseno: caseno,
            caseyear: year,
            casetype: casetype
        }
        pushtoSrever(obj, "/isvalidFIR.dwf", "POST", function (node) {
            if (!node.status) {
                toastr.error(casetype + "/" + year + "/" + caseno + " file already exists in  batch " + node.data.batch.bundlenumber);

            }
        });
    }
}
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
function findcrnByCaseTypenoyear() {

    // validateFILE();
    if ($('#casetypesearch').val() != null && $('#casenosearch').val().length > 0 && $('#yearsearch').val().length > 0 && $('#establishmentsearch').val() != "") {
        var url = "?casetype=" + $('#casetypesearch').val() + "&caseno=" + $('#casenosearch').val() + "&caseyear=" + $('#yearsearch').val() + "&est_code=" + $('#establishmentsearch').val();
        $('.dataloadfromdms').show();
        pushtoSrever(null, "/getCasetypecaenoyearDMS.dwf" + url, "GET", function (node) {
            $('.dataloadfromdms').hide();
            if (!node.status) {

                toastr.error(node.data);
            } else {

                 $("#casefile_case_registrationdate")
        .datepicker("setDate", node.data.dt_regis);
                $('#casefile_case_cnrnumber').val(node.data.cino);
                $("#casefile_case_firsthearingdate")
        .datepicker("setDate", node.data.date_first_list);
                $("#casefile_status_dateofdisposal")
        .datepicker("setDate", node.data.date_of_decision);


                $('#casefile_fir_policestationname').val(node.data.police_station);
                $('#casefile_case_nameofstate').val(node.data.state_name);
                $('#casefile_fir_district').val(node.data.dist_name);
                $('#casefile_fir_number').val(node.data.fir_no + "_" + node.data.fir_year);


                var actsArray = $.map(node.data.acts, function (value, key) {
                    return value;
                });


                let Act = "";
                let section = "";
                actsArray.forEach(function (item) {
                    Act = Act + item.actname + " || ";
                    section = section + item.section + " || "
                });
                $('#casefile_case_actname').val(Act);
                $('#casefile_act_section').val(section);
                var iafillingArray = $.map(node.data.iafiling, function (value, key) {
                    return value;
                });
                // var iafillingArray = $.map(node.data.historyofcasehearing, function (value, key) {
                //     return value;
                // });
                let iano = "";
                let iapet_name = "";
                let iadate_of_fill = "";
                let ia_pend_disp = "";
                iafillingArray.forEach(function (item) {
                    iano = iano + item.ia_number + " || ";
                    iapet_name = iapet_name + item.ia_pet_name + " || ";
                    iadate_of_fill = iadate_of_fill + item.date_of_filing + " || ";
                    ia_pend_disp = ia_pend_disp + item.ia_pend_disp + " || ";
                });
                $('#casefile_ia_typename').val(iano);
                $('#casefile_ia_petname').val(iapet_name);
                $('#casefile_ia_fillingdate').val(iadate_of_fill);
                $('#casefile_ia_status').val(ia_pend_disp);

                var pet_extra_partyarray = $.map(node.data.pet_extra_party, function (value, key) {
                    return value;
                });
                let pet_extra_party = "";
                pet_extra_partyarray.forEach(function (item) {
                    pet_extra_party = pet_extra_party + " || " + item;
                });
                $('#casefile_petitioner_name').val(node.data.pet_name + "" + pet_extra_party);

                var res_extra_partyaaray = $.map(node.data.res_extra_party, function (value, key) {
                    return value;
                });
                let res_extra_party = "";
                res_extra_partyaaray.forEach(function (item) {
                    res_extra_party = res_extra_party + " || " + item;
                });
                $('#casefile_respondent_name').val(node.data.res_name + "" + res_extra_party);
            }
        })
    } else {
        toastr.error("Enter Case Type and Case No and Case Year for search .");
    }
}

function getcasetype() {
    if ($('#establishmentsearch').val() != "") {
        pushtoSrever(null, "/getcasetypebyEsticode.dwf/" + $('#establishmentsearch').val(), "GET", function (node) {
            let option = "";
            for (let data of node.data) {
                option = option + "<option value='" + data.case_type + "'>" + data.type_name + "</option>"
            }
            $('#casetypesearch').html(option)
        })
    } else {

    }

}

var KTDatatablesDataSourceAjaxClient = function () {

    var initTable1 = function (data) {

        editDatatable = $('#kt_datatable_edit').DataTable({
            responsive: true,
            "ordering": false,
            "searching": false,
            "bAutoWidth": false,
            "bPaginate": false,

            data: data,
            "columns": [

                {
                    data: 'crn',
                    render: function (data, type, full, meta) {
                        return '<div class=" form-group"><input type="text" tabindex="' + tabindex + '" name="crn' + full.id + '" id="crn' + full.id + '"  class="   form-control" value="' + full.crn + '"orignalvalue="' + full.crn + '" onkeyup="findcrndy(' + full.id + ')"> <ul id="search-results' + full.id + '" class="list-group searchcrn"  style="cursor: pointer;display: none;"> <li id="noducment' + full.id + '" style="display: nonne;"><strong>No CNR(s) Found </strong></li></ul> <input type="hidden" tabindex="' + tabindex + '" name="itemid' + full.id + '" id="itemid' + full.id + '"  class="   form-control" value="' + full.itemid + '"orignalvalue="' + full.itemid + '"></div>';
                    }
                },
                {
                    data: 'caseno',
                    render: function (data, type, full, meta) {
                        return '<div class=" form-group"><label  id="casetypeno' + full.id + '"  class="form-control"  >' + full.casetype + '_' + full.caseno + '_' + full.year + ' </label> <input type="hidden" tabindex="' + tabindex + '" name="casetype' + full.id + '" id="casetype' + full.id + '"  class="   form-control" value="' + full.casetype + '"orignalvalue="' + full.casetype + '"><input type="hidden" tabindex="' + tabindex + '" name="caseno' + full.id + '" id="caseno' + full.id + '"  class="   form-control" value="' + full.caseno + '"orignalvalue="' + full.caseno + '"><input type="hidden" tabindex="' + tabindex + '" name="year' + full.id + '" id="year' + full.id + '" onfocusout="yearvalidate(this)" onpaste=="numberOnly(this)"  onkeyup="numberOnly(this)"  class=" year numberOnly form-control" maxlength="4" value="' + full.year + '" ></div>';
                    }
                },

                {
                    data: 'est_code',
                    render: function (data, type, full, meta) {
                        return '<div class=" form-group"><input type="text" tabindex="' + tabindex + '" name="est_code" id="est_code' + full.id + '" class="  numberOnly form-control"  value="' + full.est_code + '"></div>';

                    }
                },

                {
                    data: 'remarks',
                    render: function (data, type, full, meta) {

                        var digiremarks = full.remarks == null ? "" : full.remarks;
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
function pushtoSrever(pushObject, url, method, callback) {

    $.ajax({
        async: true,
        type: method,
        dataType: 'json',
        url: url,
        data: pushObject,
        success: function (response) {
            // KTApp.unblockPage()
            //toastr.success('Data InserteId Successfully!');                
            callback(response);
        },
        error: function (response) {
            // KTApp.unblockPage()
            //toastr.error('Problem in Deleting Data!');
            console.log("error")
            callback(response)
        }
    });
}
var checksubmitStatus = 1;
function sumbitFIR() {
    let metadatavalueArray = [];
    if ($('#casetypesearch').val() != "" && $('#casenosearch').val() && $('#yearsearch').val()) {
        $('.metadatafir').find('input[type=text], select').each(function () {
            metadatavalueArray.push({ id: $(this).attr('metadata'), value: $(this).val()==null ? '' : $(this).val() })

        });
        console.log('metadatavalueArray:' + metadatavalueArray);
        let formdata = {
            casetype: $("#casetypesearch option:selected").text().split(':')[0].trim(),
            caseno: $('#casenosearch').val(),
            year: $('#yearsearch').val(),
            crn: $('#casefile_case_cnrnumber').val(),
            est_code: $("#establishmentsearch option:selected").text().replace(/[&/'',]/g, ' ').replace(/\s+/g, ' ').trim(),
            metadata: JSON.stringify(metadatavalueArray)

        }
        if (checksubmitStatus == 1) {
            pushtoSrever(formdata, "firSave.dwf", "POST", function (node) {
                if (node.status) {
                    toastr.success("Case file save successfully.")
                    resetData();
                    datatable.destroy();
                    KTDatatableDataLocalDemo._rendareTable(node.data);
                } else {
                    toastr.error("Already exies in batch " + node.data.batch.bundlenumber)
                }
            })
        } else {
            pushtoSrever(formdata, "/firUpdate.dwf/" + editobj.id, "PUT", function (node) {
                if (node.status) {
                    editobj = "";
                    toastr.success(" Case file updated successfully.")
                    resetData();
                    datatable.destroy();
                    KTDatatableDataLocalDemo._rendareTable(node.data);
                } else {
                    toastr.error("Problem in updating  file.")
                }
            })
        }
    } else {
        toastr.error("* field are mandatory");
    }

}
var editafter = 1;
function cancelBatch() {
    if (editafter == 1) {
        pushtoSrever(null, "/delteFRIbyBatch.dwf", "DELETE", function (node) {
            if (node.data != null) {
                resetData();
                toastr.success("Batch Cancel  successfully.")
                datatable.destroy();
                KTDatatableDataLocalDemo._rendareTable(node.data);
            } else {
                toastr.error('Problem in Cancelling Batch!');
            }
        });
    } else {
        pushtoSrever(null, "/cancleBatch.dwf", "put", function (node) {
            location.reload()
        })


    }

}
function commitBatch() {
    if (editafter == 1) {
        retrunjson($('#batchcommitForm').serializeArray(), function (formdata) {
            formdata['departmentsearch'] = $('#departmentsearch').val();
            pushtoSrever(formdata, "/batchCommitUpdate.dwf/", "PUT", function (node) {
                if (node.data != null) {
                    toastr.success(" Batch committed successfully.")

                    location.reload()
                    // resetData();
                    // datatable.destroy();
                    // KTDatatableDataLocalDemo._rendareTable(node.data);
                } else {
                    toastr.error("Problem in updating data.")
                }
            })
        });

    } else {
        //  
        retrunjson($('#batchcommitForm').serializeArray(), function (formdata) {
            formdata['departmentsearch'] = $('#departmentsearch').val();
            pushtoSrever(formdata, "/editupdateBatch.dwf", "put", function (node) {
                if (node.data != null) {
                    toastr.success(" Batch committed successfully.")
                    location.reload()
                    // resetData();
                    // datatable.destroy();
                    // KTDatatableDataLocalDemo._rendareTable(node.data);
                } else {
                    toastr.error("Problem in updating data.")
                }
            })
        })
    }
}
function resetData() {
    checksubmitStatus = 1;
    DeleteObject = "";
   
    $('#' + FormId).find("input[type=text],textarea,input[type=hidden]").val("");
    $("#crn").focus();
    $('#casetypeno').html("")
    //$('#casetypesearch').val("").trigger('change');
    $('.metadatafir').find('input[type=text]').val("");
    $('#casenosearch').val("");
    // $('#yearsearch').val("");
    $('#petsiname').html("")
    $('#responame').html("")
    $('#addmenu').attr('value', 'Add File');
    $('#resetform').attr('value', 'Reset');
}
var editobj;


function viewHistory(id) {
    pushtoSrever(null, "/firHistory.dwf?id=" + id, "GET", function (node) {
        debugger;
        if (node.data == null || node.data.length == 0) {
            toastr.error('No change by receiver!');
        } else {
            var data = node.data[0];
            var tr = "";
            tr = " <tr><td>CNR</td><td>" + data.crn + "</td><td>" + data.fir.crn + "</td></tr>";
            tr = tr + " <tr><td>Year</td><td>" + data.year + "</td><td>" + data.fir.year + "</td></tr>";
            tr = tr + " <tr><td>Page Count</td><td>" + data.pagecount + "</td><td>" + data.fir.pagecount + "</td></tr>";


            $('#firtablehistory').html("");
            $('#firtablehistory').append(tr);
            $('#firhistoryModal').modal('show');
        }
    });
}
function editMenu(id) {
    checksubmitStatus = 2;
    $('#addmenu').attr('value', 'Update');
    $('#resetform').attr('value', 'Cancel');
    pushtoSrever(null, "/firEdit.dwf/" + id, "GET", function (node) {
        editobj = node.data;
        $('#crn').val(editobj.crn);
        $('#year').val(editobj.year);
        $('#caseno').val(editobj.caseno);
        $('#casetype').val(editobj.casetype);
        $('#casetypeno').html(editobj.casetype + "_" + editobj.caseno + "_" + editobj.year);
        $('#pagecount').val(editobj.pagecount);
        $('#remarks').val(editobj.remarks);
        $('#itemid').val(editobj.itemid);
        $("#crn").focus();


        $('.ckhform').map(function () {
            if ($(this).val() == "true") {
                $(this).prop('checked', true)
            } else {
                $(this).prop('checked', false)
            }
        })
        // datatable.destroy();
        // KTDatatableDataLocalDemo._rendareTable(node.data);
    });
}
var DeleteObject;
function readexcle() {
    pushtoSrever(null, "readDataFromExcle.dwf", "POST", function (node) {
    })
}
function popupdeleteMenu(domobjec, id) {
    DeleteObject = id;
    $('#ModalValue').html($(domobjec).closest('tr').find('td')[1].innerHTML);
    $('#deleteModal').modal('show');
}
function deletemenu() {
    pushtoSrever(null, "/firDelete.dwf/" + DeleteObject, "DELETE", function (node) {
        if (node.data != null) {
            resetData();
            toastr.success("Data delete successfully.")
            datatable.destroy();
            KTDatatableDataLocalDemo._rendareTable(node.data);
        } else {
            toastr.error('Problem in Deleting Data!');
        }
    });
}
var KTDatatableDataLocalDemo = function () {
    var rendareTable = function (dataJSONArray) {
        $('#firCounts').html(dataJSONArray.length)
        if (dataJSONArray.length != 0) {
            $('#commitBatchButton').attr("disabled", false)
            $('#cancleButton').attr("disabled", false)
        } else {
            $('#commitBatchButton').attr("disabled", true)
            $('#cancleButton').attr("disabled", true)
        }
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
            sortable: false,
            pagination: true,
            search: {
                input: $('#kt_datatable_search_query'),
                key: 'generalSearch',
                placeholder: 'Search Case'
            },
            columns: [{
                field: 'crn',
                title: 'CNR',
                width: 125,
            }, {
                field: 'year',
                width: 120,
                title: 'CaseNo',
                template: function (row) {
                    return row.casetype + "_" + row.caseno + "_" + row.year;
                }
            }, {
                field: 'est_code',
                title: 'Establishment Name',
                width: 110,
            }, {
                field: 'remarks',
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
                    return '<a onclick="popupdeleteMenu(this,' + row.id + ')" href="javascript:;" class="deletebtn btn btn-icon btn-light btn-hover-primary btn-sm" title="Delete"><i class="flaticon-delete text-danger icon-nm"></i></a>	';
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
            pushtoSrever(null, "/FIRGetAll.dwf", "GET", function (node) {
                rendareTable(node.data);
            })
        }
    };
}();
function GetDate() {
    let dateObj = new Date();
    let month = String(dateObj.getMonth() + 1).padStart(2, '0');
    let day = String(dateObj.getDate()).padStart(2, '0');
    let year = dateObj.getFullYear();
    return day + "/" + month + "/" + year;
}
function popover(dom) {
    $('[data-toggle="popover"]').popover()

}

function remocepopover(dom) {
    $('.popover ').popover('hide')

}
var datimepicker;
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
function selectedTree(dom) {

    $('#itemid').val($(dom).attr('id'))
    $('#crn').val($(dom).attr('crn'));
    $('#year').val($(dom).attr('caseyear'));
    $("#casetypeno").html($(dom).attr('casetype') + "_" + $(dom).attr('caseno') + "_" + $(dom).attr('caseyear'))
    $('#casetype').val($(dom).attr('casetype'));
    $('#caseno').val($(dom).attr('caseno'));
    $('#search-results').hide()
    $('#search-results').find('.crnli').remove();

}
jQuery(document).ready(function () {
    metadatamasterlist();
    $('#casetypesearch').select2({
        placeholder: "Select Case Type",
        allowClear: true
    });

    $('#establishmentsearch').select2({
        placeholder: "Select Establishment Code",
        allowClear: true
    });
    $('#casetypesearch').val("").trigger('change');

    $('#establishmentsearch').val("").trigger('change');
    getpendingBatch();

    resetData();



    $('#deliveryschedule').val(GetDate());
    $('#deliveryschedule').val(GetDate());
    $('#datePicker').datepicker({
        format: "dd/mm/yyyy",
        rtl: KTUtil.isRTL(),
        todayBtn: "linked",
        todayHighlight: true,
        templates: arrows,
        autoclose: true,
        startDate: moment.utc(new Date()).format('DD/MM/YYYY')
    });
    // $('#datepicker').datepicker('setStartDate',moment(new Date()).format('DD/MM/YYYY'));
    $('.numberOnly').bind('keyup paste', function () {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
    $('.year').focusout(function () {

        var current_year = new Date().getFullYear();
        if (parseInt(this.value) > current_year) {
            this.value = this.value.substr(0, this.value.length - 1);
            $(this).focus();
            toastr.error("Year should be less than current year")
        }
    });
    $('.year').keyup(function () {

        var current_year = new Date().getFullYear();
        if (parseInt(this.value) > current_year) {
            this.value = this.value.substr(0, this.value.length - 1);
            $(this).focus();
            toastr.error("Year should be less than current year")
        }
    });

    $(".ckhform").on('change', function () {
        if ($(this).is(':checked')) {
            $(this).attr('value', 'true');
        } else {
            $(this).attr('value', 'false');
        }


    });
    $(".datefromapicker").datepicker({
    format: "yyyy-mm-dd",
     autoclose: true
});
filldropdowns();

    pushtoSrever(null, "/FIRGetAll.dwf", "GET", function (node) {
        KTDatatableDataLocalDemo.init(node.data);
    })
});
