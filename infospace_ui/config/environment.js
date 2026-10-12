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
var jsonUtil = require('../util/jsonUtil.js');
var httpService = require('../service/httpService.js')
var swig = require('swig');
var env       = process.env.NODE_ENV || 'development';
//var env       = process.env.NODE_ENV || 'production';
var config    = require( './config.js')[env];
global.BatchStatusEnum = require('../util/batchStatusEnum.js')

function enviroment(app,session) {
    app.set('views', [path.join(mainpath + '/views'), path.join(mainpath + '/views/layout')]);
    //app.set('views', path.join(__dirname+'/app/views'));    
    app.engine('html', swig.renderFile);
    app.set('view engine', 'html');
    app.set("views", "views")
    app.use(methodOverride('_method'))    
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(cookieParser());
    app.use(session);
    app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));    
    app.use(bodyParser.json());    
    app.use("/template", express.static(path.join(mainpath, 'template')));
    app.use(bodyParser());    
    app.all('/service/*.ser', function (req, res, next) {        
        if(req.session != undefined  && req.session.user != undefined){             
            req.body.jwtkey= req.session.user.jwt;   
            next();
        }else{
            req.session.destroy(); 
            res.send({status:false,message:"Forbidden"})
        }
    })
    app.all('*.dwf', function (req, res, next) {        
        if(req.session != undefined  && req.session.user != undefined){      
           req.body.jwtkey= req.session.user.jwt;            
           httpService.get("/users/" + req.session.user.user.id, req.body, function (node) {
               var userobject=JSON.parse(node);
               if(userobject.sessionid === req.session.id){                   
                    next();
               }else{
                res.setHeader('Content-Type', 'text/html');
                res.status(200);
                req.session.destroy();                
                res.redirect('/')
               }
           }) 
        }else{
            res.setHeader('Content-Type', 'text/html');
            res.status(200);
            req.session.destroy();
            res.redirect('/')
        }
    });
    app.all('*', function (req, res, next) {  
        if(req.session != undefined  && req.session.user != undefined){      
            req.body.jwtkey= req.session.user.jwt; 
            res.locals.user=req.session.user.user;             
            if(req.session.menugroup != undefined){                              
					res.locals.menugroup=req.session.menugroup  
 
            }
            
         }
         next();
    });
    
}
module.exports = enviroment


