var connection = null;
var env       = process.env.NODE_ENV || 'development';
//var env       = process.env.NODE_ENV || 'production';
var config    = require( './../config/config.js')[env];
let http=require('http')
function httpService() {
}
httpService.prototype.post = function (url,param, callback) {    
    var _headers= {'Content-Type': 'application/json'};
    if(param.jwtkey !=undefined && param.jwtkey != null){
      //  _headers.Authorization='Bearer '+param.jwtkey
    }
    var post_options = {
        host: config.host,
        port: config.port,
        path: url,
        method: 'POST',        
        headers:_headers
    };
    
    var post_req = http.request(post_options, function(res) {
        res.statusCode
        res.setEncoding('utf8');
        var body = '';
        res.on('data', function (d) {
            body += d;            
        });
        res.on('end', function() { 
            callback({statusCode: res.statusCode,data:body});
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
        callback({statusCode: res.statusCode});
    });
    post_req.write(JSON.stringify(param));
    post_req.end(); 
}
httpService.prototype.delete = function (url,param, callback) {   
    var _headers= {'Content-Type': 'application/json'};
    if(param.jwtkey !=undefined && param.jwtkey != null){
        //_headers.Authorization='Bearer '+param.jwtkey
    }
    var post_options = {
        host: config.host,
        port: config.port,
        path: url,
        method: 'delete',        
        headers: _headers
    };
    var post_req = http.request(post_options, function(res) {
        res.setEncoding('utf8');
        var body = '';
        res.on('data', function (d) {            
            body += d;            
        });
        res.on('end', function() {             
            callback(body);
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
        callback(null);
    });
    post_req.end(); 
}
httpService.prototype.get = function (url,param, callback) { 
    var _headers= {'Content-Type': 'application/json'};
    if(param.jwtkey !=undefined && param.jwtkey != null){
       // _headers.Authorization='Bearer '+param.jwtkey
    }      
    var post_options = {
        host: config.host,
        port: config.port,
        path: url,
        method: 'GET',        
        headers: _headers
    };    
    var post_req = http.request(post_options, function(res) {
        res.setEncoding('utf8');
        var body = '';
        res.on('data', function (d) {
            body += d;            
        });
        res.on('end', function() {             
            callback(body);
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
        callback(null);
    });
    
    post_req.end(); 
}
httpService.prototype.put = function (url,param, callback) { 
    var _headers= {'Content-Type': 'application/json'};
    if(param.jwtkey !=undefined && param.jwtkey != null){
       // _headers.Authorization='Bearer '+param.jwtkey
    }      
    var post_options = {
        host: config.host,
        port: config.port,
        path: url,
        method: 'PUT',        
        headers: _headers
    };
    
    var post_req = http.request(post_options, function(res) {
        res.setEncoding('utf8');
        var body = '';
        res.on('data', function (d) {
            body += d;            
        });
        res.on('end', function() {
            callback(body);
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
        callback(null);
    });
    post_req.write(JSON.stringify(param));
    post_req.end(); 
}
module.exports = new httpService();