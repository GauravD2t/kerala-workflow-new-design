/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



var textutil = require('../util/textutil');
var httpService = require('../service/httpService.js')
const AsiosUtil = require("../service/AxiosUtil")
var LocalStorage = require('node-localstorage').LocalStorage;
var path = require('path')
this.db = null
const AxiosUtil = new AsiosUtil();
var dspacepassword = "Dspace@2014";
const localStorage = new LocalStorage('./scratch');
function RoleController() {
}
RoleController.prototype.home = function (req, res) {
    httpService.get("/users-permissions/roles", "", function (role) {
        httpService.get("/menus", "", function (menus) {
            res.render('role', { title: 'Role', roles: JSON.parse(role).roles, menus: JSON.parse(menus),locals:res.locals });
        })
    })

}
RoleController.prototype.barcodegenrate = function (req, res) {
    res.render('barcodegenrate', { title: 'Document Barcode Generator', locals: res.locals });
    
}
RoleController.prototype.getdocumenttypebarcode = function (req, res) {
    AxiosUtil.postxForm("/api/authn/login", {
        password: dspacepassword,
        user: 'support@d2t.co'
    })
        .then(loginResponse => {
            console.log(loginResponse);
            localStorage.setItem("authorization", loginResponse.headers['authorization']);

            return AxiosUtil.get(
                "api/documenttypetree/documenttypetrees/search/getAllnodehierarchyforScanning?",
                { page: 0, size: 4999 }
            );
        })
        .then(loginResponse1 => {
            res.send({ status: true, data: loginResponse1.data });
        })
        .catch(err => {
            console.error("err", err);
            res.send({ status: false, error: err.message || err });
        });
   
   

     

}
RoleController.prototype.saveRole = function (req, res) {
    console.log(req.body)    
    httpService.get("/users-permissions/roles/" + parseInt(req.body.role),"",function(role){
        var roleobj=JSON.parse(role)      
        console.log(roleobj)  
        roleobj.menus= req.body.menus;    
        httpService.put("/users-permissions/roles/" + parseInt(req.body.role), roleobj, function (menus) {
            console.log(menus)
            if (menus != null) {
                res.send({ status: true })
            } else {
                res.send({ status: false })
            }
    
        })
    })
    
}
RoleController.prototype.getallRole = function (req, res) {
        httpService.get("/users-permissions/roles/", "", function (role) {
            var roles=JSON.parse(role)  
            if (roles != null) {
                console.log(roles)
                res.send({ status: true,data:roles })
            } else {
                res.send({ status: false })
            }
    
        })
        
}
module.exports = new RoleController();

