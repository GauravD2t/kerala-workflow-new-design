let departmentname = ["ACJM", "ACJM(EO)", "ACJM(MP-MLA)", "CJM", "DistrictCourt", "FamilyCourt", "JFCM-I", "JFCM-II", "JFCM-III", "JFCM-IX", "JFCM-NI-Act", "JFCM-VIII", "MunsiffCourt", "Pocso", "SpecialCourtSC-ST", "STAT", "SubCourt"]

let caseTypeList = ["Ab", "sdff"];


var monthStrings = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var loder = '<div id="loder" class="spinner spinner-primary mr-15"></div>';
function getDateAsFORMAT(txtSinceValue) {
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth();
	var year = "" + today.getFullYear();
	var yyyy = today.getFullYear();
	if (dd < 10) { dd = '0' + dd } if (mm < 10) { mm = '0' + mm }
	var today;

	today = dd + " " + monthStrings[parseInt(mm)] + " " + year.slice(2, 4)
	// if( dateFormate == "dd-MM-yyyy"){
	// 	today = dd+'-'+mm+'-'+yyyy;	
	// 	//console.log("1");

	// }else if(dateFormate == "dd-MMM-yyyy"){		
	// 	today = dd+'-'+mm+'-'+yyyy;			
	// 	today = today.split("-")[0] + "-" + monthStrings[parseInt(today.split("-")[1]-1)] + "-" + today.split("-")[2];		

	// }else if(dateFormate == "MM-dd-yyyy"){
	// 	today = mm+'-'+ dd +'-'+yyyy;
	// 	//console.log("33");
	// }

	return today;
}



jQuery(document).ready(function () {
	let appendoption = "";
	for (var i = 0; i < departmentname.length; i++) {
		appendoption = appendoption + '<option value="' + departmentname[i] + '">' + departmentname[i] + '</option>'
	}
	$('#departmentsearch').html(appendoption);
	
	
	$('#logoutname').html($('#Uname').html().slice(0, 1))
	$('#kt_dashboard_daterangepicker_date').html(getDateAsFORMAT(0));

	var menus = $('#asidemenu').find('a');
	$.each(menus, function (key, value) {
		if (window.location.href.split("/")[3] == $(value).attr('href')) {
			$(this).parent('li').addClass('menu-item-active')
			$(this).parent('li').parent('ul').parent('div').parent('li').addClass('menu-item-open')
			$(this).parent('li').parent('ul').parent('div').show();

		}

	});
})