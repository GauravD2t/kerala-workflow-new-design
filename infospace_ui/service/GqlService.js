var connection = null;
import { GraphQLClient, gql } from 'graphql-request'
var env       = process.env.NODE_ENV || 'development';
//var env       = process.env.NODE_ENV || 'production';
var config    = require( '../config/config.js')[env];
let http=require('http')
function GqlService() {
}
 GqlService.prototype.post = async function (url,param, callback) {    
    var _headers= {'Content-Type': 'application/json'};
    if(param.jwtkey !=undefined && param.jwtkey != null){
        _headers.Authorization='Bearer '+param.jwtkey
    }    
    var post_options = {
        host: config.host,
        port: config.port,
        path: url,
        method: 'POST',        
        headers:_headers
    };
    const graphQLClient = new GraphQLClient(onfig.host+config.port+"/"+url,{
        headers:_headers})
    const data = await graphQLClient.request(param)
    console.log(JSON.stringify(data))    
    callback(data)
}
module.exports = new GqlService();