let finalSearchResult = [];

function findFIr() {
    if ($('#estcode').val() != "" && $('#caseno').val().length != 0 && $('#caseyear').val().length != 0 && $('#casetypes').val().length != 0) {
        pushtoSrever(null, "/findFIr.dwf?estcode=" + $('#estcode').val() + "&casetype=" + $('#casetypes').val() + "&caseyear=" + $('#caseyear').val() + "&caseno=" + $('#caseno').val(), "GET", function (node) {
            console.log(node)
            $("#kt_datatable >tbody").html("");
            var tr;
            finalSearchResult = node.data;
            if (node.data.length == 0) {

                tr = '<tr><td style="text-align: center;"colspan="7"> Data not found !</td></tr>';
                toastr.error("Case not found !")
            } else {
                $("#logdatatable >tbody").html("");
                for (var i = 0; i < node.data.length; i++) {
                    var data = node.data[i];
                    var caseno = data.casetype + "/" + data.caseno + "/" + data.year;
                    tr = '<tr><td>' + caseno+ '</td>';
                    tr = tr + '<td>' + data.batch.bundlenumber + '</td>';
                   
                    tr = tr + '<td><a tabindex="1" onclick="viewlogs('  + data.id + ')"  class="editbtn btn btn-icon btn-light font-weight-bolder btn-hover-primary btn-sm" title="View Log " "><i class="fas fa-eye text-dark icon-md"></i></a></td></tr>';
                    $("#kt_datatable >tbody").append(tr);
                }
            }


        })
    } else {
        toastr.error("Enter valid Case Registration number.")
    }

}
function viewlogs(id) { 
  logdata=  finalSearchResult.filter(x=>x.id==id)[0];
    $("#logdatatable >tbody").html("");
    var tr = "";
    if (logdata.batch.created_by_d2!=undefined && logdata.batch.created_by_d2 != null) {
        tr = tr +
            '<tr><td> File Created</td><td>' +moment(logdata.batch.created_at_d2).format('YYYY-MM-DD HH:mm:ss') + '</td><td>' + logdata.batch.created_by_d2.name + '</td></tr>';
    }
    if (logdata.batch.inwardcommited_by != undefined && logdata.batch.inwardcommited_by != null) {
        tr = tr +
            '<tr><td> File recived</td><td>' +moment(logdata.batch.inwardcommited_at).format('YYYY-MM-DD HH:mm:ss') + '</td><td>' + logdata.batch.inwardcommited_by.name + '</td></tr>';
    }
    if (logdata.scan_by != undefined && logdata.scan_by != null) {
        tr = tr +
            '<tr><td> File Scaned</td><td>' +moment(logdata.scancommited_at).format('YYYY-MM-DD HH:mm:ss') + '</td><td>' + logdata.scan_by.name + '</td></tr>';
    }
    if (logdata.qc_by != undefined && logdata.qc_by != null) {
        tr = tr +
            '<tr><td> File QC</td><td>' +moment(logdata.qccommited_at).format('YYYY-MM-DD HH:mm:ss') + '</td><td>' + logdata.qc_by.name + '</td></tr>';
    }
    if (logdata.metadata_by!=undefined && logdata.metadata_by != null) {
        tr = tr +
            '<tr><td> Data Entry</td><td>' +moment(logdata.metadata_at).format('YYYY-MM-DD HH:mm:ss') + '</td><td>' + logdata.metadata_by.name + '</td></tr>';
    }
    if (logdata.classification_by != undefined && logdata.classification_by != null) {
        tr = tr +
            '<tr><td> Classification</td><td>' +moment(logdata.classification_at).format('YYYY-MM-DD HH:mm:ss') + '</td><td>' + logdata.classification_by.name + '</td></tr>';
    }
    if (logdata.pdf_by.name && logdata.pdf_by != undefined && logdata.pdf_by != null) {
        tr = tr +
            '<tr><td>PDF </td><td>' +moment(logdata.pdf_at).format('YYYY-MM-DD HH:mm:ss') + '</td><td>' + logdata.pdf_by.name + '</td></tr>';
    }
    if (logdata.first_verify_by != undefined && logdata.first_verify_by != null) {
        tr = tr +
            '<tr><td> IM Verified</td><td>' +moment(logdata.first_verify_at).format('YYYY-MM-DD HH:mm:ss') + '</td><td>' + logdata.first_verify_by.name + '</td></tr>';
    }
    if (logdata.verify_by != undefined && logdata.verify_by != null) {
        tr = tr +
            '<tr><td> L1 Verified</td><td>' +moment(logdata.verify_at).format('YYYY-MM-DD HH:mm:ss') + '</td><td>' + logdata.verify_by.name + '</td></tr>';
    }
    if (logdata.secondverify_by != undefined && logdata.secondverify_by != null) {
        tr = tr +
            '<tr><td> L2 Verified</td><td>' +moment(logdata.secondverify_at).format('YYYY-MM-DD HH:mm:ss') + '</td><td>' + logdata.secondverify_by.name + '</td></tr>';
    }
    if (logdata.thirdverify_by != undefined && logdata.thirdverify_by != null) {
        tr = tr +
            '<tr><td> L3 Verified</td><td>' +moment(logdata.thirdverify_at).format('YYYY-MM-DD HH:mm:ss') + '</td><td>' + logdata.thirdverify_by.name + '</td></tr>';
    }
    if (logdata.upload_at != undefined && logdata.upload_at != null) {
        tr = tr +
            '<tr><td> File Uploaded </td><td>' +moment(logdata.upload_at).format('YYYY-MM-DD HH:mm:ss') + '</td><td>' + logdata.thirdverify_by.name + '</td></tr>';
    }
    $("#logdatatable >tbody").append(tr);
    $('#viewlogs').modal('show');
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