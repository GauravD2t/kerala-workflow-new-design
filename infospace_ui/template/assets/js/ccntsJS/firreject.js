
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
    $('#filter3').val([]).trigger('change');
}
  function getFIRreject(){
    var policestationlist=$("#filter3").val()
    var obj={policestationlist:policestationlist};
    console.log(obj)
    pushtoSrever(obj, "/findRejectFIRBYPoliceStation.dwf", "GET", function (node) {
        $("#worktable >tbody").html("");
        if(node.result.length==0){
            $("#worktable >tbody").html("<tr><td style='text-align:center' colspan='3'>Data not found !</td></tr>");
        }else{
            node=  node.result;
            for(var i=0;i<node.length;i++){
                var tr="<tr><td>"+node[i].fir_reg_no+"</td>";
                 tr=tr+"<td>"+node[i].reject_by+"</td>"+"<td>"+node[i].reject_reason+"</td>";
                 tr=tr+"</tr>";
      
                 $("#worktable >tbody").append(tr);
            }

           
        }
       
       

    })
  }

  jQuery(document).ready(function () {
    $('#filter3').select2({
        placeholder: "Select Police Station",
        allowClear: false
    });
  })