
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
function getBatches() {
    pushtoSrever(null, "/getbstchesforUploadReady.dwf", "GET", function (node) {
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


function bulkVerify(imagestatus) {
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
        pushtoSrever({ 'selectedfile': jsonform }, "/bulkReadyForUpload.dwf", "POST", function (node) {
            for (var i = 0; i < jsonform.length; i++) {
                $('#firs' + jsonform[i]).remove();
            }
            toastr.success('File verified successfully!');

            //getBatches();
            $.unblockUI();
        })

    }
    console.log(jsonform);
}


function findfirs() {

    if ($('#batches').val().length == 0) {
        toastr.error("Select one Batch !");
        return false;
    } else {
        console.log($('#batches').val())
        pushtoSrever({ 'selectedBatch': $('#batches').val() }, "/findFIrsbybathcReadyforUpload.dwf", "POST", function (node) {
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

}

function getdocument(dom, id) {

    $('.lilist').removeClass('active');
    $(dom).addClass('active');
}

jQuery(document).ready(function () {

    $(document).on('click', '.ckhform', function () {

        if ($(this).is(':checked')) {
            $(this).attr('value', 'true');
        } else {
            $(this).attr('value', 'false');
        }


    });

    getBatches();
});