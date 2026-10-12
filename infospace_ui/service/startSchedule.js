const { execute } = require('@getvim/execute');
const compress = require('gzipme');
var path = require('path');

const fs = require('fs');
const cron = require('node-cron');

const dotenv = require('dotenv');
dotenv.config();

const username = process.env.DB_USER;
const database = process.env.DB_NAME;
const password= process.env.PGPASS;

function backup(filepath) {
    console.log("schedulate::::::filepath::::"+filepath)
    var date = new Date();
    var currentDate = `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}.${date.getHours()}.${date.getMinutes()}`;
    var fileName = `CCTNS-backup-${currentDate}.backup`;
    var newfile= filepath+"/"+fileName;
    execute(
        `PGPASSWORD=dspace pg_dump -C -h localhost -p 5432 -U dspace -d cctns1 -f ${newfile} -F t `,
    ).then(async ()=> {
        //await compress(newfile);
       // fs.unlinkSync(newfile);
        console.log("Finito");
    }).catch(err=> {
        console.log(err);
    })
}

startSchedule.prototype.restore=function(filepath,callback) {
    execute(`pg_restore -cC -d ${database} ${filepath}`)
        .then(async ()=> {
            callback({status:true});
        }).catch(err=> {
            callback({status:false});
    })
}

startSchedule.prototype.getbackuplist=function(dir,callback){
    callback(fs.readdirSync(dir)
    .filter(file => fs.lstatSync(path.join(dir, file)).isFile())
    .map(file => ({ file, mtime: fs.lstatSync(path.join(dir, file)).mtime }))
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime()));
}

function startSchedule(schedulate,filepath) {
    cron.schedule(schedulate, () => {
        backup(filepath)
    }, {});
}


module.exports = { startSchedule};
