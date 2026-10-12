

function getdilelist() {

    pushtoSrever(null, "/filenotuploadlist.dwf", "GET", function (node) {
        let firs = node.data;
        let tr = "";
        for (var i = 0; i < firs.length; i++) {
            let fileno = firs[i].casetype+"-"+firs[i].caseno+"-"+firs[i].year;
           let count = i + 1;
            tr = tr + '<tr><td>' + count + '</td><td> ' + firs[i].batch.bundlenumber + '</td><td>' + fileno + '</td><td><div class="form-check mb-3"><label class="form-check-label"><input type="checkbox" class="form-check-input mr-3 ckhform"  name="' + firs[i].id + '" value="false"> </label></div></td></tr>';
        }

        $("#firlist").html(tr);
    })


}

function viewdocumentoffile(id) { 
    pushtoSrever({ 'id': id }, "/viewdocumentoffile.dwf", "POST", function (node) { 
        
    })
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
        // $.blockUI();
        pushtoSrever({ 'selectedfile': jsonform, imagestatus: 6, Verifyremarks: '' }, "/secondtimebulkverifyfile.dwf", "POST", function (node) {

            toastr.success('File uploaded successfully!');
            getdilelist();
            // $.unblockUI();
        })

    }
    // console.log(jsonform);
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

jQuery(document).ready(function () {
    getdilelist();
    $('.numberOnly').bind('keyup paste', function () {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
})