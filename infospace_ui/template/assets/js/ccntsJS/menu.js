'use strict';
var datatable = null;
var validator;
var submittype = 1;
var FormId = "menuForm";
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
function sumbitMenu() {
    var status = validator.validate();
    if (status._result != "Invalid") {
        retrunjson($("#menuForm").serializeArray(), function (formdata) {
        
            if (checksubmitStatus == 1) {
                pushtoSrever(formdata, "menusSave", "POST", function (node) {
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
            pushtoSrever(formdata, "/menuUpdate/" + editobj.id, "PUT", function (node) {
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
    $('#menugroup').val("").trigger('change');
    $('#addmenu').attr('value', 'Submit');
    $('#resetform').attr('value', 'Reset');

}
function getAllDroupDwon(){
    pushtoSrever(null, "menugroup", "GET", function (node) {
      //  var newOption = "<option value=''>Select Menu Group</option>"
        //    $('#menugroup').append(newOption);
        node.data.forEach(function(menugroup,index){
            var newOption = "<option value="+menugroup.id+">"+menugroup.menugroupname+"</option>"
            $('#menugroup').append(newOption);
        });
        $('#menugroup').select2({
            placeholder: "Select a Menu Group",
            allowClear: true
        });
        $('#menugroup').val("").trigger('change');
        $('#menugroup').on('change', function () {
            // Revalidate field
            validator.revalidateField('menugroup');
        });
    
    });
}
var editobj;
function editMenu(id) {
    checksubmitStatus = 2;
    $('#addmenu').attr('value', 'Update');
    $('#resetform').attr('value', 'Cancle');
    pushtoSrever(null, "/menusEdit/" + id, "GET", function (node) {
        editobj=node.data;
        
        $('#menuname').val(node.data.menuname);
        $('#menugroup').val(node.data.menugroup.id).trigger('change');
      
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
    pushtoSrever(null, "/menusDelete/" + DeleteObject, "DELETE", function (node) {
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
                field: 'id',
                title: 'ID',
            }, {
                field: 'menuname',
                title: 'Name',
                template: function (row) {
                    return "<span class='Groupname'>" + row.menuname + "</span>"
                }
            },{
                field: 'menugroup',
                title: 'Menu Group',
                template: function (row) {
                    return "<span class='Groupname'>" + row.menugroup.menugroupname + "</span>"
                }
            },{
                field: 'Actions',
                title: 'Actions',
                sortable: false,
                width: 125,
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
            pushtoSrever(null, "menuGetAll", "GET", function (node) {
                rendareTable(node.data);
            })
        }

    };
}();
jQuery(document).ready(function () {
    getAllDroupDwon();
    // validator = FormValidation.formValidation(
    //     document.getElementById('menuForm'),
    //     {
    //         fields: {
    //             menuname: {
    //                 validators: {
    //                     notEmpty: {
    //                         message: 'Filed is required'
    //                     }
    //                 }
    //             },
    //             menugroup: {
    //                 validators: {
    //                     notEmpty: {
    //                         message: 'Filed is required'
    //                     }
    //                 }
    //             }

    //         },

    //         plugins: { //Learn more: https://formvalidation.io/guide/plugins
    //             trigger: new FormValidation.plugins.Trigger(),
    //             // Bootstrap Framework Integration
    //             bootstrap: new FormValidation.plugins.Bootstrap(),

    //         }
    //     }
    // );

     pushtoSrever(null, "menuGetAll", "GET", function (node) {
         KTDatatableDataLocalDemo.init(node.data);
     })
    //  pushtoSrever(null, "readDataFromExcle.dwf", "GET", function (node) {
    //     console.log(node)
    // })
});
