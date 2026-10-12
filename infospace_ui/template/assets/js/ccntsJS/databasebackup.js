
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
var validator;
var FormId = "firForm";
var checksubmitStatus = 1;
function sumbitdatabse() {
    validator.validate().then(function (status) {
        if (status != "Invalid") {
            retrunjson($('#' + FormId).serializeArray(), function (formdata) {
                if (databaseip == "") {
                    pushtoSrever(formdata, "databaseSave.dwf", "POST", function (node) {
                        if (node.data != null) {
                            toastr.success("Data save successfully.")
                            location.reload()
                        } else {
                            toastr.error(node.message)
                        }
                    })
                } else {
                    pushtoSrever(formdata, "/databaseUpdate.dwf/" + databaseip, "PUT", function (node) {
                        if (node.data != null) {
                            toastr.success(" Data updated successfully.")
                            location.reload();
                        } else {
                            toastr.error(node.message)
                        }
                    })
                }
            })
        } else {
           
        }
    });
}
var databaseip="";
jQuery(document).ready(function () {
    validator = FormValidation.formValidation(
        document.getElementById('firForm'),
        {
            fields: {
                Scheduletype: {
                    validators: {
                        notEmpty: {
                            message: 'Mandatory field'
                        }
                    }
                },
                scheduletime: {
                    validators: {
                        notEmpty: {
                            message: 'Mandatory field'
                        },
                }
              },
              storepath: {
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
    pushtoSrever(null, "getAllDatabase.dwf", "GET", function (node) {
       if(node.data.length==0){

       }else{
        databaseip=node.data[0].id;
        $("#Scheduletype").val(node.data[0].scheduletype)
        $("#kt_timepicker_1").val(node.data[0].scheduletime)
        $("#storepath").val(node.data[0].storepath)
       
       }

    })
    pushtoSrever(null, "getlastbackupFile.dwf", "GET", function (node) {
        if(node.data==undefined){
            $(".filenamelase").html("No Databse backup file")
            $(".filenamelasedateTime").html("-")
           
        }else{
            $(".filenamelase").html(node.data.file)
            $(".filenamelasedateTime").html(moment.utc(node.data.mtime).format("DD/MM/YYYY HH:mm"))
           
        }
 
     })


    $('#kt_timepicker_1').timepicker({
        minuteStep: 1,
        defaultTime: '',
        showSeconds: false,
        showMeridian: false,
        snapToStep: true
    });
});