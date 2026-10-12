var dateFormat = require('dateformat');
function  textutil(){
}  
textutil.prototype.isvalidEmailID=function(email) {    
   var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
   console.log("email:::::::"+email    )
     if (reg.test(email) == false){            
          return false;
      }
      return true;
}
textutil.prototype.ismatchPassword=function(pass1,pass2) {
   if(pass1==pass2){
       return true
   }else{
       return false
   }
}
textutil.prototype.isEmpty=function(text){
  if(text.length !=0 && text != "" && text != null && text !=undefined ){
        return false
  }else{
      return true;
  }  
}
textutil.prototype.getFormatedDate=function (date,callback){
  callback(dateFormat(date, "YYYY/MM/DD h:MM:ss"));  
}
module.exports = new textutil();
