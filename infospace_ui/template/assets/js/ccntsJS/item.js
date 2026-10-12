/*
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
jQuery.noConflict();
var data=[];
var node1
var startdate = "";
var enddate = "";
var DspaceObject = 0;
var email;
var IteamList;
var ContextPath = "/auc";
var filtterList = [];
var arr = [];
(function (jQuery) {
    var oTable
    jQuery(document).ready(function () {
		ContextPath = jQuery(".Context").html();
		
		 pushtoSrever(null, ContextPath + "/authorList.csv", "get", function (returnobject) {																			
			console.log(returnobject)
			data =processData(returnobject);
			jQuery("[id^=\"dc_contributor_author_\"]").autocomplete({
				source: data,
				change: function( event, ui ) {
				  val = jQuery(this).val();
				  exists = jQuery.inArray(val,data);
				  if (exists<0) {
					jQuery(this).val(""); //put alert and focus back
					var currentElement = jQuery(this);
					alert("You can only enter the list of authors from dropdown.");
					currentElement.focus();
					return false;
				  }
				data = jQuery.grep(data, function(value) {
					return value != val;
				})
				}
      		});
			function processData(myTxt) {
				var a = [];
				var myLines = myTxt.split(/\r\n|\n/);
				for (var i=1; i<myLines.length; i++) { 
					  a.push(myLines[i].replace(",", ", "));
					}
					console.log(a);
				   return a;
			}

		   })
		 pushtoSrever(null, ContextPath + "/centre.csv", "get", function (returnobject1) {																			
			console.log(returnobject1)
			data1 = processData1(returnobject1);
			jQuery("[id^=\"dc_centre_\"]").autocomplete({
            source: data1,
				change: function( event, ui ) {
				  val = jQuery(this).val();
				  exists = jQuery.inArray(val,data1);
				  if (exists<0) {
					jQuery(this).val(""); //put alert and focus back
					var currentElement = jQuery(this);
					alert("You can only enter the list of centres from dropdown.");
					currentElement.focus();
					return false;
				  }
				data1 = jQuery.grep(data1, function(value) {
					return value != val;
				})
				}
      		});
			function processData1(myTxt1) {
				var a1 = [];
				var myLines1 = myTxt1.split(/\r\n|\n/);
				for (var i=1; i<myLines1.length; i++) { 
					  a1.push(myLines1[i].replace(",", ", "));
					}
					console.log(a1);
				   return a1;
			}

		   })
        console.log(jQuery("#dc_title").length)
		jQuery(document).on("change", ".required", function () {
			 var type = jQuery(this).attr('required');	
			 if (type == "required") {
				 checkPrimaryMetadata()
			 }
		});
		jQuery('#subAccBrowse').on('hide.bs.collapse', function() {
		if(document.getElementById("infotoggleOff").className =="")
		{
			if((document.getElementById("resumable-progress").style.display=="block"))
			{
			}
			else{
				alert("You must add attachment or choose No for \"This item has Attachments\".");
				return false;
			}
		} else {
		}
		});
 		 jQuery(document).on("click", ".doi", function () {
			//alert("fetch metadata ");	
			var dc_identifier_doi = document.getElementById("dc_identifier_doi").value;
			var doi_cite = document.getElementById("dc_identifier_doi_1").value;
			//alert(doi_cite);
			var obj;
			if ((dc_identifier_doi != "") && ( doi_cite == "datacite")){
				pushtoServer(obj, "https://api.datacite.org/dois/" + dc_identifier_doi, "get", function (returnobject) {
					//alert("fetch metadata from DATACITE"+returnobject);
					var publisher = "";
					var language = "";
					var page = "";
					var title = "";
					var type = "";
					var AlternativeTitle ="";
					var authors = [];
					var editors = [];
					var subjects = []; 
					var datesIssue = [];
					var crossRefDetails  = jQuery.parseJSON(returnobject);
					var dataDetails = crossRefDetails.data;
					var attributesDetail = dataDetails.attributes;
					if(attributesDetail.hasOwnProperty("publisher")){
						jQuery("#main_dc_publisher").attr("style", "display:block");
						jQuery("#dc_publisher_1").attr("value", attributesDetail.publisher);
						//alert("fetch metadata from DATACITE publisher---"+attributesDetail.publisher);
					}
					if(attributesDetail.hasOwnProperty("language")){
						//alert("fetch metadata from DATACITE language---"+attributesDetail.language);
						jQuery("#main_dc_language_iso").attr("style", "display:block");
						jQuery("#dc_language_iso").attr("value", attributesDetail.language);
					}
					
					if(attributesDetail.hasOwnProperty("titles")){
						if (attributesDetail.titles.length == 0){
						//	alert("there is not titles value");
						}else{
						var titles = attributesDetail.titles;
							for (var i in titles) {
								title = titles[i].title;
							   	break;
							}
							for (var i in titles) {
								if(titles[i].hasOwnProperty("titleType")){
									if(titles[i].titleType === "AlternativeTitle"){
										AlternativeTitle = titles[i].title ;
									}
								}
							}
						//alert("title -- "+title);
						jQuery("#dc_title").attr("value", title);
						//alert("AlternativeTitle -- "+AlternativeTitle);
						}
					}
					//creators
					if(attributesDetail.hasOwnProperty("creators")){
						if (attributesDetail.creators.length == 0){
						//	alert("there is not creators value");
						}else{
						var creators = attributesDetail.creators;
							for (var i in creators) {
								if(creators[i].nameType === "Personal") 
								authors.push(creators[i].name.replace(", ", "||"));
							}
						//	alert("authors -- "+authors.size());
							for(i=0; i < authors.size(); i++)
							{
								var authorSplit = authors[i].split('||');
								var authorF = "";
								var authorL = "";
								if(authorSplit[i]!="")
								{
									authorF = authorSplit[0];
								}
								if(authorSplit[1]!="")
								{
									authorL = authorSplit[1];
								}
								var j = i+1;
								var FnameId= "#dc_contributor_other_first_"+j;
								var LnameId= "#dc_contributor_other_last_"+j;
							
								jQuery(FnameId).val(authorF);
								jQuery(LnameId).val(authorL);
								if(j<authors.size())
								{
									jQuery("#dc_contributor_other_add").click();
									
								}
								//dc_contributor_other_last_1
								//dc_contributor_other_first_1
							}
						}
					}
					//contributors
					if(attributesDetail.hasOwnProperty("contributors")){
						if (attributesDetail.contributors.length == 0){
						//	alert("there is not contributors value");
						}else{
						var contributors = attributesDetail.contributors;
							for (var i in contributors) {
								if(contributors[i].contributorType === "Editor") 
								editors.push(contributors[i].name.replace(", ", "||"));
							}
							//alert("editors -- "+editors);
							//main_dc_contributor_editor
							if(editors.size()>0){
								jQuery("#main_dc_contributor_editor").attr("style", "display:block");
							}
							for(i=0; i < editors.size(); i++)
							{
								var authorSplit = editors[i].split('||');
								var authorF = "";
								var authorL = "";
								if(authorSplit[i]!="")
								{
									authorF = authorSplit[0];
								}
								if(authorSplit[1]!="")
								{
									authorL = authorSplit[1];
								}
								var j = i+1;
								var FnameId= "#dc_contributor_editor_first_"+j;
								var LnameId= "#dc_contributor_editor_last_"+j;
							
								jQuery(FnameId).val(authorF);
								jQuery(LnameId).val(authorL);
								if(j<editors.size())
								{
									jQuery("#dc_contributor_editor_add").click();
									
								}
								//dc_contributor_other_last_1
								//dc_contributor_other_first_1
							}

						}
					}
					//  Issued dates
					if(attributesDetail.hasOwnProperty("dates")){
						if (attributesDetail.dates.length == 0){
						//	alert("there is not dates value");
						}else{
						var dates = attributesDetail.dates;
							for (var i in dates) {
								if(dates[i].dateType === "Issued") 
								{
									datesIssue.push(dates[i].date);
								}
							}
							//alert("dates -- "+datesIssue);
							var dateSplit = datesIssue[0].split('-');
							var year="", month="", date="";
							if(dateSplit[0]!="")
							{
								year = dateSplit[0];
							//	alert("year -- "+year);
								jQuery("[name=dc_date_issued_year]").val(year);
							}
							if(dateSplit[1]!=undefined)
							{
								month = dateSplit[1];
							//	alert("month -- "+month);
								jQuery("[name=dc_date_issued_month]").val(month);
							}
							if(dateSplit[2]!=undefined)
							{
								date = dateSplit[2];
								//alert("date -- "+date); //dc_date_issued_day
								jQuery("[name=dc_date_issued_day]").val(date);
							}
							
						}
					}
					
					//subjects 
					if(attributesDetail.hasOwnProperty("subjects")){
						if (attributesDetail.subjects.length == 0){
						//	alert("there is not subjects value");
						}else{
						var subject = attributesDetail.subjects;
							for (var i in subject) {
								if(subject[i].subjectScheme != ""){
									if(subject[i].subject != null){
										subjects.push(subject[i].subject); }
								}
							}
							for(t=0; t < subjects.size(); t++)
							{
								//dc_subject_1
								var j = t+1;
								var subjectId= "#dc_subject_"+j;
								jQuery(subjectId).val(subjects[t]);
								//alert("subjects -- "+subjects[t] + subjectId);
							}
						}
					}
				
					
					if(attributesDetail.hasOwnProperty("types")){
						if (attributesDetail.types.length == 0){
							//alert("there is not types value");
						}else{
						var types = attributesDetail.types;
						var citeproc = types.citeproc;
						type = citeproc;	   
						//alert("-- "+type);
						jQuery("#dc_type").val(type);
						}
					}
					if(attributesDetail.hasOwnProperty("sizes")){
						if (attributesDetail.sizes.length == 0){
							//alert("there is not page value");
						}else{
						var sizes = attributesDetail.sizes;
							for (var i in sizes) {
								page = sizes[i];
							   	break;
							}
						//alert("-- "+page);
						//main_dc_page  //dc_page
						jQuery("#main_dc_page").attr("style", "display:block");
						jQuery("#dc_page").attr("value", page);
						}
					}
					
					
				});
			}
			else if ((dc_identifier_doi != "") && ( doi_cite == "crossref")){
				pushtoServer(obj, "https://api.crossref.org/works/" + dc_identifier_doi, "get", function (returnobject) {
					
					var issuedDate = "";
					var publisher = "";
					var issue = "";
					var type = "";
					var language = "";
					var page = "";
					var volume = "";
					var publisher = "";
					var description = "";
					//alert(returnobject);
					//alert("fetch metadata from CROSSREF "+returnobject);
					var crossRefDetails  = jQuery.parseJSON(returnobject);
					//alert("fetch metadata from CROSSREF ---"+crossRefDetails.status);
					//alert("fetch metadata from CROSSREF ---"+crossRefDetails.message);
					var messageDetail = crossRefDetails.message;
					if(messageDetail.hasOwnProperty("publisher")){
						//alert("fetch metadata from CROSSREF publisher---"+messageDetail.publisher);
						jQuery("#main_dc_publisher").attr("style", "display:block");
						jQuery("#dc_publisher_1").attr("value", messageDetail.publisher);
					}if(messageDetail.hasOwnProperty("issue")){
						//alert("fetch metadata from CROSSREF issue---"+messageDetail.issue);
						jQuery("#main_dc_issuenumber").attr("style", "display:block");
						jQuery("#dc_issuenumber").attr("value", messageDetail.issue);
					}if(messageDetail.hasOwnProperty("type")){
						//alert("fetch metadata from CROSSREF type---"+messageDetail.type);
						jQuery("#dc_type").val(messageDetail.type);
					}if(messageDetail.hasOwnProperty("language")){
						//alert("fetch metadata from CROSSREF language---"+messageDetail.language);
						jQuery("#main_dc_language_iso").attr("style", "display:block");
						jQuery("#dc_language_iso").attr("value", messageDetail.language);
					}if(messageDetail.hasOwnProperty("page")){
						//alert("fetch metadata from CROSSREF page---"+messageDetail.page); 
						jQuery("#main_dc_page").attr("style", "display:block");
						jQuery("#dc_page").attr("value", messageDetail.page);
					}if(messageDetail.hasOwnProperty("volume")){
						//alert("fetch metadata from CROSSREF volume---"+messageDetail.volume);
						jQuery("#main_dc_volume").attr("style", "display:block");
						jQuery("#dc_volume").attr("value", messageDetail.volume);
					}
					if(messageDetail.hasOwnProperty("description")){
						//alert("fetch metadata from CROSSREF description---"+messageDetail.description); 
						jQuery("#main_dc_description").attr("style", "display:block");
						jQuery("#dc_description").attr("value", messageDetail.description);
					}
					if(messageDetail.hasOwnProperty("publisher-location")){
						//alert("fetch metadata from CROSSREF publisher-location---"+messageDetail.member); 
					}
					else{
						//alert("publisher location is not there");
					}
					var ISSNs = [];
					var ISBNs = [];
					var titles = [];
					var authors = [];
					var subjects = [];
					var issuedDatefinal; 
						
					if(messageDetail.hasOwnProperty("ISSN")){
						var ISSN = messageDetail.ISSN;
						for (i = 0; i < ISSN.length; i++) {
							//alert("ISSN - "+ISSN[i] + " - " +ISSN.length);
							ISSNs.push(ISSN[i]);
						}
					}
					if(messageDetail.hasOwnProperty("ISBN")){
						var ISBN = messageDetail.ISBN;
						for (i = 0; i < ISBN.length; i++) {
							//alert("ISBN - "+ISBN[i]);
							ISBNs.push(ISBN[i]);
						}
					}
					if(messageDetail.hasOwnProperty("title")){
						var title = messageDetail.title;
						for (i = 0; i < title.length; i++) {
							//alert("title - "+title[i]);
							titles.push(title[i]);
						}
						jQuery("#dc_title").attr("value", titles);
					}
					if(messageDetail.hasOwnProperty("author")){
						var author = messageDetail.author;
						for (i = 0; i < author.length; i++) {
							authors.push(author[i].given + "||" + author[i].family);
							//alert("title - "+ author[i].given + " " + author[i].family);
						}
						//alert(authors.size());
						for(i=0; i < authors.size(); i++)
						{
							var authorSplit = authors[i].split('||');
							var authorF = "";
							var authorL = "";
							if(authorSplit[i]!="")
							{
								authorF = authorSplit[0];
							}
							if(authorSplit[1]!="")
							{
								authorL = authorSplit[1];
							}
							var j = i+1;
							var FnameId= "#dc_contributor_other_first_"+j;
							var LnameId= "#dc_contributor_other_last_"+j;
						
							jQuery(FnameId).val(authorF);
							jQuery(LnameId).val(authorL);
							if(j<authors.size())
							{
								jQuery("#dc_contributor_other_add").click();
								
							}
							//dc_contributor_other_last_1
							//dc_contributor_other_first_1
						}
					}
					if(messageDetail.hasOwnProperty("subject")){
						var subject = messageDetail.subject;
						for (i = 0; i < subject.length; i++) {
							subjects.push(subject[i]);
							//alert("title - "+ author[i].given + " " + author[i].family);
						}
						//alert(subjects);
						for(t=0; t < subjects.size(); t++)
						{
							var j = t+1;
							var subjectId= "#dc_subject_"+j;
							jQuery(subjectId).val(subjects[t]);
							//alert("subjects -- "+subjects[t] + subjectId);
						}
					}
					if(messageDetail.hasOwnProperty("issued")){
						var issued = messageDetail.issued;
							for (var i in issued) {
							   for (var j in issued[i]) {
								 issuedDate = issued[i][j];
								 break;
							   }
							   break;
							}
						if(issuedDate[0]!=undefined)
						{
							year = issuedDate[0];
						//	alert("year -- "+year);
							jQuery("[name=dc_date_issued_year]").val(year);
						}
						if(issuedDate[1]!=undefined)
						{
							month = issuedDate[1];
							//alert("month -- "+month);
							jQuery("[name=dc_date_issued_month]").val(month);
						}
						if(issuedDate[2]!=undefined)
						{
							date = issuedDate[2];
							//alert("date -- "+date); //dc_date_issued_day
							jQuery("[name=dc_date_issued_day]").val(date);
						}
					}
					//alert("done");
					//title
					//author
					//ISSN
					//ISBN
					//issued
				});
			}
			else{
				alert("Please give value for DOI");
			}
			
		});  
 		 jQuery(document).on("click", ".up11", function () {
			var wrapper = jQuery(this).closest('.dataFilerow')
			wrapper.insertBefore(wrapper.prev())
		  });
		  jQuery(document).on("click", ".down11", function () {
			var wrapper = jQuery(this).closest('.dataFilerow')
			wrapper.insertAfter(wrapper.next())
		  });
		jQuery(document).on("click", "#deleteFile", function () {
			var _this=this;
			var class1 = jQuery(this).attr("class");
			//alert("deleteFile -- "+class1); //01597b07-609f-4ec7-992c-da6c360ea638
			var bitstreamID = jQuery(this).parent().parent().parent().parent().find("[class^=\"bitstreamID_\"]").html();
			var obj = {bitstreamID: bitstreamID};
			pushtoSrever(obj, ContextPath + "/dspace-mvc/deleteBitstream", "get", function (returnobject) {
				jQuery(_this).parent().parent().parent().parent().remove();
			//	alert("deletedFile -- "+returnobject); 																			 
			});
			if(jQuery.find(".dataFilerow").length==0){
				document.getElementById("checkMandateU").style.display="none";
				document.getElementById("hintMandateU").style.display="";
			} 
		 });
		jQuery(document).on("click", ".removeThis", function () {
        	var type = jQuery(this).attr('type');
			var _id_wildcard = jQuery(this).attr('dc_element');
			var div = jQuery(this).parent();
			var divID = jQuery(this).parent().attr("id");
			var idarry = divID.split("_")
			var postfix = parseInt(idarry[idarry.length - 1])
			var prefixDiv = idarry.slice(0, idarry.length - 1).join("_") + "_";
			var div_inp = jQuery(div).find('input');
			if(divID.includes("dc_contributor_author_")){
				var value2deleted = jQuery(div_inp).val();
				data.push(value2deleted);
			}
			if(divID.includes("dc_centre_")){
				var value2deleted = jQuery(div_inp).val();
				data1.push(value2deleted);
			}
		//	alert(postfix);
			var noOfDivs = $(div).parent().find("div[id^="+prefixDiv+"]");
			jQuery(div).remove()
			for (var i = 0 ; i <noOfDivs.length; i++) {
				if(i>=postfix){
				var _div = noOfDivs[i];
				var _id = jQuery(_div).attr("id");
				var idarry = _id.split("_")
                var nextID = parseInt(idarry[idarry.length - 1]) - 1;
				var newID = prefixDiv + nextID;
				jQuery(_div).attr("id", newID)
				if (type == "onebox") {
					if (jQuery(_div).find('input').length != 0) {
						var _id = jQuery(_div).find('input').attr("name");
						var idarry = _id.split("_")
						var nextID = parseInt(idarry[idarry.length - 1]) - 1;
						var newInpID = _id_wildcard + "_" + nextID;
						jQuery(_div).find('input').attr("id", newInpID);
						jQuery(_div).find('input').attr("name", newInpID);
					}
            	}
				else if (type == "TwoBox") {
					var inputarry = jQuery(_div).find('input');
					//alert(inputarry.length)					
					for (var k = 0; k < inputarry.length; k++) {
						var _input = inputarry[k];
						var _id = jQuery(_input).attr("name");
						var idarry = _id.split("_")
						var nextID = parseInt(idarry[idarry.length - 1]) - 2;
						_id_wildcard = idarry[idarry.length - 1];
						var newInpID = idarry.slice(0, idarry.length - 1).join("_") + "_" + nextID;
						jQuery(_input).attr("id", newInpID);
						jQuery(_input).attr("name", newInpID);
					}				
            	}
				else if (type == "PersonalName") {
					var inputarry = jQuery(_div).find('input');
					for (var k = 0; k < inputarry.length; k++) {
						var _input = inputarry[k];
						var _id = jQuery(_input).attr("name");
						var idarry = _id.split("_")
						var nextID = parseInt(idarry[idarry.length - 1]) - 1;
						_id_wildcard = idarry[idarry.length - 1];
						var newInpID = idarry.slice(0, idarry.length - 1).join("_") + "_" + nextID;
						jQuery(_input).attr("id", newInpID);
						jQuery(_input).attr("name", newInpID);
					}
            	}
				else if (type == "QualdropValue") {
					var _id = jQuery(_div).find('select').attr("name");
 					var idarry = _id.split("_")
					var nextID = parseInt(idarry[idarry.length - 1]) - 1;
					_id_wildcard = idarry.slice(0, idarry.length - 1).join("_") + "_" + nextID;
					jQuery(_div).find('select').attr("id", _id_wildcard);
					jQuery(_div).find('select').attr("name", _id_wildcard);
					var _id_input = jQuery(_div).find('input').attr("name");
					var id_inputarry = _id_input.split("_")
					var _inputnextID = parseInt(id_inputarry[id_inputarry.length - 1]) - 1;
				    var _id_wil_inputdcard = id_inputarry.slice(0, id_inputarry.length - 1).join("_") + "_" + _inputnextID;
					jQuery(_div).find('input').attr("id", _id_wil_inputdcard);
					jQuery(_div).find('input').attr("name", _id_wil_inputdcard);
            	}
				}
			}
		});
        jQuery(document).on("click", ".addmore", function () {
            var type = jQuery(this).attr('type');
            var _clone = jQuery(this).parent().clone();
            var _id_wildcard = jQuery(this).attr('dc_element');
			
            if (type == "onebox") {
                if ($(_clone).find('input').length != 0) {
                    var _id = $(_clone).find('input').attr("name");
                    var idarry = _id.split("_")
                    var nextID = parseInt(idarry[idarry.length - 1]) + 1;
                    _id_wildcard = _id_wildcard + "_" + nextID;
                    $(_clone).find('input').attr("id", _id_wildcard);
                    $(_clone).find('input').attr("name", _id_wildcard);
					if(_id_wildcard.includes("dc_contributor_author_")){
						$(_clone).find('input').autocomplete({
							 source: data,
							change: function( event, ui ) {
							  val = jQuery(this).val();
							  exists = jQuery.inArray(val,data);
							  if (exists<0) {
								jQuery(this).val(""); //put alert and focus back
								var currentElement = jQuery(this);
								alert("You can only enter the list of authors from dropdown.");
								currentElement.focus();
								return false;
							  }
							data = jQuery.grep(data, function(value) {
								return value != val;
							})
							}
						});
					}
					if(_id_wildcard.includes("dc_centre_")){
						$(_clone).find('input').autocomplete({
							 source: data1,
							change: function( event, ui ) {
							  val = jQuery(this).val();
							  exists = jQuery.inArray(val,data1);
							  if (exists<0) {
								jQuery(this).val(""); //put alert and focus back
								var currentElement = jQuery(this);
								alert("You can only have the list of centres from dropdown.");
								currentElement.focus();
								return false;
							  }
							data1 = jQuery.grep(data1, function(value) {
								return value != val;
							})
							}
						});
					}
					$(_clone).find('input').val('');
					var _divID = $(_clone).attr("id");
					var _dividarry = _divID.split("_")
					var nextDivID = parseInt(_dividarry[_dividarry.length - 1]) + 1;
					var _divid_wildcard = "div_"+ _id_wildcard;
					$(_clone).attr("id", _divid_wildcard);
                }
            }
			else if (type == "TwoBox") {
                var inputarry = $(_clone).find('input');
                var _divID = $(_clone).attr("id");
				var _dividarry = _divID.split("_")
				var nextDivID = parseInt(_dividarry[_dividarry.length - 1]) + 1;
				var _divid_wildcard = "div_"+ _id_wildcard +"_"+nextDivID;
				$(_clone).attr("id", _divid_wildcard);
				for (var i = 0; i < inputarry.length; i++) {
                    var _input = inputarry[i];
                    var _id = jQuery(_input).attr("name");
                    var idarry = _id.split("_")
                    var nextID = parseInt(idarry[idarry.length - 1]) + 2;
                    _id_wildcard = idarry[idarry.length - 1];
                    _id_wildcard = idarry.slice(0, idarry.length - 1).join("_") + "_" + nextID;
                    jQuery(_input).attr("id", _id_wildcard);
                    jQuery(_input).attr("name", _id_wildcard);
					jQuery(_input).val('');
                }				
            }
			else if (type == "PersonalName") {
                var inputarry = $(_clone).find('input');
                var _divID = $(_clone).attr("id");
				var _dividarry = _divID.split("_")
				var nextDivID = parseInt(_dividarry[_dividarry.length - 1]) + 1;
				var _divid_wildcard = "div_"+ _id_wildcard +"_"+nextDivID;
				$(_clone).attr("id", _divid_wildcard);
                for (var i = 0; i < inputarry.length; i++) {
                    var _input = inputarry[i];
                    var _id = jQuery(_input).attr("name");
                    var idarry = _id.split("_")
                    var nextID = parseInt(idarry[idarry.length - 1]) + 1;
                    _id_wildcard = idarry[idarry.length - 1];
                    _id_wildcard = idarry.slice(0, idarry.length - 1).join("_") + "_" + nextID;
                    jQuery(_input).attr("id", _id_wildcard);
                    jQuery(_input).attr("name", _id_wildcard);
					jQuery(_input).val('');
                }
            } else if (type == "QualdropValue") {
                var _id = $(_clone).find('select').attr("name");
                var _divID = $(_clone).attr("id");
				var _dividarry = _divID.split("_")
				var nextDivID = parseInt(_dividarry[_dividarry.length - 1]) + 1;
				var _divid_wildcard = "div_"+ _id_wildcard +"_"+nextDivID;
				$(_clone).attr("id", _divid_wildcard);
                var idarry = _id.split("_")
                var nextID = parseInt(idarry[idarry.length - 1]) + 1;
                _id_wildcard = idarry.slice(0, idarry.length - 1).join("_") + "_" + nextID;
                $(_clone).find('select').attr("id", _id_wildcard);
                $(_clone).find('select').attr("name", _id_wildcard);
                var _id_input = $(_clone).find('input').attr("name");
                var id_inputarry = _id_input.split("_")
                var _inputnextID = parseInt(id_inputarry[id_inputarry.length - 1]) + 1;
               var  _id_wil_inputdcard = id_inputarry.slice(0, id_inputarry.length - 1).join("_") + "_" + _inputnextID;
                $(_clone).find('input').attr("id", _id_wil_inputdcard);
                $(_clone).find('input').attr("name", _id_wil_inputdcard);
				$(_clone).find('input').val('');
            }
            jQuery(this).parent().parent().append(_clone);
			jQuery(this).attr("class", "btn removeThis btn-danger col-md-2");
			jQuery(this).attr("id", "");
			jQuery(this).attr("value", "Remove This");
			//glyphicon glyphicon-trash
			jQuery(this).find('span').attr("class", "glyphicon glyphicon-trash");
			jQuery(this).contents().last()[0].textContent=" Remove This";
        });
        autocomplete_title(document.getElementById("dc_title"));

        var listofdom = document.querySelectorAll("[name^=\"dc_identifier_value_\"]");
        for (var i = 0; i <= listofdom.length; i++) {
            autocomplete_Identifiers(listofdom[i]);
        }

    });
    function autocomplete_title(inp) {
        var currentFocus;
        if(inp != undefined){
        inp.addEventListener("input", function (e) {
            var a, b, i, val = this.value;

            if (val.length > 3) {
                closeAllLists();
                if (!val) {
                    return false;
                }
                currentFocus = -1;
                a = document.createElement("DIV");
                a.setAttribute("id", this.id + "autocomplete-list");
                a.setAttribute("class", "autocomplete-items");
                var txt3 = document.createElement("span");
                txt3.innerHTML = "Existing Item(s) in DSpace (Continuing with same title will be considered as Duplicate Item in DSpace)";
                $(a).append(txt3);
                this.parentNode.appendChild(a);
                var obj = {value: val, Schema: "dc", Element: "title", Qualifier: "", lang: ""};
                pushtoSrever(obj, ContextPath + "/dspace-mvc/getItemTitleList", "get", function (returnobject) {
                    arr = JSON.parse(returnobject)
					console.log(arr);
                    for (i = 0; i < arr.length; i++) {
                        b = document.createElement("DIV");
						b.setAttribute('class', 'autocompletediv');
                        b.addEventListener("click", function (e) {
                            jQuery(this).addClass("autocomplete-active")
                            var index = elementindex();
                            if (index != -1) {
								if(arr[index].id!=undefined){
									alert("Do you want to submit item as duplicate submission? If no then kindly rename title or cancel submission by clicking on Delete.");
								}
							}
						})
                        b.innerHTML = "<a target='_blank' style='color:red' href='handle/" + arr[i].handle + "'><strong>" + arr[i].ItemName.substr(0, val.length) + "</strong>";
                        b.innerHTML += arr[i].ItemName.substr(val.length);
                        b.innerHTML += "<input type='hidden' value='" + arr[i].ItemName + "'>";
                        b.innerHTML += "</br><strong><span style=''> Storage location </span>:</strong> " + arr[i].community + " / " + arr[i].collaction + "</a> "
                        b.addEventListener("click", function (e) {
                            inp.value = this.getElementsByTagName("input")[0].value;
                            closeAllLists();
                        });
                        a.appendChild(b);
                    }
                })
            }

        });

        inp.addEventListener("keydown", function (e) {
            var x = document.getElementById(this.id + "autocomplete-list");
            if (x)
                x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
                currentFocus++;
                addActive(x);
            } else if (e.keyCode == 38) { //up              
                currentFocus--;
                addActive(x);
            } else if (e.keyCode == 13) {
				if(arr[currentFocus].id!=undefined){
					alert("Do you want to submit item as duplicate submission? If no then kindly rename title or cancel submission by clicking on Delete.");
                if (currentFocus > -1) {
                    if (x)
                        x[currentFocus].click();
		            }
				}
				else{
					if (currentFocus > -1) {
            			if (x)	
        	        		x[currentFocus].click();
		            }
                }
            }
        });
        function addActive(x) {

            if (!x)
                return false;

            removeActive(x);
            if (currentFocus >= x.length)
                currentFocus = 0;
            if (currentFocus < 0)
                currentFocus = (x.length - 1);

            x[currentFocus].classList.add("autocomplete-active");
            var handle = arr[currentFocus].handle
            jQuery("#suggestion_dc_title").attr("href", "./handle/" + handle)
            jQuery("#suggestion_dc_title").html(handle)
            console.log(handle);
        }
        function removeActive(x) {
            for (var i = 0; i < x.length; i++) {
                x[i].classList.remove("autocomplete-active");
            }
        }
        function closeAllLists(elmnt) {
            var x = document.getElementsByClassName("autocomplete-items");
            for (var i = 0; i < x.length; i++) {
                if (elmnt != x[i] && elmnt != inp) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        }
		 function elementindex() {
            var x = document.getElementsByClassName("autocompletediv");
            var j = -1;
            for (var i = 0; i < x.length; i++) {
                if (jQuery(x[i]).hasClass("autocomplete-active")) {
                    j = i;
                    break;
                }
            }
            return j;
        }
        document.addEventListener("click", function (e) {
            closeAllLists(e.target);
        });
}
    }
    function autocomplete_Identifiers(inp) {
        var currentFocus;
	if(inp != undefined){
        inp.addEventListener("input", function (e) {
            var a, b, i, val = this.value;
            
            if (val.length > 3) {
                closeAllLists();
                if (!val) {
                    return false;
                }
                currentFocus = -1;
                a = document.createElement("DIV");
                a.setAttribute("id", this.id + "autocomplete-list");
                a.setAttribute("class", "autocomplete-items");
                var txt3 = document.createElement("span");
                txt3.innerHTML = "Existing Item(s) in DSpace (Continuing with same title will be considered as Duplicate Item in DSpace)";
                $(a).append(txt3);
                this.parentNode.appendChild(a);
                var name = this.name.replace("value", "qualifier");
                var obj = {value: val, Schema: "dc", Element: "identifier", lang: "", Qualifier: jQuery("[name=" + name + "]").val()};
                console.log(obj)
                pushtoSrever(obj, ContextPath + "/dspace-mvc/getItemTitleList", "get", function (returnobject) {
                    arr = JSON.parse(returnobject)
                    for (i = 0; i < arr.length; i++) {
                        b = document.createElement("DIV");
						b.setAttribute('class', 'autocompletediv');
                        b.addEventListener("click", function (e) {
                            jQuery(this).addClass("autocomplete-active")
                            var index = elementindex();
                            if (index != -1) {
								if(arr[index].id!=undefined){
									alert("Item with this value already exist in Knowledge Hub. Please update identifier value entered or cancel submission by clicking on Delete.");
								}
							}
						})
                        b.innerHTML = "<a target='_blank' style='color:red' href='handle/" + arr[i].handle + "'><strong>" + arr[i].ItemName.substr(0, val.length) + "</strong>";
                        b.innerHTML += arr[i].ItemName.substr(val.length);
                        b.innerHTML += "<input type='hidden' value='" + arr[i].ItemName + "'>";
                        b.innerHTML += "</br><strong><span style=''> Storage location </span>:</strong> " + arr[i].community + " / " + arr[i].collaction + "</a> "
                        b.addEventListener("click", function (e) {
                            inp.value = this.getElementsByTagName("input")[0].value;
                            closeAllLists();
                        });
                        a.appendChild(b);
                    }
                })
            }

        });

        inp.addEventListener("keydown", function (e) {
            var x = document.getElementById(this.id + "autocomplete-list");
            if (x)
                x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
                currentFocus++;
                addActive(x);
            } else if (e.keyCode == 38) { //up              
                currentFocus--;
                addActive(x);
            } else if (e.keyCode == 13) {
                if(arr[currentFocus].id!=undefined){
					alert("Item with this value already exist in Knowledge Hub. Please update identifier value entered or cancel submission by clicking on Delete.");
                if (currentFocus > -1) {
                    if (x)
                        x[currentFocus].click();
		            }
				}
				else{
					if (currentFocus > -1) {
            			if (x)	
        	        		x[currentFocus].click();
		            }
                }
            }
        });
        function addActive(x) {

            if (!x)
                return false;

            removeActive(x);
            if (currentFocus >= x.length)
                currentFocus = 0;
            if (currentFocus < 0)
                currentFocus = (x.length - 1);

            x[currentFocus].classList.add("autocomplete-active");
            var handle = arr[currentFocus].handle
            jQuery("#suggestion_dc_title").attr("href", "./handle/" + handle)
            jQuery("#suggestion_dc_title").html(handle)
            console.log(handle);
        }
        function removeActive(x) {
            for (var i = 0; i < x.length; i++) {
                x[i].classList.remove("autocomplete-active");
            }
        }
        function closeAllLists(elmnt) {
            var x = document.getElementsByClassName("autocomplete-items");
            for (var i = 0; i < x.length; i++) {
                if (elmnt != x[i] && elmnt != inp) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        }
		function elementindex() {
            var x = document.getElementsByClassName("autocompletediv");
            var j = -1;
            for (var i = 0; i < x.length; i++) {
                if (jQuery(x[i]).hasClass("autocomplete-active")) {
                    j = i;
                    break;
                }
            }
            return j;
        }
        document.addEventListener("click", function (e) {
            closeAllLists(e.target);
        });
	}
}


    pushtoSrever = function (pushObject, url, method, callback) {
        jQuery.ajax({
            async: false,
            type: method,
            dataType: 'text',
            url: url,
            data: pushObject,
            success: function (response) {
                //toastr.success('Data Inserted Successfully!');                
                callback(response);
            },
            error: function (response) {
                //toastr.error('Problem in Deleting Data!');
                console.log("error")
                callback(response)
            }
        });
    }
	
	pushtoServer = function (pushObject, url, method, callback) {
        jQuery.ajax({
            async: false,
            type: method,
            dataType: 'text',
            url: url,
            data: pushObject,
            success: function (response) {
                //toastr.success('Data Inserted Successfully!');                
                callback(response);
            },
            error: function (response) {
                //toastr.error('Problem in Deleting Data!');
				alert("no such DOI found")
                console.log("error")
                //callback(response)
            }
        });
    }

})(jQuery);


	
