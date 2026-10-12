var crypto = require('crypto');
var algorithm="aes-128-cbc";

var salt = "Akz!@1970";
var hash = crypto.createHash("sha1");
hash.update(salt);
var key = hash.digest().slice(0, 16);
var iv=key
function  cryptoutil(algorithm,password){
   this.algorithm = algorithm;
   this.password = password;
}  
cryptoutil.prototype.encrypt=function(text,callback) {    
  var cipher = crypto.createCipheriv(algorithm,key,iv)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  callback(crypted);
}
cryptoutil.prototype.decrypt=function(text,callback) {
   var decipher = crypto.createDecipheriv(algorithm,key,iv)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
    callback(dec) 
}
module.exports = new cryptoutil();
