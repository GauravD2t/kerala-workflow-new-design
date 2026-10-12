
function downloadExcle() {
    if ($('#start').val() == "" || $('#end').val() == "") {
        toastr.error("Select vaild date")
    } else {

        var pushObject = { start: $('#start').val(), end: $('#end').val() };
        var fileName = "Inward-Report.xlsx";
        $.ajax({
            url: '/Inwardreport.dwf',
            cache: false,
            type: 'get',
            data: pushObject,
            xhr: function () {
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 2) {
                        if (xhr.status == 200) {
                            xhr.responseType = "blob";
                        } else {
                            xhr.responseType = "text";
                        }
                    }
                };
                return xhr;
            },
            success: function (data) {
                //Convert the Byte Data to BLOB object.
                var blob = new Blob([data], { type: "application/octetstream" });

                //Check the Browser type and download the File.
                var isIE = false || !!document.documentMode;
                if (isIE) {
                    window.navigator.msSaveBlob(blob, fileName);
                } else {
                    var url = window.URL || window.webkitURL;
                    link = url.createObjectURL(blob);
                    var a = $("<a />");
                    a.attr("download", fileName);
                    a.attr("href", link);
                    $("body").append(a);
                    a[0].click();
                    $("body").remove(a);
                }
            }
        });
    }

}

function USerWisedownloadExcle() {
    if ($('#userstart').val() == "" || $('#userend').val() == "") {
        toastr.error("Select vaild date")
    } else {

        var pushObject = { start: $('#userstart').val(), end: $('#userend').val() };
        var fileName = "UserWiseInwardReport.xlsx";
        $.ajax({
            url: '/UserWiseInwardReport.dwf',
            cache: false,
            type: 'get',
            data: pushObject,
            xhr: function () {
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 2) {
                        if (xhr.status == 200) {
                            xhr.responseType = "blob";
                        } else {
                            xhr.responseType = "text";
                        }
                    }
                };
                return xhr;
            },
            success: function (data) {
                //Convert the Byte Data to BLOB object.
                var blob = new Blob([data], { type: "application/octetstream" });

                //Check the Browser type and download the File.
                var isIE = false || !!document.documentMode;
                if (isIE) {
                    window.navigator.msSaveBlob(blob, fileName);
                } else {
                    var url = window.URL || window.webkitURL;
                    link = url.createObjectURL(blob);
                    var a = $("<a />");
                    a.attr("download", fileName);
                    a.attr("href", link);
                    $("body").append(a);
                    a[0].click();
                    $("body").remove(a);
                }
            }
        });
    }

}
var KTBootstrapDatepicker = function () {

    var arrows;
    if (KTUtil.isRTL()) {
        arrows = {
            leftArrow: '<i class="la la-angle-right"></i>',
            rightArrow: '<i class="la la-angle-left"></i>'
        }
    } else {
        arrows = {
            leftArrow: '<i class="la la-angle-left"></i>',
            rightArrow: '<i class="la la-angle-right"></i>'
        }
    }

    // Private functions
    var demos = function () {
        // range picker
        $('#kt_datepicker_5').datepicker({
            format: "dd/mm/yyyy",
            rtl: KTUtil.isRTL(),
            todayHighlight: true,
            templates: arrows
        });


    }

    return {
        // public functions
        init: function () {
            demos();
        }
    };
}();

var KTBootstrapDatepicker6 = function () {

    var arrows;
    if (KTUtil.isRTL()) {
        arrows = {
            leftArrow: '<i class="la la-angle-right"></i>',
            rightArrow: '<i class="la la-angle-left"></i>'
        }
    } else {
        arrows = {
            leftArrow: '<i class="la la-angle-left"></i>',
            rightArrow: '<i class="la la-angle-right"></i>'
        }
    }

    // Private functions
    var demos6 = function () {
        // range picker
        $('#kt_datepicker_6').datepicker({
            format: "dd/mm/yyyy",
            rtl: KTUtil.isRTL(),
            todayHighlight: true,
            templates: arrows
        });


    }

    return {
        // public functions
        init: function () {
            demos6();
        }
    };
}();
jQuery(document).ready(function () {
    KTBootstrapDatepicker.init();
    KTBootstrapDatepicker6.init();
    $('#start').val(moment().format("DD/MM/YYYY"));
    $('#end').val(moment().format("DD/MM/YYYY"));
    $('#userstart').val(moment().format("DD/MM/YYYY"));
    $('#userend').val(moment().format("DD/MM/YYYY"));
});