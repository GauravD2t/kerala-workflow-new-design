

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

function rejectScannDocumentModal(id) {

    $('#modalimagestatus').val(id);
    $('#rejectRemarksModal').modal('show');
}
function submitRemarksmenu() {
    if ($('#verifyTextarea').val().length != 0) {
        bulkVerify($('#modalimagestatus').val())
        $('#rejectRemarksModal').modal('hide');
    } else {
        toastr.error('Remaks required !');
        $('#rejectRemarksModal').modal('show');

    }

}



function getBatches() {
    pushtoSrever(null, "/getbstchesForoutward.dwf", "GET", function (node) {
        listofBatches = node.data;
        let option = "";
        for (var i = 0; i < listofBatches.length; i++) {
            option = option + "<option batchobj=" + listofBatches[i] + " value='" + listofBatches[i].id + "'>" + listofBatches[i].bundlenumber + "</option>";
        }

        $('#batches').html(option);
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
function bulkVerify() {
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
        pushtoSrever({ 'selectedfile': jsonform }, "/bulverifyfileoutward.dwf", "POST", function (node) {
            for (var i = 0; i < jsonform.length; i++) {
                $('#firs' + jsonform[i]).remove();
            }


            selected_fir = "";
            $('#kt_tree_1').jstree(true).settings.core.data = [];
            $('#kt_tree_1').jstree(true).refresh();
            toastr.success('File Return successfully!');

            getBatches();
            $.unblockUI();
        })

    }

}
function findfirs(batch) {
    pushtoSrever(null, "/findFIrsbybathcForoutward.dwf?batch=" + batch, "GET", function (node) {
        let firs = node.data;
        let li = "";
        for (var i = 0; i < firs.length; i++) {
            li = li + '<li class="lilist list-group-item" id="firs' + firs[i].id + '"  onclick="getdocument(this,' + firs[i].id + ')"><div class="form-check"><label class="form-check-label"><input type="checkbox" class="form-check-input mr-3 ckhform"  name="' + firs[i].id + '" value="false"> <span class="ml-4"> ' + firs[i].casetype + '/' + firs[i].caseno + '/' + firs[i].year + '</span> </label></div></li>'
        }
        if (firs.length != 0) {
            $("#bulkdiv").show();
        } else {
            $("#bulkdiv").hide();
        }
        $("#firlist").html(li);
    })
}

let selected_fir = "";




jQuery(document).ready(function () {
    // getDigitizationCenter();
    $(document).on('click', '.ckhform', function () {

        if ($(this).is(':checked')) {
            $(this).attr('value', 'true');
        } else {
            $(this).attr('value', 'false');
        }


    });


    $('#batches').select2({
        placeholder: "Select Batches ",
        allowClear: true
    })
    getBatches();
});