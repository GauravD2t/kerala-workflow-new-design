function batchNumberGenrate(){

}
batchNumberGenrate.prototype.getbatchno=function(batchno,callback) {
    batchno=parseInt(batchno)+1;
    batchno=""+batchno;
    if(batchno.length==3){
        batchno="0"+batchno;
    }else if(batchno.length==2){
        batchno="00"+batchno;
    }else if(batchno.length==1){
        batchno="000"+batchno;
    }
    callback(batchno);
}

  module.exports = new batchNumberGenrate();