var httpService = require('../service/httpService.js')
function authfilter() {

}
// authfilter.prototype.filteronDevice=function(req, res,next){

//   if (req.session.user != undefined && req.body.plcid != undefined){
//     var plcid=req.body.plcid;
//     DeviceService.checkdevicehasvalidplan({plcid:plcid,userid:req.session.user.id,isactive:true},function(returnnode){
//       console.log(returnnode.id)
//       if(returnnode ==  null){
//         res.status(500).send({status:false,message:"please provide register device ID"})
//       }else{
//         req.session.device=returnnode;
//         next();
//       }
//     });
//   }else{
//     res.status(500).send({status:false,message:"you are not authorized to access this API"})
//   } 

// }
authfilter.prototype.isvaildUrl = function (req, res, next) {
  var status = false;
  //console.log("=============================")
  //console.log(req.url)
  //console.log(req.url.split("/")[1])
  //console.log("=============================")
  if (req.session.user != undefined && req.session.user != null) {
    var userobj = {}//req.session.user.user;

    req.session.user.user.menus.forEach(async (menu) => {
      if (menu.menuurl === req.url.split("/")[1]) {
        status = true;
      }
    })
    if (status) {
      next();
    } else {
      res.status(500).send({ status: false, message: "you are not authorized to access this Page" })
    }
  } else {
    res.status(500).send({ status: false, message: "you are not authorized to access this Page" })
  }
}

module.exports = new authfilter();