

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
function updateMetadata() {

    if ($('#rejectmetadata').val().length != 0) {
        let formdata = {
            id: selected_fir,
            verifyremarks: $('#rejectmetadata').val(),
            readyforverify: false

        }
        pushtoSrever(formdata, "/rejectforMetadata.dwf", "POST", function (node) {
            toastr.success('Data Reject successfully!');
            $('#viewmeatadata').modal('hide');
            $('#firs' + selected_fir).remove()
            selected_fir = "";
            $('#kt_tree_1').jstree(true).settings.core.data = [];
            $('#kt_tree_1').jstree(true).refresh();
            getBatches();
        })
    } else {
        toastr.error("Enter Reject Remarks!!");
    }

}
function viewMetadataByFile() {
    if (selected_fir == "") {
        toastr.error("Select one file !");
    } else {
        pushtoSrever(null, "/getmetadatabffile.dwf?fileid=" + selected_fir, "GET", function (node) {
            $('#viewmeatadata').modal('show');

            let data = node.data;
            //let data = [1, 2, 3];
            $('#casedetailstable').html("");
            for (let i = 0; i < data.length; i += 2) {
                // Create a new table row
                let row = $('<tr></tr>');

                var id = data[i].metadatum.entityname.replaceAll('.', '_');
                row.append('<td><b>' + data[i].metadatum.title + '</b><input type="text" class="w-100" metadata="' + data[i].metadatum.id + '" value="' + data[i].value + '"  id = "' + id + '" ></td>');

                // Check if there's a next element to avoid undefined
                if (data[i + 1] !== undefined) {
                    var id = data[i + 1].metadatum.entityname.replaceAll('.', '_');
                    row.append('<td><b>' + data[i + 1].metadatum.title + '</b><input type="text" class="w-100" metadata="' + data[i + 1].metadatum.id + '" value="' + data[i + 1].value + '"  id = "' + id + '" ></td>');

                }

                // Append the row to the table
                $('#casedetailstable').append(row);
            }
            $('#casedetailstable').append('<tr><td><b class="h5">Reject Remarks</b></td><td><textarea class="form-control" id="rejectmetadata" placeholder="Enter Remarks " rows="5"     spellcheck = "false" ></textarea ></td></tr>')

        })
    }
}
let FindNodeFILE = [];
function findfilefromSeachInVerify() {
    if ($('#casetypesearch').val() != null && $('#casenosearch').val().length > 0 && $('#yearsearch').val().length > 0) {
        var url = "?casetype=" + $('#casetypesearch').val() + "&caseno=" + $('#casenosearch').val() + "&caseyear=" + $('#yearsearch').val();
        $('#kt_tree_1').jstree(true).settings.core.data = [];
        $('#kt_tree_1').jstree(true).refresh();
        selected_fir = "";
        pushtoSrever(null, "/findfilefromSeachInVerify.dwf" + url, "GET", function (node) {
            FindNodeFILE = [];
            FindNodeFILE = node.data;
            if (node.data.length == 0) {
                toastr.error('File not  found!');
                $("#tablerow").hide();
                $('.searchcasenotable').html("");
            } else {
                $("#tablerow").show();
                $('.searchcasenotable').html("");
                var tr = "";
                for (var i = 0; i < FindNodeFILE.length; i++) {
                    var caseno = FindNodeFILE[i].casetype + '/' + FindNodeFILE[i].caseno + '/' + FindNodeFILE[i].year;
                    tr = tr + '<tr class="removeclassTr tr' + FindNodeFILE[i].id + '"><td><p>' + FindNodeFILE[i].batch.bundlenumber + '</p></td><td><p>' + caseno + '</p></td><td><p>' + FindNodeFILE[i].crn + '</p></td><td><button class="btn btn-success btn-sm"  onclick="getdocument(' + FindNodeFILE[i].id + ')"> View <i class=" ml-1 fa fa-file" aria-hidden="true"></i></button></td></tr>';

                }
                $('.searchcasenotable').html(tr);
                $("#tablerow").show();
            }

            //getBatches(node.data)
        })
    }
}

function getBatches(batnode) {
    listofBatches = batnode;
    let option = "<option>Select Batch</option>";
    for (var i = 0; i < listofBatches.length; i++) {
        option = option + "<option batchobj=" + listofBatches[i] + " value='" + listofBatches[i].id + "'>" + listofBatches[i].bundlenumber + "</option>";
    }

    $('#batches').html(option);
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

    jsonform.push(selected_fir);

    if (selected_fir == "") {
        toastr.error("Select one file !");
    } else {
        $.blockUI();
        pushtoSrever({ 'selectedfile': jsonform, imagestatus: imagestatus, Verifyremarks: $('#verifyTextarea').val() }, "/bulkverifyfile.dwf", "POST", function (node) {
            for (var i = 0; i < jsonform.length; i++) {
                $('#firs' + jsonform[i]).remove();
            }

            $('#verifyTextarea').val("");
            $(".tr" + selected_fir).remove();
            selected_fir = "";
            $('#kt_tree_1').jstree(true).settings.core.data = [];
            $('#kt_tree_1').jstree(true).refresh();
            toastr.success('File verified successfully!');
            document.getElementById("pdfiream").src = "";
            $.unblockUI();
            //getBatches();

        })

    }
    console.log(jsonform);
}
function findfirs(batch) {
    debugger;
    var result = [];
    $.each(FindNodeFILE, function (index, obj) {
        if (parseInt(obj.id) === parseInt(batch)) { // Replace 2 with the desired value to find
            result = obj.fir;
            return false; // Stop iteration once the object is found
        }
    });

    let li = "";
    for (var i = 0; i < result.length; i++) {
        li = li + '<li class="lilist list-group-item" id="firs' + result[i].id + '"  onclick="getdocument(this,' + result[i].id + ')"><div class="form-check"><label class="form-check-label"><input type="checkbox" class="form-check-input mr-3 ckhform"  name="' + result[i].id + '" value="false"> <span class="ml-4"> ' + result[i].casetype + '/' + result[i].caseno + '/' + result[i].year + '</span> </label></div></li>'
    }
    if (result.length != 0) {
        $("#bulkdiv").show();
    } else {
        $("#bulkdiv").hide();
    }
    $("#firlist").html(li);

    // pushtoSrever(null, "/findFIrsbybathc.dwf?batch=" + batch, "GET", function (node) {
    //     let firs = node.data;
    //     let li = "";
    //     for (var i = 0; i < firs.length; i++) {
    //         li = li + '<li class="lilist list-group-item" id="firs' + firs[i].id + '"  onclick="getdocument(this,' + firs[i].id + ')"><div class="form-check"><label class="form-check-label"><input type="checkbox" class="form-check-input mr-3 ckhform"  name="' + firs[i].id + '" value="false"> <span class="ml-4"> ' + firs[i].casetype + '/' + firs[i].caseno + '/' + firs[i].year + '</span> </label></div></li>'
    //     }
    //     if (firs.length != 0) {
    //         $("#bulkdiv").show();
    //     } else {
    //         $("#bulkdiv").hide();
    //     }
    //     $("#firlist").html(li);
    // })
}

let selected_fir = "";
function getdocument(id) {
    selected_fir = id;

    $('.removeclassTr').removeClass('bg-primary');
    $('.tr' + id).addClass("bg-primary");
    // $(dom).addClass('active');
    let data = [];
    pushtoSrever(null, "/getdocumentclassficationByfir.dwf?fir=" + id, "GET", function (node) {
        let classfication = node.data;
        let treearry = [];

        for (var i = 0; i < classfication.length; i++) {
            let desc = (classfication[i].documentdesc == "" || classfication[i].documentdesc == null) ? classfication[i].documentdate : classfication[i].documentdesc;
            desc = ((classfication[i].documentdesc == "" || classfication[i].documentdesc == null) && (classfication[i].documentdate == "" || classfication[i].documentdate == null)) ? classfication[i].documenttypename.split(">>")[classfication[i].documenttypename.split(">>").length - 1] : desc;
            let index = treearry.findIndex(x => x.text === classfication[i].documenttypename.split(">>")[0].trim());
            if (classfication[i].child.length != 0) {
                var childdata = [];
                for (var k = 0; k < classfication[i].child.length; k++) {
                    let child = classfication[i].child[k];
                    //  let childdesc = (child.documentdesc == "" || child.documentdesc == null) ? child.documentdate : child.documentdesc;
                    childdata.push({ 'pdfpath': child.ocrpdfpath, "id": child.id, "text": child.documenttypename, "icon": "fa fa-file text-danger " });
                }
                if (index == -1) {
                    treearry.push({ 'id': 'parent' + classfication[i].id, 'text': classfication[i].documenttypename.split(">")[0].trim(), "children": [{ 'pdfpath': classfication[i].ocrpdfpath, "id": 'child' + classfication[i].id, "text": desc + ' <i class="fa ml-2 fa-edit text-primary" onclick="poppuEditNode(this,' + classfication[i].id + ')" ></i>', "icon": "fa fa-folder text-primary ", "children": childdata }] })
                } else {
                    treearry[index]["children"].push({ 'pdfpath': classfication[i].ocrpdfpath, "id": 'child' + classfication[i].id, "text": desc + ' <i class="fa ml-2 fa-edit text-primary" onclick="poppuEditNode(this,' + classfication[i].id + ')" ></i>', "icon": "fa fa-folder text-danger ", "children": childdata })
                }
            } else {
                if (index == -1) {
                    treearry.push({ 'id': 'parent' + classfication[i].id, 'text': classfication[i].documenttypename.split(">>")[0].trim(), "children": [] });
                }
                index = treearry.findIndex(x => x.text === classfication[i].documenttypename.split(">>")[0].trim());
                let documentname = classfication[i].documenttypename.split(">>");
                var childdata = [];
                childdata.push({ 'pdfpath': classfication[i].ocrpdfpath, "id": classfication[i].id, "text": desc + ' <i class="fa ml-2 fa-edit text-primary" onclick="poppuEditNode(this,' + classfication[i].id + ')" ></i>', "icon": "fa fa-file text-danger " });

                if (0 == documentname.length - 1) {
                    treearry[index]["children"] = [...treearry[index]["children"], ...childdata];
                } else {
                    if (documentname.length == 3) {
                        childdata[0].text = classfication[i].documenttypename.split(">>")[2].trim() + ' <i class="fa ml-2 fa-edit text-primary" onclick="poppuEditNode(this,' + classfication[i].id + ')" ></i>';
                        childindex = treearry[index]["children"].findIndex(x => x.text === classfication[i].documenttypename.split(">>")[1].trim());
                        if (childindex == -1) {

                            treearry[index]["children"].push({ 'id': 'parent' + classfication[i].id + "_", 'text': classfication[i].documenttypename.split(">>")[1].trim(), "icon": "fa fa-folder text-danger ", "children": childdata })
                        } else {
                            treearry[index]["children"][childindex]['children'] = [...treearry[index]["children"][childindex]['children'], ...childdata];
                            //treearry[index]["children"].push({ 'id': 'parent' + classfication[i].id + "_", 'text': classfication[i].documenttypename.split(">>")[1].trim(), "icon": "fa fa-folder text-danger ", "children": childdata })
                        }

                    } else {
                        treearry[index]["children"].push({ 'id': 'parent' + classfication[i].id + "_", 'text': classfication[i].documenttypename.split(">>").slice(1).join().trim(), "icon": "fa fa-folder text-danger ", "children": childdata })
                    }
                    // treearry[index]["children"].push({ 'id': 'parent' + classfication[i].id + "_", 'text': classfication[i].documenttypename.split(">>").slice(1).join().trim(), "icon": "fa fa-folder text-danger ", "children": childdata })
                }
                // treearry[index]["children"].push({ 'pdfpath': classfication[i].ocrpdfpath, "id": classfication[i].id, "text": desc, "icon": "fa fa-file text-danger " })


            }


            data = treearry
        }

        $('#kt_tree_1').jstree(true).settings.core.data = data;
        $('#kt_tree_1').jstree(true).refresh();
    })





}
let editCalssfication = "";

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
        getdocument(selected_fir);
        $('#modaldate').val("");
        $('#modalremark').val("");
    })
}
function getpdf(id) {

    document.getElementById("pdfiream").src = "/getpdf.dwf?id=" + id;
}
let selected_node = "";

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
        selected_node = data;
        if (data.node.id.indexOf('parent') != -1 || data.node.id.indexOf('child') != -1) {
            console.log(data.node.id + " found");
        } else {
            getpdf(data.node.id);
        }

    });

    // getBatches();
});