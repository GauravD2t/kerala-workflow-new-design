var _ = require('lodash');
var RDPServerConstraint=require('../constraint/RDPServerConstraint.js')
function  jsonUtil(){
    
}
jsonUtil.prototype.getRaDomNumber=function (){
     var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 5; i++){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
jsonUtil.prototype.omitKeys=function(collection, excludeKeys) {
  function omitFn(value) {
    if (value && typeof value === 'object') {
      excludeKeys.forEach((key) => {
        delete value[key];
      });
    }
  }

  return _.cloneDeepWith(collection, omitFn);
}
jsonUtil.prototype.isauthorizedres=function (req,callback){       
    if(req.body.authkey != undefined && req.body.pass != undefined){
       
       if(req.body.authkey== RDPServerConstraint.authkey && req.body.pass== RDPServerConstraint.pass ){
           callback(RDPServerConstraint.successstatus)
       }else{
        callback(RDPServerConstraint.failstatus)   
       }
    }else{
        callback(RDPServerConstraint.failstatus)
    }    
}
module.exports = new jsonUtil();