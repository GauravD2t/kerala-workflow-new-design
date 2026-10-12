function retrunjson(fieldarry, callback) {
    var jsonform = {};

    $.each(fieldarry, function () {
        jsonform[this.name] = this.value
    })
    callback(jsonform);
}
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


/*
jQuery(document).ready(function () {
  
    pushtoSrever(null, "/inwardDashboardCouter.dwf" , "GET", function (node) {

        $('#totlabatch_received').html(node.totlabatch_received);
        $('#totalfir_received').html(node.totalfir_received);
        var totalbatch_pendingreceipt=0;
        var totalfir_pendingreceipt=0;

       
        $('#totalbatch_returned').html(node.totalbatch_returned);
        $('#totalfir_returned').html(node.totalfir_returned);
       //delay receipt
       totalbatch_pendingreceipt=totalbatch_pendingreceipt+node.delay_receipt.length;
        $('#totaldelayedbatch').html(node.delay_receipt.length);
        var totaldelayedfir=0;
        var delay_receipt=node.delay_receipt;
        if(delay_receipt.length==0){
            var tr="<tr><td style='text-align: center'>  No records found </td></tr>";
            $('#delayedtbody').append(tr);
        }
        for(var i=0;i<delay_receipt.length;i++){
            totaldelayedfir=totaldelayedfir+delay_receipt[i].firs.length;
            var tr="<tr><td>"+delay_receipt[i].bundlenumber+"<br> <h7 class=' text-muted font-weight-bolder' >"+delay_receipt[i].firs.length+" Cases </h7></td><td>"+moment.utc(delay_receipt[i].deliveryschedule).format('DD/MM/YYYY')+"</td><td><span class='label  bg-danger-o-50 text-danger label-inline font-weight-bold label-lg'>Delayed</span></td></tr>";
            $('#delayedtbody').append(tr);

        }
        totalfir_pendingreceipt=totalfir_pendingreceipt+totaldelayedfir;
        $('#totaldelayedfir').html(totaldelayedfir)

        /// due for delelry
        totalbatch_pendingreceipt=totalbatch_pendingreceipt+node.pending_receipt.length;
      $('#totalbatch_duedelivery').html(node.pending_receipt.length);
        var totalfir_duedelivery=0;
        var pending_receipt=node.pending_receipt;
        if(pending_receipt.length==0){
            var tr="<tr><td style='text-align: center'>  No records found </td></tr>";
            $('#receipttbody').append(tr);
        }
        for(var i=0;i<pending_receipt.length;i++){
            totalfir_duedelivery=totalfir_duedelivery+pending_receipt[i].firs.length;
            var tr="<tr><td>"+pending_receipt[i].bundlenumber+"<br> <h7 class=' text-muted font-weight-bolder' >"+pending_receipt[i].firs.length+" Cases </h7></td><td>"+moment.utc(pending_receipt[i].deliveryschedule).format('DD/MM/YYYY')+"</td><td><span class='label  label-inline font-weight-bold label-lg' style='color:#4CAF50;background-color: #e3f3e3;'> On Time </span></td></tr>";
            $('#receipttbody').append(tr);

        }
        totalfir_pendingreceipt=totalfir_pendingreceipt+totalfir_duedelivery;
        $('#totalfir_duedelivery').html(totalfir_duedelivery)
        ///end due_delivry
        
         $('#totalbatch_pendingreceipt').html(totalbatch_pendingreceipt);
         $('#totalfir_pendingreceipt').html(totalfir_pendingreceipt);
      

        // pending Receipt
        $('#totalbatch_duereceipt').html(node.due_receipt.length);
        $('#totalbatch_pendingreturn').html(node.due_receipt.length);
        var totalfir_duereceipt=0;
        var due_receipt=node.due_receipt;
        if(due_receipt.length==0){
            var tr="<tr><td style='text-align: center'>  No records found </td></tr>";
            $('#retruntbody').append(tr);
        }
        for(var i=0;i<due_receipt.length;i++){
            totalfir_duereceipt=totalfir_duereceipt+due_receipt[i].firs.length;
            if(moment.utc(due_receipt[i].deliveryschedule).format('DD/MM/YYYY')>moment().format('DD/MM/YYYY')){
                var tr="<tr><td>"+due_receipt[i].bundlenumber+"<br> <h7 class=' text-muted font-weight-bolder' >"+due_receipt[i].firs.length+" Cases </h7></td><td>"+moment.utc(due_receipt[i].deliveryschedule).format('DD/MM/YYYY')+"</td><td><span class='label  label-inline font-weight-bold label-lg' style='color:#4CAF50;background-color: #e3f3e3;'> On Time </span></td></tr>";
                $('#retruntbody').append(tr);
            }else{
                var tr="<tr><td>"+due_receipt[i].bundlenumber+"<br> <h7 class=' text-muted font-weight-bolder' >"+due_receipt[i].firs.length+" Cases </h7></td><td>"+moment.utc(due_receipt[i].deliveryschedule).format('DD/MM/YYYY')+"</td><td><span class='label  bg-danger-o-50 text-danger label-inline font-weight-bold label-lg'>Delayed</span></td></tr>";
                $('#retruntbody').append(tr);
            }
        }
        $('#totalfir_duereceipt').html(totalfir_duereceipt)
        $('#totalfir_pendingreturn').html(totalfir_duereceipt);

        // ed receipt

        console.log(node)
    });
    
});

*/