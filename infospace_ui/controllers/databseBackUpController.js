const {execute} = require('@getvim/execute');
const dotenv = require('dotenv');
const fs = require("fs");
var path = require('path');
var httpService = require('../service/httpService.js')
const    {startSchedule} = require('../service/startSchedule.js');
dotenv.config();
const username = process.env.DB_USERNAME;
const database = process.env.DB_NAME;
const date = new Date();
const currentDate = `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}.${date.getHours()}.${date.getMinutes()}`;
const fileName = `database-backup-${currentDate}.tar`;
function databseBackUpController() {
}
databseBackUpController.prototype.backupPage = function (req, res) {
    //backup();
    res.render('backupdatabse', { title: 'BackUp Database', locals: res.locals });
}
databseBackUpController.prototype.databaseSave = function (req, res) {
  
    if (!fs.existsSync(req.body.storepath)) {
        res.send({ status: false, data:null,message:"Folder dose not exists!" });
    }else{
        httpService.post("/databasebackups", req.body, function (node) {  
           // console.log("=========================")
           // console.log(node)
            node =JSON.parse(node.data);
            var hours=node.scheduletime.split(":")[0];
            var minit=node.scheduletime.split(":")[1];
            var scheduletime="0 "+minit+" "+hours+" ";
            if(node.scheduletype==1){
                console.log("every day");
                scheduletime= scheduletime+"* * *";
            }else if(node.scheduletype==2){
                console.log("every week");
                scheduletime= scheduletime+"* * 7";
            }else if(node.scheduletype==3){
                console.log("every month");
                scheduletime= scheduletime+"1 * *";
            }
           // scheduletime="*/2 * * * * *";
            startSchedule(scheduletime,node.storepath);
            res.send({ status: true, data:node });
        })
    }
    
   
}
databseBackUpController.prototype.editdatabase = (req, res) => {
    httpService.get("/databasebackups/"+req.params.id, req.body, function (node) {
        res.send({ status: true, data: JSON.parse(node) });
    })
   // res.send({ status: true});
}
databseBackUpController.prototype.databaseUpdate = function (req, res) {
    if (!fs.existsSync(req.body.storepath)) {
        res.send({ status: false, data:null,message:"Folder dose not exists!" });
    }else{
        httpService.put("/databasebackups/"+req.params.id, req.body, function (node) {
            //console.log("=========================")
           // console.log(node)
            node =JSON.parse(node);
            var hours=node.scheduletime.split(":")[0];
            var minit=node.scheduletime.split(":")[1];
            var scheduletime="0 "+minit+" "+hours+" ";
            if(node.scheduletype==1){
                console.log("every day");
                scheduletime= scheduletime+"* * *";
            }else if(node.scheduletype==2){
                console.log("every week");
                scheduletime= scheduletime+"* * 7";
            }else if(node.scheduletype==3){
                console.log("every month");
                scheduletime= scheduletime+"1 * *";
            }
           // scheduletime="*/2 * * * * *";
            startSchedule(scheduletime,node.storepath);
            res.send({ status: true, data: node });
        })
    }
 
}

databseBackUpController.prototype.getAllDatabase = function (req, res) {
    httpService.get("/databasebackups", req.body, function (node) {
        res.send({ status: true, data: JSON.parse(node) });
    })
}
databseBackUpController.prototype.getlastbackupFile = function (req, res) {
    httpService.get("/databasebackups", req.body, function (node) {
        var node=JSON.parse(node)
        if(node.length==0){
            res.send({ status: true, data:  undefined });
        }else{
            try {
                var dir=node[0].storepath;
                listfile=fs.readdirSync(dir)
                .filter(file => fs.lstatSync(path.join(dir, file)).isFile())
                .map(file => ({ file, mtime: fs.lstatSync(path.join(dir, file)).mtime }))
                .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
                res.send({ status: true, data: listfile.length ? listfile[0] : undefined });
            } catch (err) {
                res.send({ status: true, data:  undefined });
              }
        }
       
    })
}

module.exports = new databseBackUpController();
