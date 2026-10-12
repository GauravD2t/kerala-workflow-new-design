var httpService = require('../service/httpService.js')
function MenuGroupController() {
}
MenuGroupController.prototype.menugroupPage = function (req, res) {
    res.render('menugroup', { title: 'menugroup' });
}
MenuGroupController.prototype.menugroup = (req, res) => {
    httpService.get("/menugroups", "", function (node) {
        res.send({ status: true, data: JSON.parse(node) });
    })
}
MenuGroupController.prototype.save = (req, res) => {
    console.log(JSON.stringify(req.body))
    httpService.post("/menugroups", JSON.stringify(req.body), function (node) {
        res.send({ status: true, data: JSON.parse(node) });
    })
}
MenuGroupController.prototype.delete = (req, res) => {
    console.log(req.params.id)
    httpService.delete("/menugroups/"+req.params.id, "", function (node) {
        console.log(node)
        res.send({ status: true, data: JSON.parse(node) });
    })
   // res.send({ status: true});
}
MenuGroupController.prototype.edit = (req, res) => {
    console.log(req.params.id)
    httpService.get("/menugroups/"+req.params.id, "", function (node) {
        console.log(node)
        res.send({ status: true, data: JSON.parse(node) });
    })
   // res.send({ status: true});
}
//update
MenuGroupController.prototype.update = (req, res) => {
    console.log(JSON.stringify(req.body))
    httpService.put("/menugroups/"+req.params.id, JSON.stringify(req.body), function (node) {
        res.send({ status: true, data: JSON.parse(node) });
    })
}
module.exports = new MenuGroupController();