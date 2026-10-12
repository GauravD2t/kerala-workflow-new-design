'use strict';
// Class definition
var datatable = null;
var validator;
var submittype = 1;
var FormId = "menugroupForm";
function retrunjson(fieldarry, callback) {
    var jsonform = {};

    $.each(fieldarry, function () {
        jsonform[this.name] = this.value
    })
    callback(jsonform);
}
function pushtoSrever(pushObject, url, method, callback) {
    $.ajax({
        async: false,
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
var checksubmitStatus = 1;
function sumbitMenuGroup() {
    var status = validator.validate();
    if (status._result != "Invalid") {
        retrunjson($("#"+FormId).serializeArray(), function (formdata) {
        
            if (checksubmitStatus == 1) {
                pushtoSrever(formdata, "menugroups", "POST", function (node) {
                    if (node.data != null) {
                            toastr.success("Data save successfully.")
                         resetData();
                        datatable.destroy();
                        KTDatatableDataLocalDemo._rendareTable(node.data);
                    } else {
                        toastr.error("Problem in saving data.")
                       
                    }
    
                })
            }else{
            pushtoSrever(formdata, "/menugroupUpdate/" + editobj.id, "PUT", function (node) {
                if (node.data != null) {
                    editobj="";
                    toastr.success(" Data update successfully.")
                    resetData();
                    datatable.destroy();
                    KTDatatableDataLocalDemo._rendareTable(node.data);
                } else {
                    toastr.error("Problem in updating data.")
                   
                }

            })
        }
            

        })

    } else {
        toastr.error("Fill Data Required.")

    }
}

function resetData() {
    checksubmitStatus = 1;
    DeleteObject = "";
    $('#'+FormId).find("input[type=text],textarea,input[type=hidden]").val("");
     $('#addmenu').attr('value', 'Submit');
    $('#resetform').attr('value', 'Reset');

}

var editobj;
function editMenu(id) {
    checksubmitStatus = 2;
    $('#addmenu').attr('value', 'Update');
    $('#resetform').attr('value', 'Cancle');
    pushtoSrever(null, "/menugroupsEdit/" + id, "GET", function (node) {
        editobj=node.data;
        
        $('#menugroupname').val(node.data.menugroupname);
       
      
        // datatable.destroy();
        // KTDatatableDataLocalDemo._rendareTable(node.data);
    });
}
var DeleteObject;
function popupdeleteMenu(domobjec, id) {
    DeleteObject = id;
    $('#ModalValue').html($(domobjec).closest('tr').find('td')[1].innerHTML);
    $('#deleteModal').modal('show');
}
function deletemenu() {
    pushtoSrever(null, "/menugroups/" + DeleteObject, "DELETE", function (node) {
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
        datatable = $('#kt_datatable').KTDatatable({
            data: {
                type: 'local',
                source: dataJSONArray,
                pageSize: 10,
            },
            layout: {
                scroll: false, // enable/disable datatable scroll both horizontal and vertical when needed.              
                footer: false, // display/hide footer
            },
            sortable: true,
            pagination: true,
            search: {
                input: $('#kt_datatable_search_query'),
                key: 'generalSearch'
            },
            columns: [{
                field: 'menugroupname',
                title: 'Name',
                template: function (row) {
                    return "<span class='Groupname'>" + row.menugroupname + "</span>"
                }
            },{
                field: 'Actions',
                title: 'Actions',
                sortable: false,
                width: 125,
                overflow                : 'visible',
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
            pushtoSrever(null, "menugroup", "GET", function (node) {
                rendareTable(node.data);
            })
        }

    };
}();
jQuery(document).ready(function () {
  
    validator = FormValidation.formValidation(
        document.getElementById(FormId),
        {
            fields: {
                menugroupname: {
                    validators: {
                        notEmpty: {
                            message: 'Filed is required'
                        }
                    }
                }

            },

            plugins: { //Learn more: https://formvalidation.io/guide/plugins
                trigger: new FormValidation.plugins.Trigger(),
                // Bootstrap Framework Integration
                bootstrap: new FormValidation.plugins.Bootstrap()

            }
        }
    );

     pushtoSrever(null, "menugroup", "GET", function (node) {
         KTDatatableDataLocalDemo.init(node.data);
     })
});
