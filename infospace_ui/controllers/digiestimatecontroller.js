var httpService = require('../service/httpService.js')
function digiestimatecontroller() {
}
digiestimatecontroller.prototype.digiestimate = function (req, res) {
    res.render('digiestimate', { title: 'Estimated Volume',locals:res.locals });
}
digiestimatecontroller.prototype.getAlldigiestimate = (req, res) => {
    httpService.get("/digiestimates?createdby_d2="+req.session.user.user.id, "", function (node) {
        res.send({ status: true, data: JSON.parse(node) });
    })
}
digiestimatecontroller.prototype.save = (req, res) => {
    let user = req.session.user;  
    req.body.createdby_d2=user.user.id;
    httpService.post("/digiestimates",req.body, function (node) {
        res.send({ status: true, data: JSON.parse(node.data) });
    })
}
digiestimatecontroller.prototype.delete = (req, res) => {
    console.log(req.params.id)
    httpService.delete("/digiestimates/"+req.params.id, "", function (node) {
      
        res.send({ status: true, data: JSON.parse(node) });
    })
   // res.send({ status: true});
}
digiestimatecontroller.prototype.edit = (req, res) => {
    console.log(req.params.id)
    httpService.get("/digiestimates/"+req.params.id, "", function (node) {
       
        res.send({ status: true, data: JSON.parse(node) });
    })
   // res.send({ status: true});
}
//update
digiestimatecontroller.prototype.update = (req, res) => {
    let user = req.session.user;  
    req.body.createdby_d2=user.user.id;
    httpService.put("/digiestimates/"+req.params.id,req.body, function (node) {
        res.send({ status: true, data: JSON.parse(node) });
    })
}
module.exports = new digiestimatecontroller();