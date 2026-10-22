

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
let listofBatches = [];






function submitRemarksmenu(imagestatus) {
    if ($('#verifyTextarea').val().length != 0) {
        if (confirm("Are you sure you want to Reject file?")) { 
            bulkVerify(imagestatus)
        }
        
      
    } else {
        toastr.error('Rejct Remaks required!');
        

    }

}



function getBatches() {
    pushtoSrever(null, "/getbstchesForFirstTimeVerify.dwf", "GET", function (node) {
        listofBatches = node.data;
        let option = "";
        for (var i = 0; i < listofBatches.length; i++) {
            option = option + "<option batchobj=" + listofBatches[i] + " value='" + listofBatches[i].id + "'>" + listofBatches[i].bundlenumber + "</option>";
        }

        $('#batches').html(option);
         $('#batches').val("").trigger('change');
    })
}
function selectAll() {
    if ($('#iif1').prop('checked')) {
        $('#firlist .ckhform').prop('checked', true);
        $('#firlist .ckhform').attr('value', 'true');
    } else {
        $('#firlist  .ckhform').prop('checked', false);
        $('#firlist  .ckhform').attr('value', 'false');
    }

}

function bulkVerifyReject(imagestatus) {
    var jsonform = []

    $('#firlist .ckhform').each(function () {
        if ($(this).is(':checked')) {
            jsonform.push(this.name)
        }
    });

    if (jsonform.length == 0) {
        toastr.error("Select one file !");
    } else {
        $.blockUI();
        pushtoSrever({ 'selectedfile': jsonform, imagestatus: imagestatus, Verifyremarks: $('#verifyTextarea').val() }, "/bulkReadyForVerifyReject.dwf", "POST", function (node) {
            for (var i = 0; i < jsonform.length; i++) {
                $('#firs' + jsonform[i]).remove();
            }

            $('#verifyTextarea').val("")
            selected_fir = "";
            $('#kt_tree_1').jstree(true).settings.core.data = [];
            $('#kt_tree_1').jstree(true).refresh();
            toastr.success('File verified successfully!');
            document.getElementById("pdfiream").src = "";
            getBatches();
            $.unblockUI();
        })

    }
    console.log(jsonform);
}
function bulkVerify(imagestatus) {
    var jsonform = []
    jsonform.push(selected_fir)
   
    if (jsonform.length == 0) {
        toastr.error("Select one file !");
    } else {
        $.blockUI();
        pushtoSrever({ 'selectedfile': jsonform, imagestatus: imagestatus, Verifyremarks: $('#verifyTextarea').val() }, "/bulkReadyForVerify.dwf", "POST", function (node) {
            if (imagestatus == 5) {
                 if (node.status) {
                toastr.success('File verified successfully!');

                $('#verifyTextarea').val("")
                selected_fir = "";
                
                document.getElementById("pdfiream").src = "";
               resetverify();
                $.unblockUI();
            } else {
                toastr.error('You are currently logged in with an Admin account. Please log out and log in again.');
                $.unblockUI();
            }
            }
            else {

                toastr.success('File Reject successfully!');
                document.getElementById("pdfiream").src = "";
                findfirs($('#batches').val());
                resetverify();
            }
           

        })

    }
    console.log(jsonform);
}
function findfirs(batch) {
    if (batch != null && batch != "" && batch != undefined) {
        pushtoSrever(null, "/findFIrsbybathcReadyforVerify.dwf?batch=" + batch, "GET", function (node) {
            let firs = node.data;
           
            if (firs.length == 0) {
                getBatches();
            }

            $('.searchcasenotable').html('');
            for (var i = 0; i < firs.length; i++) {
                let disabled = "";
                let ststus = "Pending";
                let classlock = "";
                
                var classremarks = "text-danger";
                if (firs[i].verifyremarks != null) {
                    classremarks = "text-danger";
                } else {
                    classremarks = "text-primary";
                }
                var remarksdata = firs[i].verifyremarks != null ? firs[i].verifyremarks.replaceAll("\n", "<br>") : "null";
                $('.searchcasenotable').append('<tr><td>' + $("#batches option:selected").text().trim() + '</td><td> <a href="#" disabled="' + disabled + '" class="' + classremarks + '" onclick="getdocument(this,' + firs[i].id + ',\'' + remarksdata + '\')">' + firs[i].casetype + '/' + firs[i].caseno + '/' + firs[i].year + '</a></td><td>' + firs[i].pdfpagecount + '</td><td>' + firs[i].crn + '</td></tr>')
            }
        })
    }
}

let selected_fir = "";
function resetverify() {
    $('#verifyTextarea').val("");
    selected_fir = "";

    $(".viewfile").html("");
    document.getElementById("pdfiream").src = "";
    $('#casedetailstable').html("");
    viewBatchSection();
}
function viewBatchSection() {
    findfirs($('#batches').val());
    $('.filesection').hide(500);
    $('.batchsection').show(500);



}
function closefile() {
    if (selected_fir == "") {
        toastr.error("Select one file !");
    } else {
        if (confirm("Are you sure you want to close file?")) {
            resetverify();
        }
    }
}
function fullscreen() {
    if ($('#pdfdiv').hasClass('col-6')) {
        $('#pdfdiv').removeClass('col-6');
        $('#pdfdiv').addClass('col-9');
        $('#fullscreendiv').hide();
        $('.changeicon').removeClass('fa-expand');
        $('.changeicon').addClass(' fa-compress')


    } else {
        $('#fullscreendiv').show(500);
        $('.changeicon').removeClass('fa-compress');
        $('.changeicon').addClass('fa-expand');
        $('#pdfdiv').removeClass('col-9');
        $('#pdfdiv').addClass('col-6');
    }


    //fas fa - compress
}
function getdocument(dom, id, remraks) {
    selected_fir = id;
    $('.lilist').removeClass('active');
    $(dom).addClass('active');
    let data = [];
    $('.batchsection').hide(500);
    $('.filesection').show(500);
    if (remraks != "null") {
        $('.remakrsshow').show();
        $('.remakrsdata').html(remraks);
    } else {
        $('.remakrsshow').hide();
        $('.remakrsdata').html("");
    }
    pushtoSrever(null, "/getdocumentclassficationByfir.dwf?fir=" + id, "GET", function (node) {
        let classfication = node.data;

        classfication.sort((a, b) => a.id - b.id);
        classfication = Array.from(
            new Map(classfication.map(file => [file.ocrpdfpath, file])).values()
        );
        $('.viewfile').html("");
        let HTMLData = "";

        for (var i = 0; i < classfication.length; i++) {
            HTMLData = HTMLData + '<div class="col-12 p-2 border-bottom"><a href="javascript:void(0)" class="font-weight-bolder " onclick="getpdf(' + classfication[i].id + ')">' + classfication[i].ocrpdfpath.split("/")[classfication[i].ocrpdfpath.split("/").length - 1] + '</a></div>';
        }
        $('.viewfile').html(HTMLData)
    })





}


let editCalssfication = "";
function getDigitizationCenter() {
    pushtoSrever(null, "/getAllUser.dwf?type=1", "GET", function (node) {
        for (var i = 0; i < node.data.length; i++) {
            console.log(node.data[0])
        }
    })
}
function poppuEditNode(dom, classid) {
    pushtoSrever(null, "/getclassficationmodal.dwf?id=" + classid, "GET", function (node) {
        let classfication = node.data;
        editCalssfication = classid
        $('#modaldate').val(classfication.documentdate);
        $('#modalremark').val(classfication.documentdesc);
        $('#deleteModal').modal('show');
    })

}
function updateClassfication() {
    pushtoSrever({ documentdate: $('#modaldate').val(), documentdesc: $('#modalremark').val() }, "/updatedocumentclassficationByfir.dwf?id=" + editCalssfication, "POST", function (node) {
        toastr.success('File update successfully!');
        $('#deleteModal').modal('hide');
        editCalssfication = "";
        getdocument(null, selected_fir);
        $('#modaldate').val("");
        $('#modalremark').val("");
    })
}

function getpdf(id) {

    document.getElementById("pdfiream").src = "/getpdf.dwf?id=" + id;
}
jQuery(document).ready(function () {
    // getDigitizationCenter();
    $(document).on('click', '.ckhform', function () {

        if ($(this).is(':checked')) {
            $(this).attr('value', 'true');
        } else {
            $(this).attr('value', 'false');
        }


    });
    $("#kt_tree_1").jstree({
        "core": {
            "themes": {
                "responsive": false
            },
            // so that create works
            "check_callback": false,
            "data": [],
        },
        "types": {
            "default": {
                "icon": "fa fa-folder text-primary"
            },
            "file": {
                "icon": "fa fa-file  text-primary"
            }
        },
        "state": {
            "key": "demo2"
        },
        "plugins": ["contextmenu", "state", "types"]
    });
    $('#kt_tree_1').on("select_node.jstree", function (e, data) {
        if (data.node.id.indexOf('parent') != -1 || data.node.id.indexOf('child') != -1) {
            console.log(data.node.id + " found");
        } else {
            getpdf(data.node.id);
        }

    });
    $('#batches').select2({
        placeholder: "Select Batches ",
        allowClear: true
    })
    //$('#batches').val("").trigger('change');
    getBatches();
});