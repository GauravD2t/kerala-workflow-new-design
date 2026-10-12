'use strict';
// Class definition
var datatable = null
var validator;
var DeleteObject;
var editobj;
var checksubmitStatus = 1;
function editMenu(id) {
    checksubmitStatus = 2;
    $('#addmenu').attr('value', 'Update');
    $('#addmenu').removeClass('savebtn')
    $('#addmenu').addClass('updatebtn')
    $('#addmenu').attr('ids',id)
    $('#resetform').attr('value', 'Cancel');
    KTDatatableDataLocalDemo.pushtoSrever(null, "/userEdit.dwf/" + id, "GET", function (node) {
        editobj = node.data;
        $('#employeeid').val(editobj.employeeid);
        $('#username').val(editobj.username);
        $('#name').val(editobj.name);
        $("#contactnumber").val(editobj.contactnumber);
        $('#email').val(editobj.email);
        $('#usertype').val(node.data.usertype)
        $("#usertypename").html(node.data.usertypename)
        $('#role').removeAttr('onchange');
        $('#role').val(node.data.role).trigger('change'); 
        $('#departmentsearch').val(node.data.department.split(",")).trigger('change');
        var selectedmenu=[];
        node.data.menus.forEach(function(item){
            selectedmenu.push(item.id.toString())
        })
        $("#menus").val(selectedmenu).trigger('change');
        $('#role').attr('onchange','selectdefualtmenu(this.value)');       
        if (validator.elements['password'] != undefined)
        validator.removeField("password")
        $("#employeeid").focus();
        // datatable.destroy();
        // KTDatatableDataLocalDemo._rendareTable(node.data);
    });
}
function resetData(FormId) {
    checksubmitStatus = 1;
    DeleteObject = "";
    $('#' + FormId).find("input[type=text],textarea,input[type=hidden]").val("");
    $("#employeeid").focus();
    $('#addmenu').attr('value', 'Submit');
    $('#resetform').attr('value', 'Reset');
    $("#menus").val("-1").trigger('change');
  
    $(".menuobj").html('');    
    $("#role").prop("selectedIndex", 0);
    $('#role').trigger('change');
    $("#usertype").val(2);
    $('#addmenu').removeClass('updatebtn')
    $('#addmenu').addClass('savebtn')
    editobj = undefined;

}
function selectdefualtmenu(roleid){
    if(roleid!=""){
        KTDatatableDataLocalDemo.pushtoSrever(null, "/getmenubyrole.dwf/" + roleid, "GET", function (node) {
            console.log(node.data)
            var selectedmenu=[];
            node.data.forEach(function(item){
                selectedmenu.push(item.id.toString())
            })
            
            $("#menus").val(selectedmenu).trigger('change')

        })
    }
}
function popupdeleteMenu(domobjec, id) {
    DeleteObject = id;
    $('#ModalValue').html($(domobjec).closest('tr').find('td')[1].innerHTML);
    $('#deleteModal').modal('show');
}
function deletemenu() {
    KTDatatableDataLocalDemo.pushtoSrever(null, "/userDelete.dwf/" + DeleteObject, "DELETE", function (node) {
        if (node.data != null) {
            // resetData();
            toastr.success("Data delete successfully.")
            DeleteObject = "";
            datatable.destroy();
            KTDatatableDataLocalDemo._rendareTable(node.data);
        } else {
            toastr.error('Problem in Deleting Data!');
        }

    });
}
var KTDatatableDataLocalDemo = function () {
    var initDualListbox = function () {
        var listBoxes = $(".dual-listbox");
        listBoxes.each(function () {
            var $this = $(this);
            // get titles
            var availableTitle = ($this.attr("data-available-title") != null) ? $this.attr("data-available-title") : "Available options";
            var selectedTitle = ($this.attr("data-selected-title") != null) ? $this.attr("data-selected-title") : "Selected options";

            // get button labels
            var addLabel = ($this.attr("data-add") != null) ? $this.attr("data-add") : "Add";
            var removeLabel = ($this.attr("data-remove") != null) ? $this.attr("data-remove") : "Remove";
            var addAllLabel = ($this.attr("data-add-all") != null) ? $this.attr("data-add-all") : "Add All";
            var removeAllLabel = ($this.attr("data-remove-all") != null) ? $this.attr("data-remove-all") : "Remove All";

            // get options
            var options = [];
            $this.children("option").each(function () {
                var value = $(this).val();
                var label = $(this).text();
                options.push({
                    text: label,
                    value: value
                });
            });

            // get search option
            var search = ($this.attr("data-search") != null) ? $this.attr("data-search") : "";

            // init dual listbox
            var dualListBox = new DualListbox($this.get(0), {
                addEvent: function (value) {
                    console.log(value);
                },
                removeEvent: function (value) {
                    console.log(value);
                },
                availableTitle: availableTitle,
                selectedTitle: selectedTitle,
                addButtonText: addLabel,
                removeButtonText: removeLabel,
                addAllButtonText: addAllLabel,
                removeAllButtonText: removeAllLabel,
                options: options,
            });

            if (search == "false") {
                dualListBox.search.classList.add("dual-listbox__search--hidden");
            }
        });
    },
        rendareTable = function (dataJSONArray) {
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
                    field: 'employeeid',
                    title: 'Employee ID',
                    textAlign: 'center',
                }, {
                    field: 'username',
                    title: 'UserID',
                    textAlign: 'center',

                },{
                    field: 'name',
                    title: 'Name',
                    textAlign: 'center',

                }
                , {
                    field: 'contactnumber',
                    title: 'Contact Number',
                    textAlign: 'center',

                }, {
                    field: 'role',
                    title: 'Role',
                    textAlign: 'center',
                    template: function (row) {
                        return row.role.name;
                    }
                }
                    , {
                    field: 'usertypename',
                    title: 'Type',
                    textAlign: 'center',
                    template: function (row) {
                        if (row.usertype == 0) {
                            return "Police station"
                        } else if (row.usertype == 1) {
                            return "Digitization Center Admin"
                        } else if (row.usertype == 2){
                            return "Digitization Center User"
                        } else {
                            return ""
                        }
                    }
                },
                {
                    field: 'Actions',
                    title: 'Actions',
                    sortable: false,
                    width: 125,
                    overflow: 'visible',
                    autoHide: false,
                    template: function (row) {
                        return '<a onclick="editMenu(' + row.id + ')"  class="editbtn btn btn-icon btn-light btn-hover-primary btn-sm" title="Edit details"><i class="flaticon-edit text-dark icon-nm"></i></a>';

                    },
                }],
            })
            //KTDatatableDataLocalDemo=datatable
        }
    var _init = function () {
        $('.numberOnly').bind('keyup paste', function () {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
        $('#kt_datatable_search_status').on('change', function () {
            datatable.search($(this).val().toLowerCase(), 'Status');
        });
        
        $(Document).on("focusout", "#employeeid", function (event) {
            var obj={employeeid:$(this).val(),userType:usertype}
            console.log(obj)   
            var _this=this   
            if (editobj == undefined || (editobj.employeeid != obj.employeeid)) {      
                KTDatatableDataLocalDemo.pushtoSrever(obj, "/isvaliduser.dwf", "POST", function (node) {
                    if(!node.status){                        
                        toastr.error($(_this).val() +" Employee ID already exists")
                        $(_this).val("")
                        $(_this).focus()
                    }
                });
            }
        });
        $(Document).on("focusout", "#username", function (event) {
            var obj={username:$(this).val()}  
            var _this=this               
            KTDatatableDataLocalDemo.pushtoSrever(obj, "/isvaliduser.dwf", "POST", function (node) {
                if(!node.status){                    
                    toastr.error($(_this).val()  +"User Name already exists")
                    $(_this).val("")
                    $(_this).focus()
                }
            });
        });
        $(Document).on("focusout", "#email", function (event) {
            var obj={email:$(this).val()}    
            var _this=this             
            KTDatatableDataLocalDemo.pushtoSrever(obj, "/isvaliduser.dwf", "POST", function (node) {
                if(!node.status){
                    $(_this).val("")
                    toastr.error($(_this).val() +"Email already exists")                    
                    $(_this).focus()
                }
            });
        });
        $(Document).on("change", "#role", function (event) {
            var id = $(this).val();
            if(id.trim().length !=0){
                KTDatatableDataLocalDemo.pushtoSrever(null, "/roles/" + id, "GET", function (node) {
                    var _menu = '<div class="navi-item my-2"><a href="#" class="navi-link"><i class="icon-1    x text-dark-50 flaticon2-fast-next"></i>'
                        + '<span class="navi-text font-weight-bolder font-size-lg">&nbsp&nbsp#menu#</span>'
                        + '</a>'
                        + '</div>';
                    if (node.role.menus != undefined) {
                        $(".menuobj").html('');
                        for (var i = 0; i < node.role.menus.length; i++) {
                            var menu = _menu
                            var menuobj = node.role.menus[i];
                            menu = menu.replace("#menu#", menuobj.menuname)
                            $(".menuobj").append(menu)
                        }
                    }
                })
            }            
        })        
        $('#kt_datatable_search_type').on('change', function () {
            datatable.search($(this).val().toLowerCase(), 'Type');
        });

        $('#kt_datatable_search_status, #kt_datatable_search_type').selectpicker();            
        $(Document).on("click", ".updatebtn", function (event) { 
            var _this=this
            validator.validate().then(function (status) {
                if (status != "Invalid") { 
                    var ids=parseInt($(_this).attr("ids"))    
                    KTDatatableDataLocalDemo.retrunjson($('#userForm').serializeArray(), function (data) {
                        data.menus = $("#menus").val()
                        data.department = $("#departmentsearch").val() != null ? $("#departmentsearch").val().join(",") : ""
                        KTDatatableDataLocalDemo.pushtoSrever(data, "updateuser.dwf/"+ids, "POST", function (node) {
                            toastr.success(" user save successfully.")
                            datatable.destroy();
                            resetData("userForm");
                            KTDatatableDataLocalDemo._rendareTable(node.data);
                        })
                    })  
                }
            });
        })
         $(Document).on("click", ".savebtn", function (event) {  
            validator.validate().then(function (status) {
                if (status != "Invalid") {
                    KTDatatableDataLocalDemo.retrunjson($('#userForm').serializeArray(), function (data) {   
                        data.menus=$("#menus").val()                     
                        KTDatatableDataLocalDemo.pushtoSrever(data, "registeruser.dwf", "POST", function (node) {
                            toastr.success(" user save successfully.")
                            datatable.destroy();
                            resetData("userForm");
                            KTDatatableDataLocalDemo._rendareTable(node.data);
                        })
                    });
                }
            }); 

         })
       
    };

    return {

        init: function (data) {
            _init();
            validator = this.validateafrm(document.getElementById('userForm'));
            //rendareTable(data);
        },
        _rendareTable: function (data) {
            this.pushtoSrever(null, "/getAllUser.dwf?type=2", "GET", function (node) {
                rendareTable(node.data);
            })
        },
        retrunjson: function (fieldarry, callback) {
            var jsonform = {};
            $.each(fieldarry, function () {
                if (this.name != "policestations" && this.name != "menus" )
                    jsonform[this.name] = this.value
            })
            callback(jsonform);
        },
        validateafrm: (name) => {
            return FormValidation.formValidation(name, {
                fields: {
                    employeeid: {
                        validators: {
                            notEmpty: {
                                message: 'Mandatory field'
                            }                            
                        }
                    }, username: {
                        validators: {
                            notEmpty: {
                                message: 'Mandatory field'
                            }
                        }
                    },
                    password: {
                        validators: {
                            notEmpty: {
                                message: 'Mandatory field'
                            }
                        }
                    },
                    confirmpassword: {
                        validators: {
                            notEmpty: {
                                message: 'Mandatory field'
                            }
                        }
                    },
                    name: {
                        validators: {
                            notEmpty: {
                                message: 'Mandatory field'
                            }
                        }
                    },
                    contactnumber: {
                        validators: {
                            notEmpty: {
                                message: 'Mandatory field'
                            }
                        },
                        phone: {
                            country: 'IN',
                            message: 'The value is not a valid  phone number'
                        }
                    },
                    email: {
                        validators: {
                            notEmpty: {
                                message: 'Mandatory field'
                            },
                            emailAddress: {
                                message: "enter valid email id"
                            }
                        }
                    },
                    usertype: {
                        validators: {
                            notEmpty: {
                                message: 'Mandatory field'
                            }

                        }
                    },                    
                    role: {
                        validators: {
                            notEmpty: {
                                message: 'Mandatory field'
                            }

                        }
                    }



                }, plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap(),
                    submitButton: new FormValidation.plugins.SubmitButton(),
                }
            });
        },
        pushtoSrever: function (pushObject, url, method, callback) {
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
    };
}();
var usertype;
jQuery(document).ready(function () {
    $('#menus').select2({
        multiple: true,
        placeholder: 'Select a menu',
    });
    usertype=parseInt(window.location.search.split("=")[1]);
    KTDatatableDataLocalDemo.init()
    KTDatatableDataLocalDemo._rendareTable();
});
