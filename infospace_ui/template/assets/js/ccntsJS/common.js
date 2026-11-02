var ESTABLISHMENTS = [
    ['KLER57', 'Additional Special Sessions Court /SPE/CBI-III, Ernakulam'],
    ['KLER75', 'Addl. Chief Judicial Magistrate (Special Court for Cases Related to MPs/MLAs), Ernakulam'],
    ['KLER23', 'Addl. Chief Judicial Magistrate Court (Economic Offense), Ernakulam'],
    ['KLER06', 'Addl. Chief Judicial Magistrate Court, Ernakulam'],
    ['KLER56', 'Addl. District Court for cases against Atrocities and Sexual violence against women and children, Ernakulam'],
    ['KLER05', 'Chief Judicial Magistrate Court, Ernakulam'],
    ['KLER78', 'Commercial Court, Ernakulam'],
    ['KLER01', 'District and Sessions Court/Rent Control Appellate Authority, Ernakulam'],
    ['KLER14', 'Family Court, Ernakulam'],
    ['KLER71', 'Judicial First Class Magistrate Court (NI Act), Ernakulam'],
    ['KLER68', 'Judicial First Class Magistrate Court IX, Ernakulam'],
    ['KLER66', 'Judicial First Class Magistrate Court VIII, Ernakulam'],
    ['KLER07', 'Judicial First Class Magistrate Court I, Ernakulam'],
    ['KLER08', 'Judicial First Class Magistrate Court II, Ernakulam'],
    ['KLER09', 'Judicial First Class Magistrate Court III, Ernakulam'],
    ['KLER10', 'Judicial First Class Magistrate Court IV, Ernakulam'],
    ['KLER11', 'Judicial First Class Magistrate Court V, Ernakulam'],
    ['KLER12', 'Judicial First Class Magistrate Court VI, Ernakulam'],
    ['KLER13', 'Judicial First Class Magistrate Court VII, Ernakulam'],
    ['KLER88', 'Juvenile Justice Board, Ernakulam'],
    ['KLER19', 'Motor Accidents Claims Tribunal, Ernakulam'],
    ['KLER04', 'Munsiff Court, Ernakulam'],
    ['KLER15', 'Special Court /SPE/CBI-I/PMLA, Ernakulam'],
    ['KLER18', 'Special Court for NIA Cases/SPE/CBI-II, Ernakulam'],
    ['KLER89', 'Special Court for the trial of offences under the SC and ST PoA Act 1989, Ernakulam'],
    ['KLER92', 'Special Court for trial of cases under Narcotic Drugs and Psychotropic Substances Act, 1985, Ernakulam'],
    ['KLER17', 'Special Court for/NIA Cases/SPE/CBI-I, Ernakulam'],
    ['KLER16', 'Special Court SPE.CBI-II, Ernakulam'],
    ['KLER02', 'State Transport Appellate Tribunal'],
    ['KLER03', 'Sub Court, Ernakulam']
].map(function (row) { return { courtCode: row[0], courtName: row[1] }; });


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