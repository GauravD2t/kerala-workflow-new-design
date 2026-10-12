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
function callajax(projectname) {
	var i = 0;
	while (i <= 1500) {
		pushtoSrever({ "text": '  Even after the decolonisation of Africa, the continent was unable to formulate, let alone implement its own agenda because of its deep political and economic vulnerabilities. This situation has changed in the last two decades, and today, Africa is witnessing political and economic resurgence. Its leaders realise that the time has come for African development to be owned and driven by the African people themselves. There is a new enthusiasm for the very idea of ‘Pan-Africanism’, and Agenda 2063 is a document that expresses this spirit. The African Union (AU) adopted the agenda in 2015 with the aim of having a roadmap for a strong, peaceful, integrated and prosperous Africa by 2063, 100 years after the establishment of AU’s predecessor, the Organization for African Unity (OAU). Despite the challenges, the African countries are committed to the agenda.  ', "limit": 5 }, "http://akb.d2t.co:5000/v1/projects/" + projectname + "/suggest", "POST", function (node) {

			if (node.results.length != 5) console.log(node)
		})
		i++;
	}
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