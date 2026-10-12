global.mainpath = __dirname
var express = require('express');
var http = require('http');
var LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');
var mosca = require('mosca');
var fs = require("fs")
var app = express();



app.use(express.static(__dirname + 'public'));
// var options = {
//     key: fs.readFileSync('./crt/server.key'),
//     cert: fs.readFileSync('./crt/server.crt')
//   };
var session = require('express-session')({
    secret: 'abz!@1970',
    resave: false,
    saveUninitialized: false,
    name: 'kdwf.sid',
    cookie: { maxAge: 60 * 60 * 1000 }

});

var environment = require('./config/environment');
var routHandler = require('./routes/routHandler');
var connection = require('./config/connection');



var serverPort = 91;
var server = http.createServer(app);
server.timeout = 60 * 90 * 1000;

new environment(app, session)

var allromms = [];
new routHandler(app, null);
server.listen(serverPort, function () {
    console.log('server up and running at %s port:::', serverPort);
});
