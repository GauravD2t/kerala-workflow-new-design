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
  
    pushtoSrever(null, "/dashboradcounter.dwf" , "GET", function (node) {
        $('#totlacreatebatch').html(node.totlacreatebatch);
        $('#totalfircreate').html(node.totalfircreate);
      
        $('#totlareceivedbatch').html(node.totlareceivedbatch);
        $('#totalfirreceived').html(node.totalfirreceived);
        var  totalpendingbatch=0;
       var totalfirpending=0;
       totalpendingbatch=totalpendingbatch+node.delivery_delayed.length;
        $('#totaldelayedbatch').html(node.delivery_delayed.length);
        var totaldelayedfir=0;
        var delivery_delayed=node.delivery_delayed;
       

        if(delivery_delayed.length==0){
            var tr="<tr><td style='text-align: center'>  No records found </td></tr>";
            $('#delayedtbody').append(tr);
        }
        for(var i=0;i<delivery_delayed.length;i++){
            totaldelayedfir=totaldelayedfir+delivery_delayed[i].firs.length;
            var tr="<tr><td>"+delivery_delayed[i].bundlenumber+"<br> <h7 class=' text-muted font-weight-bolder' >"+delivery_delayed[i].firs.length+" Cases </h7></td><td>"+moment.utc(delivery_delayed[i].deliveryschedule).format('DD/MM/YYYY')+"</td><td><span class='label  bg-danger-o-50 text-danger label-inline font-weight-bold label-lg'>Delayed</span></td></tr>";
            $('#delayedtbody').append(tr);

        }
        totalfirpending=totalfirpending+totaldelayedfir;
        $('#totaldelayedfir').html(totaldelayedfir)

        /// due for delelry
        totalpendingbatch=totalpendingbatch+node.Due_Delivery.length;
      $('#totalbatch_duedelivery').html(node.Due_Delivery.length);
        var totalfir_duedelivery=0;
        var Due_Delivery=node.Due_Delivery;
        if(Due_Delivery.length==0){
            var tr="<tr><td style='text-align: center'>  No records found </td></tr>";
            $('#deliverytbody').append(tr);
        }
        for(var i=0;i<Due_Delivery.length;i++){
            totalfir_duedelivery=totalfir_duedelivery+Due_Delivery[i].firs.length;
            var tr="<tr><td>"+Due_Delivery[i].bundlenumber+"<br> <h7 class=' text-muted font-weight-bolder' >"+Due_Delivery[i].firs.length+" Cases </h7></td><td>"+moment.utc(Due_Delivery[i].deliveryschedule).format('DD/MM/YYYY')+"</td><td><span class='label  label-inline font-weight-bold label-lg' style='color:#4CAF50;background-color: #e3f3e3;'> On Time </span></td></tr>";
            $('#deliverytbody').append(tr);

        }
        totalfirpending=totalfirpending+totalfir_duedelivery;
        $('#totalfir_duedelivery').html(totalfir_duedelivery)
        ///end due_delivry
        
        // pending Receipt
        $('#totalbatch_duereceipt').html(node.due_receipt.length);
        $('#totladeliveredbatch').html(node.due_receipt.length);
        var totalfir_duereceipt=0;
        var due_receipt=node.due_receipt;
        if(due_receipt.length==0){
            var tr="<tr><td style='text-align: center'>  No records found </td></tr>";
            $('#receipttbody').append(tr);
        }
        for(var i=0;i<due_receipt.length;i++){
            totalfir_duereceipt=totalfir_duereceipt+due_receipt[i].firs.length;
            if(moment.utc(due_receipt[i].deliveryschedule).format('DD/MM/YYYY')>moment().format('DD/MM/YYYY')){
                var tr="<tr><td>"+due_receipt[i].bundlenumber+"<br> <h7 class=' text-muted font-weight-bolder' >"+due_receipt[i].firs.length+" Cases </h7></td><td>"+moment.utc(due_receipt[i].deliveryschedule).format('DD/MM/YYYY')+"</td><td><span class='label  label-inline font-weight-bold label-lg' style='color:#4CAF50;background-color: #e3f3e3;'> On Time </span></td></tr>";
                $('#receipttbody').append(tr);
            }else{
                var tr="<tr><td>"+due_receipt[i].bundlenumber+"<br> <h7 class=' text-muted font-weight-bolder' >"+due_receipt[i].firs.length+" Cases </h7></td><td>"+moment.utc(due_receipt[i].deliveryschedule).format('DD/MM/YYYY')+"</td><td><span class='label  bg-danger-o-50 text-danger label-inline font-weight-bold label-lg'>Delayed</span></td></tr>";
                $('#receipttbody').append(tr);
            }
        }
        $('#totalfir_duereceipt').html(totalfir_duereceipt)
        $('#totalfirdelivered').html(totalfir_duereceipt);

        $('#totlapendingbatch').html(totalpendingbatch);
        $('#totalfirpending').html(totalfirpending);

        console.log(node)
    });
    
});

*/