/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var jsonUtil = require('../util/jsonUtil.js')
var swig = require('swig');
var env       = process.env.NODE_ENV || 'development';
//var env       = process.env.NODE_ENV || 'production';
var config    = require( './config.js')[env];

function enviroment(app,session) {
    app.set('views', [path.join(mainpath + '/views'), path.join(mainpath + '/views/layout')]);
    //app.set('views', path.join(__dirname+'/app/views'));    
    app.engine('html', swig.renderFile);
    app.set('view engine', 'html');
    app.use(methodOverride('_method'))    
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(session);
    app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));    
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use("/template", express.static(path.join(mainpath, 'template')));
    app.use(bodyParser());
    app.all('*.rdp', function (req, res, next) {        
        if(req.session != undefined  && req.session.user != undefined){            
           next();
        }else{
            res.setHeader('Content-Type', 'text/html');
            res.status(200);
            res.redirect('/')
        }
    });
    app.all('*.auth', function (req, res, next) { 
        if(req.header('key') != undefined && "patson@akz@!1970" == req.header('key') ){
            next();
        }else{
                res.setHeader('Content-Type', 'text/html');
                res.status(403);
                res.send({status:false,message:"access deny please contact your service provider"})
        }
    } );  
    app.all('*.service', function (req, res, next) { 
            var user=req.session.user;    
            console.log("config.key::::"+config.key)
            if(req.header('key') != undefined && config.key == req.header('key') && user != undefined && user.isactive == true){
                next();
            }else{
                res.setHeader('Content-Type', 'text/html');
                res.status(403);
                res.send({status:false,message:"access deny please contact your service provider"})
        }          
    });
}
module.exports = enviroment


