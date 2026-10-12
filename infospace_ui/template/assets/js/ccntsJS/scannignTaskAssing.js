
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
var datatable=null;
var DeleteObject;
function popupdeleteMenu(domobjec, id) {
    DeleteObject = id;
    $('#ModalValue').html($(domobjec).closest('tr').find('td')[1].innerHTML);
    $('#deleteModal').modal('show');
}
function deletemenu() {
    var fir={
      
        imagestatus:-1
    }
    pushtoSrever(fir, "/updatefirtask.dwf/" + DeleteObject, "PUT", function (node) {
        if (node.data != null) {
            console.log(node.data)
            toastr.success("Data delete successfully.")
            pushtoSrever(null, "/assignedFIR.dwf/"+$("#batchs" ).val(), "GET", function (node1) { 
                datatable.destroy();
                KTDatatableDataLocalDemo.init(node1.data); 
            })
           
            $('#selectablefir').prepend('<button  id="'+node.data.id+'"   value="'+node.data.id+'" class="firselectbtn btn btn-light btn-text-primary font-weight-boldest btn-block" disabled>'+node.data.crn+'</button >')

        } else {
            toastr.error('Problem in Deleting Data!');
        }
    });
}
var KTDatatableDataLocalDemo = function () {
    var rendareTable = function (dataJSONArray) {
      
        datatable = $('#kt_datatable_allocatment').KTDatatable({
            data: {
                type: 'local',
                source: dataJSONArray,
                pageSize: 5,
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
                placeholder: 'Search Cases'
            },
            columns: [{
                field: 'crn',
                title: 'CRN',
                width: 125,
                sortable: 'desc',
            }, {
                field: 'scan_by',
                title: 'Scan User',
                template: function (row) {
                    return row.scan_by.name;
                 },
            }, {
                field: 'qc_by',
                title: 'ScanQC User',
                template: function (row) {
                   return row.qc_by.name;
                },
            },{
                field: 'Actions',
                title: 'Actions',
                sortable: false,
                width: 100,
                overflow: 'visible',
                autoHide: false,
                template: function (row) {
                    return  '<a onclick="popupdeleteMenu(this,' + row.id + ')" href="javascript:;" class="deletebtn btn btn-icon btn-light btn-hover-primary btn-sm" title="Delete"><i class="flaticon-delete text-danger icon-nm"></i></a>	';
                },
            }],
        })
        //KTDatatableDataLocalDemo=datatable
    }
    return {
        init: function (data) {
            rendareTable(data);
        }
        
    };
}();


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
function updateFIR() {
    validator.validate().then(function (status) {
        if (status != "Invalid") {
            var selectedfir=[];
            $('#selectedfir  .firselectbtn').each(function() {
                selectedfir.push($(this).val())
            })
            if(selectedfir.length>0){
                var fir =
                {
                   batchid:$("#batchs" ).val(),
                    scan_by: $("#scanninguser" ).val() ,
                    qc_by:$('#qcuser').val(),
                    selectedfir:selectedfir
                    
                };
                pushtoSrever(fir, "/bulkScanningTaskOnFIR.dwf", "GET", function (node) {
                    if (node.status ) {
                            $('#selectedfir  .firselectbtn').remove();
                        toastr.success(" Task Assinged successfully.")
                        $('#scanninguser').focus();
                    } else {
                        toastr.error("Problem in assign task!")
                    }
                    pushtoSrever(null, "/assignedFIR.dwf/"+$("#batchs" ).val(), "GET", function (node1) { 
                        datatable.destroy();
                        KTDatatableDataLocalDemo.init(node1.data);
                        if( $('#selectablefir  .firselectbtn').length==0){
                            
                            datatable.destroy();
                            getAllBatch();
                          $('#scanninguser').focus();
                         }
                    });

                    
                })
            }else{
                toastr.error("Select  atleast one FIR !")
            }
           
       
        }
    });
     
   
}

function tranferFIR(){
    var count=parseInt($('#firtranfer').val());
    if(count==""){
        toastr.error("Enter  FIRs count needs to be  allotment !");
        return false;
    }
    validator.validate();
    var i=1;
    $('#selectablefir  .firselectbtn').each(function(){
       if(i<=count){
           i++;
           $('#selectedfir').append(this);

           // $(this).remove();
       }else{
           return false;
       }
       
    });
}
function ResetFIR(){
    $($('#selectedfir  .firselectbtn').get().reverse()).each(function(){
            $('#selectablefir').prepend(this);
            // $(this).remove();
     });
}
var datatable=null;
function receivedBatch(id) {
    if(id=="" || id == undefined || id==null){
        return false;
    }
    pushtoSrever(null, "/receiveBatchAssign.dwf/" + id, "GET", function (node) {
     
            $('#selectablefir .firselectbtn').remove();
            $('#selectedfir .firselectbtn').remove();
            var datatabledata=[];
            for (var i = 0; i < node.data.length; i++) {
                if(node.data[i].imagestatus==-1){
                    $('#selectablefir').append('<button  id="'+node.data[i].id+'"   value="'+node.data[i].id+'" class="firselectbtn btn btn-light btn-text-primary font-weight-boldest btn-block" disabled>'+node.data[i].crn+'</button >')
                }else if(node.data[i].imagestatus==0){
                    datatabledata.push(node.data[i]);
                }
            }

            if(datatable==null ||datatable == undefined){
                KTDatatableDataLocalDemo.init(datatabledata);
            }else{
                datatable.destroy();
                KTDatatableDataLocalDemo.init(datatabledata);
            }
           
        
    })
}

var validator;
function getAllDroupDwon(){
    pushtoSrever(null, "userofdigilization.dwf", "GET", function (node) {
       
      //  var newOption = "<option value=''>Select Menu Group</option>"
        //    $('#menugroup').append(newOption);
        node.data.forEach(function(user,index){

            var newOption = "<option value="+user.id+">"+user.name+"</option>";
            if(user.role.roletype==2 && (user.role.roleindex>1 && user.role.roleindex<9)){
                $('#scanninguser').append(newOption);
                $('#qcuser').append(newOption);
            }
                
        });
        $('#scanninguser').select2({
            placeholder: "Select Scanning user",
            allowClear: true
        });
        $('#qcuser').select2({
            placeholder: "Select QC user",
            allowClear: true
        });
        $('#scanninguser').val("").trigger('change');
        $('#scanninguser').on('change', function () {
            // Revalidate field
            validator.revalidateField('scanninguser');
        });
        $('#qcuser').val("").trigger('change');
        $('#qcuser').on('change', function () {
            // Revalidate field
            validator.revalidateField('qcuser');
        });
    
    });
}
KTDatatableDataLocalDemo.init([]);
function getAllBatch(){
    pushtoSrever(null, "/batchlistfortaskAssign.dwf", "GET", function (node) {
       $('#batchs').empty()
      for(var i=0;i<node.data.length;i++){
          $('#batchs').append("<option value="+node.data[i].id+">"+node.data[i].bundlenumber+"</option>")
      }
      $('#batchs').select2({
        placeholder: "Select Batch",
        allowClear: true
    });
     $('#batchs').val("").trigger('change');
    })
    $('#batchs').on('change', function () {
        // Revalidate field
        validator.revalidateField('batchs');
    });
}

jQuery(document).ready(function () {
    $('.numberOnly').bind('keyup paste', function () {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
    getAllDroupDwon();
    getAllBatch();
   
    $('a').bind('keypress', function (e) {
        debugger;
    });
    $('#scanninguser').focus();
    
    validator = FormValidation.formValidation(
        document.getElementById('firForm'),
        {
            fields: {
               
                scanninguser: {
                    validators: {
                        notEmpty: {
                            message: 'Filed is required'
                        }
                    }
                },
                qcuser:{
                    validators: {
                        notEmpty: {
                            message: 'Filed is required'
                        }
                    }
                },
                batchs:{
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
                bootstrap: new FormValidation.plugins.Bootstrap(),

            }
        }
    );
    //getpendingBatch();
});