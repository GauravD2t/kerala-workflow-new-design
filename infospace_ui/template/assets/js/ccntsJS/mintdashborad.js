
function pushtoSrever(pushObject, url, method, callback) {
  $.ajax({
      async: false,
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
function resetdata(){
  $('#filter1').val([1,2,3]).trigger('change')
  $('#filter2').val([]).trigger('change');
  $('#filter3').val([]).trigger('change');
  $("#fromyear").val("");
  $("#toyear").val("");
  

}
function showdata(){
var policestationlist=$("#filter3").val()
var districtList=$("#filter2").val();
var workstream=$("#filter1").val();
if(workstream.includes("1")){
  $('.digitizationgraph').show();
  $('#divdigitazation').show();
 // $('#').show();
//digishow
}else{
$('.digitizationgraph').hide();
$('#divdigitazation').hide();
//$('#').hide();
}
if(workstream.includes("2")){
  //cipa
  $('.cipagrapg').show();
 // $('#').show();
  $('#divcipa').show();
  }else{
    $('.cipagrapg').hide();
    //$('#').hide();
    $('#divcipa').hide();
  }
  if(workstream.includes("3")){
    $('.gapsgraph').show();
    $('#divgaps').show();
   // $('#').show();
    }else{
      $('.gapsgraph').hide();
      $('#divgaps').hide();
    //  $('#').hide();
    }
var obj={districtList:districtList,workstream:workstream,policestationlist:policestationlist,fromyear:$('.fromyear').val(),toyear:$('.toyear').val()};
console.log(obj)
pushtoSrever(obj, "/getworkstream.dwf", "GET", function (node) {
  $("#digitizationtable >tbody").html("");
$("#cipatable >tbody").html("");
$("#gapstable >tbody").html("");
$("#worktable >tbody").html("")
$("#policetable >tbody").html("");
 var CIAPStage=node.CIAPStage;
 var DigitizationStage=node.DigitizationStage;
 var gaps_stage=node.gaps_stage;
 var policestations=node._policestationList
 var scopeSummary=node.scopesummarylist;
 //workstation list
for(var i=0;i<scopeSummary.length;i++){
  if(workstream.includes(scopeSummary[i].type+"")){
    var tr="<tr><td>"+scopeSummary[i].workStream+"</td>";

    tr=tr+"<td>"+scopeSummary[i].scopeItem+"</td>"+"<td>"+scopeSummary[i].totalQuantity+"</td>";
    tr=tr+"<td>"+scopeSummary[i].completaionStatus+"</td>"+"<td>"+scopeSummary[i].pendingForQC+"</td>";
    tr=tr+"<td>"+scopeSummary[i].validatedDeliverables+"</td>";
    tr=tr+"</tr>";
 // console.log(tr)  
  $("#worktable >tbody").append(tr);
  }
    
}


var digigraph=scopeSummary.find(o => o.scope == "digi_iif_i");
var cipagraph=scopeSummary.find(o => o.scope == "cipa_iif_i");
//validate,inprogress,yettostart
//_demo11([524455,47506,7060224]);
_demo11([parseInt(digigraph.validatedDeliverables),parseInt(digigraph.pendingForQC)+parseInt(digigraph.completaionStatus),digigraph.totalQuantity-parseInt(digigraph.pendingForQC)-parseInt(digigraph.completaionStatus)-parseInt(digigraph.validatedDeliverables)]);
_demo12([parseInt(cipagraph.validatedDeliverables),parseInt(cipagraph.pendingForQC)+parseInt(cipagraph.completaionStatus),cipagraph.totalQuantity-parseInt(cipagraph.pendingForQC)-parseInt(cipagraph.completaionStatus)-parseInt(cipagraph.validatedDeliverables)]);
_demo13([0,0,0]);
 //police station list
for(var i=0;i<policestations.length;i++){
  var tr="<tr><td>"+policestations[i].district+"</td><td>"+policestations[i].ps_name+"</td>";
  var scope=policestations[i].scope;
      tr=tr+"<td>"+scope.IIF1+"</td>"+"<td>"+scope.IIF2+"</td>"+"<td>"+scope.IIF3+"</td>"+"<td>"+scope.IIF4+"</td>";
      tr=tr+"<td>"+scope.IIF5+"</td>"+"<td>"+scope.IIF6+"</td>"+"<td>"+scope.IIF7+"</td>"+"<td>"+scope.Scanning+"</td>";
      tr=tr+"</tr>";
   // console.log(tr)  
    $("#policetable >tbody").append(tr);

}
  for(var i=0;i<CIAPStage.length;i++){
    
    var tr="<tr><td>"+CIAPStage[i].scope_item+"</td>";
    tr=tr+"<td>"+CIAPStage[i].estimated+"</td>"+"<td>"+CIAPStage[i].processed+"</td>";
    tr=tr+"<td>"+CIAPStage[i].inward+"</td>"+"<td>"+CIAPStage[i].internal+"</td>";
    tr=tr+"<td>"+CIAPStage[i].police+"</td>";
    
    tr=tr+"<td>"+CIAPStage[i].inchange+"</td>";
    tr=tr+"<td>"+CIAPStage[i].spoffice+"</td>";
    tr=tr+"<td>"+CIAPStage[i].statenodal+"</td>";
    tr=tr+"<td>"+CIAPStage[i].validated+"</td>";
    
    tr=tr+"</tr>";
  
    $("#cipatable >tbody").append(tr);
    
    }

    for(var i=0;i<DigitizationStage.length;i++){
      var tr="<tr><td>"+DigitizationStage[i].scope_item+"</td>";
      tr=tr+"<td>"+DigitizationStage[i].estimated+"</td>"+"<td>"+DigitizationStage[i].inward+"</td>";
      tr=tr+"<td>"+DigitizationStage[i].processed+"</td>"+"<td>"+DigitizationStage[i].internal+"</td>";
      tr=tr+"<td>"+DigitizationStage[i].police+"</td>";
      
      tr=tr+"<td>"+DigitizationStage[i].inchange+"</td>";
      tr=tr+"<td>"+DigitizationStage[i].spoffice+"</td>";
      tr=tr+"<td>"+DigitizationStage[i].statenodal+"</td>";
      tr=tr+"<td>"+DigitizationStage[i].validated+"</td>";
      
      tr=tr+"</tr>";
      
      $("#digitizationtable >tbody").append(tr);
     
      // $("#gapstable >tbody").append(tr);
      }
    
      for(var i=0;i<gaps_stage.length;i++){
        var tr="<tr><td>"+gaps_stage[i].scope_item+"</td>";
        tr=tr+"<td>"+gaps_stage[i].estimated+"</td>"+"<td>"+gaps_stage[i].inward+"</td>";
        tr=tr+"<td>"+gaps_stage[i].processed+"</td>"+"<td>"+gaps_stage[i].internal+"</td>";
        tr=tr+"<td>"+gaps_stage[i].police+"</td>";
        
        tr=tr+"<td>"+gaps_stage[i].inchange+"</td>";
        tr=tr+"<td>"+gaps_stage[i].spoffice+"</td>";
        tr=tr+"<td>"+gaps_stage[i].statenodal+"</td>";
        tr=tr+"<td>"+gaps_stage[i].validated+"</td>";
        
        tr=tr+"</tr>";
        
        
       
         $("#gapstable >tbody").append(tr);
        }
})
 

}
function getpolicestation(){
  var districtList=$("#filter2").val();
  var obj={districtList:districtList};
console.log(obj)
pushtoSrever(obj, "/MULTIPLEpolicestationsbydistrict.dwf", "GET", function (node) {
  $('#filter3').html("")
  console.log(node.data.length)
  for(var i=0;i<node.data.length;i++){
    $('#filter3').append("<option value="+node.data[i].ps_cd+">"+node.data[i].ps+"</option>")
  }
})
}
function showhideworktable(dom){
 
  if($(dom).hasClass("fa-plus")){
    $('#worktable').show()
    $(dom).removeClass("fa-plus");
    $(dom).addClass("fa-minus")
   
  }else{
    $(dom).removeClass("fa-minus")
    $(dom).addClass("fa-plus")
    $('#worktable').hide()
  }
}
function showhidepolicetable(dom){
  if($(dom).hasClass("fa-plus")){
    $('#policetable').show()
    $(dom).removeClass("fa-plus");
    $(dom).addClass("fa-minus")
   
  }else{
    $(dom).removeClass("fa-minus")
    $(dom).addClass("fa-plus")
    $('#policetable').hide()
  }
}
function showhidedigitizationtable(dom){
  if($(dom).hasClass("fa-plus")){
    $('#digitizationtable').show()
    $(dom).removeClass("fa-plus");
    $(dom).addClass("fa-minus")
   
  }else{
    $(dom).removeClass("fa-minus")
    $(dom).addClass("fa-plus")
    $('#digitizationtable').hide()
  }
}

function showhidesipatable(dom){
  if($(dom).hasClass("fa-plus")){
    $('#cipatable').show()
    $(dom).removeClass("fa-plus");
    $(dom).addClass("fa-minus")
   
  }else{
    $(dom).removeClass("fa-minus")
    $(dom).addClass("fa-plus")
    $('#cipatable').hide()
  }
}

function showhidegapstable(dom){
  if($(dom).hasClass("fa-plus")){
    $('#gapstable').show()
    $(dom).removeClass("fa-plus");
    $(dom).addClass("fa-minus")
   
  }else{
    $(dom).removeClass("fa-minus")
    $(dom).addClass("fa-plus")
    $('#gapstable').hide()
  }
}
jQuery(document).ready(function () {
  $('.numberOnly').bind('keyup paste', function () {
    this.value = this.value.replace(/[^0-9]/g, '');
});
$('.fromyear').bind('keyup paste', function () {
  $(".toyear").val(this.value );
});

$('.toyear').focusout(function(){ 
 
  if( parseInt(this.value) < parseInt($('.fromyear').val()))
      {   this.value ="";
          $(this).focus();
          toastr.error("Year should be greater than from year")
      }
});
$('.year').focusout(function(){
 
    var current_year=new Date().getFullYear();
    if( parseInt(this.value) > current_year)
        {   this.value ="";
            $(this).focus();
            toastr.error("Year should be less than current year")
        }
});
    $('#filter1').select2({
        placeholder: "Select work Stream",
        allowClear: false
    });
    $('#filter2').select2({
        placeholder: "Select District",
        allowClear: false
    });
    $('#filter3').select2({
        placeholder: "Select Police Station",
        allowClear: false
    });
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
    $('#kt_datepicker_5').datepicker({
        rtl: KTUtil.isRTL(),
        todayHighlight: true,
        templates: arrows
    });
    $('#start').val(moment().clone().startOf('month').format("DD/MM/YYYY"))
    $('#end').val(moment().format("DD/MM/YYYY"))
    showdata();
    
});
const yettostart = '#ff0000';
const inprogress  = '#475c94';
const  validated= '#77ff6e';

var _demo11 = function (data) {
  $('#chart_11').html("")
    const apexChart = "#chart_11";
    var options = {
        plotOptions: {
            pie: {
              startAngle: 0,
              endAngle: 360,
              expandOnClick: true,
              offsetX: 0,
              offsetY: 0,
              customScale: 1,
              dataLabels: {
                  offset: 0,
                  minAngleToShowLabel: 10
              }, 
              donut: {
                size: '70%',
                background: 'transparent',
                labels: {
                  show: true,
                  name: {
                    show: true,
                    fontSize: '22px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 600,
                    color: undefined,
                    offsetY: -10,
                    formatter: function (val) {
                      return val
                    }
                  },
                  value: {
                    show: true,
                    fontSize: '16px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 400,
                    color: undefined,
                    offsetY: 16,
                    formatter: function (val) {
                      return val
                    }
                  },
                  total: {
                    show: true,
                    showAlways: true,
                    label: 'Digitization',
                    fontSize: '12px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 600,
                    color: '#373d3f',
                    formatter: function (w) {
                      return w.globals.seriesTotals.reduce((a, b) => {
                        return ""
                      }, 0)
                    }
                  }
                }
              },      
            }
          },
        series: data,
        chart: {
            width: '100%',
            type: 'donut',
         
        },
        labels:['Validated','In Progress','Yet to start'],
        dataLabels: {
            enabled: false
          },   
        responsive: [{
            breakpoint: 480,
           
        }], legend: {
          show:false
         },
         colors: [validated,inprogress,yettostart  ]
    };
   
    var chart = new ApexCharts(document.querySelector(apexChart), options);
    chart.render();
   
}

var _demo12 = function (data) {
    const apexChart = "#chart_12";
    $('#chart_12').html("")
    var options = {
        plotOptions: {
            pie: {
              startAngle: 0,
              endAngle: 360,
              expandOnClick: true,
              offsetX: 0,
              offsetY: 0,
              customScale: 1,
              dataLabels: {
                  offset: 0,
                  minAngleToShowLabel: 0.1
              }, 
              donut: {
                size: '70%',
                background: 'transparent',
                labels: {
                  show: true,
                  name: {
                    show: true,
                    fontSize: '22px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 600,
                    color: undefined,
                    offsetY: -10,
                    formatter: function (val) {
                      return val
                    }
                  },
                  value: {
                    show: true,
                    fontSize: '16px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 400,
                    color: undefined,
                    offsetY: 16,
                    formatter: function (val) {
                      return val
                    }
                  },
                  total: {
                    show: true,
                    showAlways: true,
                    label: 'CIPA Migration',
                    fontSize: '12px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 600,
                    color: '#373d3f',
                    formatter: function (w) {
                      return w.globals.seriesTotals.reduce((a, b) => {
                        return "";
                      }, 0)
                    }
                  }
                }
              },      
            }
          },
        series: data,
        chart: {
            width: '100%',
            type: 'donut',
            
          
        },
        labels:['Validated','In Progress','Yet to start'],
        dataLabels: {
            enabled: false
          },   
        responsive: [{
            breakpoint: 480,
            
        }],legend: {
          show:false,
         },
         colors: [validated,inprogress,yettostart  ]
    };

    var chart = new ApexCharts(document.querySelector(apexChart), options);
    chart.render();
   
}

var _demo13 = function (data) {
  $('#chart_13').html("")
  const apexChart = "#chart_13";
  var options = {
      plotOptions: {
          pie: {
            startAngle: 0,
            endAngle: 360,
            expandOnClick: true,
            offsetX: 0,
            offsetY: 0,
            customScale: 1,
            dataLabels: {
                offset: 0,
                minAngleToShowLabel: 10
            }, 
            donut: {
              size: '70%',
              background: 'transparent',
              labels: {
                show: true,
                name: {
                  show: true,
                  fontSize: '22px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: 600,
                  color: undefined,
                  offsetY: -10,
                  formatter: function (val) {
                    return val
                  }
                },
                value: {
                  show: true,
                  fontSize: '16px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: 400,
                  color: undefined,
                  offsetY: 16,
                  formatter: function (val) {
                    return val
                  }
                },
                total: {
                  show: true,
                  showAlways: true,
                  label: 'Gaps Digitization',
                  fontSize: '12px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: 600,
                  color: '#373d3f',
                  formatter: function (w) {
                    return w.globals.seriesTotals.reduce((a, b) => {
                      return ""
                    }, 0)
                  }
                }
              }
            },      
          }
        },
      series: data,
      chart: {
          width: '100%',
        
          type: 'donut',
          
        
      },
      labels:['Validated','In Progress','Yet to start'],
      dataLabels: {
          enabled: false
        },   
      responsive: [{
          breakpoint: 480,
      }],
      legend: {
       show:false
      },
      colors: [validated,inprogress,yettostart  ]
  };

  var chart = new ApexCharts(document.querySelector(apexChart), options);
  chart.render();
  $('.legendshow').show()
}