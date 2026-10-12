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

 
  function checkall(){
      if($('#iif1').prop('checked')) {
        $('#fileuploadtbody .ckhform').prop('checked', true); 
        $('#fileuploadtbody .ckhform').attr('value','true');
    } else {
        $('#fileuploadtbody  .ckhform').prop('checked', false); 
        $('#fileuploadtbody  .ckhform').attr('value','false');
    }
        
  }
  function sumbitFIR(){
    var jsonform=[]
   
    $('#worktable >tbody input:checked').each(function() {
     
        jsonform.push(this.name)
      
    });
    if(jsonform.length==0){
        toastr.error("Select one file !");
    }else{
      $.blockUI();
      pushtoSrever({'selectedfile':jsonform}, "/bulkuploadgile.dwf", "GET", function (node) {
        getFIRreject();
        $.unblockUI();
      })
       
    }
    console.log(jsonform);
  }
function getFIRreject(){
    
    pushtoSrever(null, "/findFIRnotUpload.dwf", "GET", function (node) {
        $("#worktable >tbody").html("");
        if(node.data.length==0){
            $("#worktable >tbody").html("<tr><td style='text-align:center' colspan='3'>Data not found !</td></tr>");
        }else{
            debugger;
            node=  node.data;
            for(var i=0;i<node.length;i++){
              var filePath="";
                 filePath="/"+node[i].batch.created_by_d2.policestation.district.state.state_cd+"/"+node[i].batch.created_by_d2.policestation.district.district_cd+"/"+node[i].batch.created_by_d2.policestation.ps_cd+"/"+node[i].firregisternumber+".pdf";
                var stringupload=node[i].firregisternumber+","+node[i].year+","+node[i].firserialnumber+","+node[i].batch.created_by_d2.policestation.ps+","+node[i].batch.created_by_d2.policestation.district.district+","+filePath;
                var tr='<tr><td> <div class="checkbox-inline"><label class="checkbox"><input type="checkbox" class="ckhform" id="'+stringupload+'" name="'+stringupload+'"  value="false" tabindex="1"/><span class="border-primary" ></span></label></div></td>';
                 tr=tr+"<td>"+node[i].batch.bundlenumber+"</td>";
                 tr=tr+"<td>"+node[i].firregisternumber+"</td>"+"<td>"+node[i].firserialnumber+"</td>";
                 tr=tr+"<td>"+node[i].year+"</td>";
                 tr=tr+'<td><a tabindex="1" name="'+stringupload+'" onclick="uploadfir(this)"  class="editbtn btn btn-icon btn-light font-weight-bolder btn-hover-primary btn-sm" title="Update File" ><i class="fas fa-upload text-dark icon-md"></i></a></td>';
                 tr=tr+"</tr>";
      
                 $("#worktable >tbody").append(tr);
            }

           
        }
       
       

    })

    
  }
function uploadfir(data){
  var jsonform=[];
  jsonform.push($(data).attr('name'));
    var data=$(data).attr('name').split(",");
    var firregisterno=data[0];
    var year=data[1];
    var firserialno=data[2];
    var ps=data[3];
    var district=data[4];
    var filepath=data[5];
    console.log(filepath);
    pushtoSrever({'selectedfile':jsonform}, "/bulkuploadgile.dwf", "GET", function (node) {

    })
   // firregisterno.substring(0,2);
   // firregisterno.substring(2,5);
    //firregisterno.substring(5,8);

   

}
  jQuery(document).ready(function () {
    $(document).on('click', '.ckhform', function () {
  
        if ($(this).is(':checked')) {
          $(this).attr('value', 'true');
        } else {
          $(this).attr('value', 'false');
        }
        
       
      });
    getFIRreject();
  })