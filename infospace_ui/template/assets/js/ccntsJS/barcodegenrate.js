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

function buildTree(nodes) {
    return nodes.map(function (node) {
        return {
            id: node.uuid,
            text: node.documentType.documenttypename || "Unnamed",
            children: buildTree(node.children || [])
        };
    });
}
function showdata() {
   
    pushtoSrever(null, "/getdocumenttypebarcode.dwf", "GET", function (node) {
       
        let treearry = buildTree(node.data._embedded.documenttypetrees);
        $('#kt_tree_1').jstree(true).settings.core.data = treearry;
        $('#kt_tree_1').jstree(true).refresh();


    })
}

jQuery(document).ready(function () {
    $("#kt_tree_1").jstree({
        "core": {
            "themes": {
                "responsive": false
            },
            "check_callback": true,
            "data": []
        },
        "types": {
            "default": {
                "icon": "fa fa-folder text-primary"
            },
            "file": {
                "icon": "fa fa-file text-primary"
            }
        },
        "checkbox": {
            "keep_selected_style": false,  // remove default blue highlight
            "three_state": true,           // cascade check/uncheck
            "tie_selection": false         // clicking text doesn't check
        },
        "state": {
            "key": "demo2"
        },
        // 👇 merge all needed plugins here
        "plugins": ["checkbox", "types", "contextmenu", "state"]
    });

    // $('#kt_tree_1').on("changed.jstree", function (e, data) {
    //     var checkedNodes = data.instance.get_checked(true);
    //    // console.log("Checked:", checkedNodes.map(n => n.text));
    // });
    showdata();

})
 /*

 single barcode on top
function generateBarcode() {
    var tree = $('#kt_tree_1').jstree(true);
    var selectedNodes = tree.get_checked(true);

    var printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
        <html>
        <head>
            <title>Barcodes</title>
            <style>
                @page { size: A4; margin: 0; }
                body { margin: 0; }
                .page {
                    display: flex;
                    justify-content: top;
                    align-items: center;
                    width: 100%;
                    height: 100vh; 
                    page-break-after: always;
                    flex-direction: column;
                    font-family: Arial, sans-serif;
                }
                svg { max-width: 90%; }
            </style>
        </head>
        <body>
    `);
    selectedNodes.forEach(function (node, i) {
        if (node.parent !== "#") {
            var parentText = "";
            if (node.parent && node.parent !== "#") {
                parentText = tree.get_node(node.parent).text;
            }
           // var barcodeId = node.id + "::" + parentText + ">>" + node.text;
            var barcodeId = "barcode_" + i;
            printWindow.document.write(`
            <div class="page">
                <svg id="${barcodeId}"></svg>
                <h1>${parentText} >> ${node.text}</h1>
            </div>
        `);      
        }
    });
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.onload = function () {
        selectedNodes.forEach(function (node, i) {
            if (node.parent !== "#") {
                var barcodeId = "barcode_" + i;
                parentText = tree.get_node(node.parent).text;
                JsBarcode(printWindow.document.getElementById(barcodeId), node.id + ":" + parentText + ">>" + node.text, {
                    format: "CODE128",
                    lineColor: "#000",
                    width: 3,
                    height: 120,
                    displayValue: true
                });
            }
        });
        printWindow.print();
    };
    
 }*/


//top amd bottom barcode

function generateBarcode() {
    var tree = $('#kt_tree_1').jstree(true);
    var selectedNodes = tree.get_checked(true);

    var printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
        <html>
        <head>
            <title>Barcodes</title>
            <style>
                @page { size: A4; margin: 0; }
                body { margin: 0; }
                .page {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                    height: 100vh;
                    page-break-after: always;
                    font-family: Arial, sans-serif;
                }
                .barcode-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .barcode-bottom {
                    transform: rotate(180deg);
                    margin-bottom: 20px;
                }
                svg {
                    max-width: 90%;
                }
            </style>
        </head>
        <body>
    `);

    selectedNodes.forEach(function (node, i) {
        if (node.parent !== "#") {
            var parentText = "";
            if (node.parent && node.parent !== "#") {
                parentText = tree.get_node(node.parent).text;
            }
            var barcodeIdTop = "barcode_top_" + i;
            var barcodeIdBottom = "barcode_bottom_" + i;

            printWindow.document.write(`
                <div class="page">
                    <div class="barcode-container">
                        <svg id="${barcodeIdTop}"></svg>
                        <h1 style="text-align: center;margin:10px">${parentText} >> ${node.text}</h1>
                    </div>
                    <div class="barcode-container barcode-bottom">
                        <svg id="${barcodeIdBottom}"></svg>
                         <h1 style="text-align: center;margin:10px">${parentText} >> ${node.text}</h1>
                    </div>
                </div>
            `);
        }
    });

    printWindow.document.write('</body></html>');
    printWindow.document.close();

    printWindow.onload = function () {
        selectedNodes.forEach(function (node, i) {
            if (node.parent !== "#") {
                var parentText = tree.get_node(node.parent).text;
                var data = node.id + ":" + parentText + ">>" + node.text;

                JsBarcode(printWindow.document.getElementById("barcode_top_" + i), data, {
                    format: "CODE128",
                    lineColor: "#000",
                    width: 3,
                    height: 120,
                    displayValue: true
                });

                JsBarcode(printWindow.document.getElementById("barcode_bottom_" + i), data, {
                    format: "CODE128",
                    lineColor: "#000",
                    width: 3,
                    height: 120,
                    displayValue: true
                });
            }
        });
        printWindow.print();
    };
}


function generateQRCode() {
    var tree = $('#kt_tree_1').jstree(true);
    var selectedNodes = tree.get_checked(true);

    var printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
        <html>
        <head>
            <title>QR Codes</title>
            <style>
                @page { size: A4; margin: 0; }
                body { margin: 0; }
                .page {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                    height: 100vh;
                    page-break-after: always;
                    font-family: Arial, sans-serif;
                }
                .qr-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .qr-bottom {
                    transform: rotate(180deg);
                    margin-bottom: 20px;
                }
                .qr-top {
                    margin-top: 20px;
                }
                canvas {
                    width: 200px;
                    height: 200px;
                }
            </style>
        </head>
        <body>
    `);

    selectedNodes.forEach(function (node, i) {
        var parentText = "";
        node.parents.forEach(function (parentId, index) {
            if (parentId !== "#") {
                var parentNode = tree.get_node(parentId);

                if (index === 0) {
                    parentText = parentNode.text;
                } else {
                    parentText = parentNode.text + " >> " + parentText;
                }
            }
        });
        if (node.parent !== "#") {
           
            var qrIdTop = "qr_top_" + i;
            var qrIdBottom = "qr_bottom_" + i;

            printWindow.document.write(`
                <div class="page">
                    <div class="qr-container qr-top">
                        <div id="${qrIdTop}"></div>
                        <h1 style="text-align: center;margin:10px">${parentText} >> ${node.text}</h1>
                    </div>
                    <div class="qr-container qr-bottom">
                        <div id="${qrIdBottom}"></div>
                        <h1 style="text-align: center;margin:10px">${parentText} >> ${node.text}</h1>
                    </div>
                </div>
            `);
        }
    });

    printWindow.document.write('</body></html>');
    printWindow.document.close();

    printWindow.onload = function () {
        selectedNodes.forEach(function (node, i) {
            var parentText = "";
            node.parents.forEach(function (parentId, index) {
                if (parentId !== "#") {
                    var parentNode = tree.get_node(parentId);

                    if (index === 0) {
                        parentText = parentNode.text;
                    } else {
                        parentText = parentNode.text + " >> " + parentText;
                    }
                }
            });
            if (node.parent !== "#") {
              
                var data = "d2t_"+node.id + ":" + parentText + ">>" + node.text;

                // Generate QR codes (top and bottom)
                new QRCode(printWindow.document.getElementById("qr_top_" + i), {
                    text: data,
                    width: 200,
                    height: 200,
                });

                new  QRCode(printWindow.document.getElementById("qr_bottom_" + i), {
                    text: data,
                    width: 200,
                    height: 200,
                });
            }
        });

        printWindow.print();
    };
}
