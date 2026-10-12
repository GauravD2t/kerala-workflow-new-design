function findFIr() {
    if ($('#estcode').val() != "" && $('#caseno').val().length != 0 && $('#caseyear').val().length != 0 && $('#casetypes').val().length != 0) {
        pushtoSrever(null, "/findFIr.dwf?estcode=" + $('#estcode').val() + "&casetype=" + $('#casetypes').val() + "&caseyear=" + $('#caseyear').val() + "&caseno=" + $('#caseno').val(), "GET", function (node) {
            console.log(node)
            $("#kt_datatable >tbody").html("");
            var tr;
            if (node.data.length == 0) {

                tr = '<tr><td style="text-align: center;"colspan="7"> Data not found !</td></tr>';
                toastr.error("Case not found !")
            } else {
                $("#kt_datatable >tbody").html("");
                for (var i = 0; i < node.data.length; i++) {
                    var data = node.data[i];
                    var caseno = data.casetype + "/" + data.caseno + "/" + data.year;
                    tr = '<tr id="tr' + data.id + '"><td>' + data.batch.bundlenumber + '</td><td>' + data.crn + '</td>';
                    tr = tr + '<td>' + data.itemid + '</td><td>' + caseno + '</td>';
                    if (data.imagestatus == -1) {
                        tr = tr + '<td>Inward Mode</td>';


                    }
                    if (data.imagestatus == 0) {
                        tr = tr + '<td>Scanning Mode</td>';


                    } else if (data.imagestatus == 1) {
                        tr = tr + '<td>ScanQC Mode</td>';

                    } else if (data.imagestatus == 2) {
                        tr = tr + '<td>Data Entry Mode</td>';


                    }
                    else if (data.imagestatus == 3) {
                        tr = tr + '<td>Classification Mode</td>';


                    } else if (data.imagestatus == 4) {
                        tr = tr + '<td>PDF Mode</td>';

                    } else if (data.imagestatus == 5) {
                        tr = tr + '<td>Document Verify  Mode</td>';

                    }

                    tr = tr + '<td><a tabindex="1" onclick="updateFIRStatus(' + data.id + ')"  class="editbtn btn btn-icon btn-danger font-weight-bolder btn-hover-primary btn-sm" title="Update Case" "><i class="fa fa-trash  text-dark icon-md"></i></a></td></tr>';
                    $("#kt_datatable >tbody").append(tr);
                }
            }


        })
    } else {
        toastr.error("Enter valid Case Registration number.")
    }

}
function updateFIRStatus(id) {
    if (confirm("Do you want to delete file !")) {
        pushtoSrever(null, "/deleteFilechangestatus.dwf?id=" + id, "GET", function (node) {
            toastr.success(" File Delete successfully.")
            $("#caseno").val("");
            $('#tr' + id).remove();
            // $("#kt_datatable >tbody").html("");
        })
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
function getesticode() {
    pushtoSrever(null, "/getesticode.dwf", "GET", function (node) {
        let data = node.data;
        let option = "<option value='' selected>Establishment Code</option>";
        for (let est of data) {
            option = option + "<option value='" + est.est_code + "' >" + est.est_code + "</option>";
        }
        $('#estcode').html("");
        $('#estcode').html(option);
    })
}
function getcasetype() {
    if ($('#estcode').val() != "") {
        pushtoSrever(null, "/getcasetype.dwf?estcode=" + $('#estcode').val(), "GET", function (node) {
            let data = node.data;

            let option = "<option value='' selected>Case Type </option>";
            for (let est of data) {
                option = option + "<option value='" + est.casetype + "' >" + est.casetype + "</option>";
            }
            $('#casetypes').html("");
            $('#casetypes').html(option);

        })
    } else {
        toastr.error("Select Establishment!")
    }

}
jQuery(document).ready(function () {
    getesticode();
    $('.numberOnly').bind('keyup paste', function () {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
})