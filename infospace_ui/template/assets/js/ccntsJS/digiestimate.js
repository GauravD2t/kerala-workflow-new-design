var datatable = null;
var editDatatable=null;
var validator;
var FormId = "estimateForm";
function retrunjson(fieldarry, callback) {
    var jsonform = {};
    
$('#'+FormId+' input[type="checkbox"]:not(:checked)').each(function(){
    jsonform[this.name] = this.value
})
    $.each(fieldarry, function () {
        jsonform[this.name] = this.value
    })
    callback(jsonform);
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
                field: 'year',
                title: 'Year',
                width: 125,
            }, {
                field: 'iif1',
                title: 'IFF 1',
                width: 60,
            }, {
                field: 'iif2',
                title: 'IFF 2',
                width: 60,
            }, {
                field: 'iif3',
                title: 'IFF 3',
                width: 60,
            }, {
                field: 'iif4',
                title: 'IFF 4',
                width: 60,
            }, {
                field: 'iif5',
                title: 'IFF 5',
                width: 60,
            }, {
                field: 'iif6',
                title: 'IFF 6',
                width: 60,
            }, {
                field: 'iif7',
                title: 'IFF 7',
                width: 60,
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
            pushtoSrever(null, "/getallEstimate.dwf", "GET", function (node) {
                rendareTable(node.data);
            })
        }
    };
}();
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
function sumbitEstimate() {
    
    validator.validate().then(function (status) {
        if (status != "Invalid") {
            retrunjson($('#' + FormId).serializeArray(), function (formdata) {
                if (checksubmitStatus == 1) {
                    pushtoSrever(formdata, "saveestimate.dwf", "POST", function (node) {
                        if (node.status ) {
                            toastr.success("Data save successfully.")
                            resetData();
                            datatable.destroy();
                            KTDatatableDataLocalDemo._rendareTable(node.data);
                        } else {
                            toastr.error("Problem in saving Data.")
                        }
                    })
                } else {
                    pushtoSrever(formdata, "/estimateUpdate.dwf/" + editobj.id, "PUT", function (node) {
                        if (node.status) {
                            editobj = "";
                            toastr.success(" Data updated successfully.")
                            resetData();
                            datatable.destroy();
                            KTDatatableDataLocalDemo._rendareTable(node.data);
                        } else {
                            toastr.error("Problem in updating Data.")
                        }
                    })
                }
            })
        } else {
            $("#firserialnumber").focus();
        }
    });
}

function resetData() {
    checksubmitStatus = 1;
    DeleteObject = "";
    $('#' + FormId).find("input[type=text],textarea,input[type=hidden]").val("");
    $("#firserialnumber").focus();
    $('#addmenu').attr('value', 'Submit');
    $('#resetform').attr('value', 'Reset');
}

var DeleteObject;
function popupdeleteMenu(domobjec, id) {
    DeleteObject = id;
    $('#ModalValue').html($(domobjec).closest('tr').find('td')[0].innerHTML);
    $('#deleteModal').modal('show');
}
var editobj;
function editMenu(id) {
    checksubmitStatus = 2;
    $('#addmenu').attr('value', 'Update');
    $('#resetform').attr('value', 'Cancel');
    pushtoSrever(null, "/estimateEdit.dwf/" + id, "GET", function (node) {
        editobj = node.data;
      
        $('#year').val(editobj.year);
        $('#iif1').val(editobj.iif1)
        $('#iif2').val(editobj.iif2)
        $('#iif3').val(editobj.iif3)
        $('#iif4').val(editobj.iif4)
        $('#iif5').val(editobj.iif5)
        $('#iif6').val(editobj.iif6)
        $('#iif7').val(editobj.iif7)
        
        $("#year").focus();
    });
}
function deletemenu() {
    pushtoSrever(null, "/estimatedelete.dwf/" + DeleteObject, "DELETE", function (node) {
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

jQuery(document).ready(function () {
    
    //form vailidatyion
    validator = FormValidation.formValidation(
        document.getElementById('estimateForm'),
        {
            fields: {
                
                year: {
                    validators: {
                        notEmpty: {
                            message: 'Mandatory field'
                        },
                        stringLength: {
                            max: 4,
                            min: 4,
                            message: ''
                        }
                    }
              }
            }, plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                bootstrap: new FormValidation.plugins.Bootstrap(),
                submitButton: new FormValidation.plugins.SubmitButton(),
            }
        });
  
   
    resetData();
 
   
   
   
   // $('#datepicker').datepicker('setStartDate',moment(new Date()).format('DD/MM/YYYY'));
    $('.numberOnly').bind('keyup paste', function () {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
    $('.year').focusout(function(){
     
        var current_year=new Date().getFullYear();
        if( parseInt(this.value) > current_year)
            {   this.value ="";
                $(this).focus();
                toastr.error("Year should be less than current year")
            }
    });

   
    
    pushtoSrever(null, "/getallEstimate.dwf", "GET", function (node) {
        KTDatatableDataLocalDemo.init(node.data);
    })
    $("#year").focus();
});