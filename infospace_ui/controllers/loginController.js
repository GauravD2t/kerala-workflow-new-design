/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



var textutil = require('../util/textutil');
var httpService = require('../service/httpService.js')
var path = require('path')
this.db = null

function loginController() {
}
loginController.prototype.home = function (req, res) {
    res.render('login', { title: 'Home' });
}
loginController.prototype.confirmlogin = function (req, res) {
    //httpService.post("/auth/local", req.body, function (user) {
    //if (user.statusCode == 200) {
    // req.session.user = JSON.parse(user.data);
    var userobj = {}//req.session.user.user;
    userobj.jwtkey = req.session.user.jwt
    userobj.sessionid = req.session.id
    userobj.id = req.session.user.user.id
    var menugroup = [];
    httpService.put("/users/" + userobj.id, userobj, function (node) {
        if (node != null) {
            //  console.log(req.session.user.user)
            req.session.user.user.menus.forEach(async (menu) => {
                if (menu.menugroup == null) {
                    menu.menugroup = { menugroupname: "unknown" }
                }
                var picked = menugroup.find(o => o.menugroup === menu.menugroup.menugroupname);
                if (picked == undefined) {
                    var menus = []
                    menus.push(menu);
                    menugroup.push({ menugroup: menu.menugroup.menugroupname, menus: menus, menugroupicon: menu.menugroup.menugroupicon })
                } else {
                    picked.menus.push(menu)
                }
            })
            menugroup = menugroup.sort((a, b) => {
                let fa = a.menugroup;

                if (fa == 'unknown') {
                    return -1;
                } else {
                    return 1;
                }

            });
            req.session.menugroup = menugroup
            console.log("req.session.user.user.role.roleindex......,", req.session.user.user.role.roleindex)
            if (req.session.user.user.role.roleindex == 3) {
                res.redirect("/policestationDashboard.dwf")
            } else if (req.session.user.user.role.roleindex == 4) {
                res.redirect("/inwardDashboard.dwf")
            } else if (req.session.user.user.role.roleindex == 5) {
                res.redirect("/documentverify.dwf")
            } else if (req.session.user.user.role.roleindex == 2) {
                res.redirect("/adminDashboard.dwf")

            } else if (req.session.user.user.role.roleindex == 1) {
                res.redirect("/admin_Dashboard.dwf")

            } else if (req.session.user.user.role.roleindex == 9) {
                res.redirect("/MISProgressOverview.dwf")

            }
            else {
                res.redirect("/black.dwf")
            }

        }
    });
    //} else {
    //  res.render('login', {title: 'Home', message: "* Username or password invalid.", color: "red"});
    //}

    //})
}
loginController.prototype.blackpage = function (req, res) {
    res.render('emptypage', { title: 'Dashboard', locals: res.locals });
}
loginController.prototype.login = function (req, res) {
    req.body.jwtkey = null;
    httpService.post("/auth/local", req.body, function (user) {
        if (user.statusCode == 200) {
            req.session.user = JSON.parse(user.data);
            if (req.session.user.user.sessionid != null) {

                res.render('login', { title: 'Home', issessionexist: true, identifier: req.body.identifier, password: req.body.identifier });
            } else {

                var userobj = {}//req.session.user.user;
                userobj.jwtkey = req.session.user.jwt
                userobj.sessionid = req.session.id
                userobj.id = req.session.user.user.id
                var menugroup = [];
                httpService.put("/users/" + userobj.id, userobj, function (node) {
                    if (node != null) {
                        req.session.user.user.menus.forEach(async (menu) => {
                            // console.log(menu);
                            if (menu.menugroup == null) {
                                menu.menugroup = { menugroupname: "unknown" }
                            }
                            var picked = menugroup.find(o => o.menugroup === menu.menugroup.menugroupname);
                            if (picked == undefined) {
                                var menus = []
                                menus.push(menu);
                                menugroup.push({ menugroup: menu.menugroup.menugroupname, menus: menus, menugroupicon: menu.menugroup.menugroupicon })
                            } else {
                                picked.menus.push(menu)
                            }
                        })
                        menugroup = menugroup.sort((a, b) => {
                            let fa = a.menugroup;

                            if (fa == 'unknown') {
                                return -1;
                            } else {
                                return 1;
                            }

                        });

                        req.session.menugroup = menugroup
                        console.log("req.session.user.user.role.roleindex......,", req.session.user.user.role.roleindex)
                        // req.session.user.user.userrole.roles.forEach(async (menu) => {
                        if (req.session.user.user.role.roleindex == 3) {
                            res.redirect("/policestationDashboard.dwf")
                        } else if (req.session.user.user.role.roleindex == 4) {
                            res.redirect("/inwardDashboard.dwf")
                        } else if (req.session.user.user.role.roleindex == 5) {
                            res.redirect("/documentverify.dwf")
                        } else if (req.session.user.user.role.roleindex == 2) {
                            res.redirect("/adminDashboard.dwf")

                        } else if (req.session.user.user.role.roleindex == 1) {
                            res.redirect("/admin_Dashboard.dwf")

                        } else if (req.session.user.user.role.roleindex == 9) {
                            res.redirect("/suersetdashbord.dwf")

                        } else {
                            res.redirect("/black.dwf")
                        }

                    } else {
                        res.redirect("/")
                    }
                });
            }
        } else {
            res.render('login', { title: 'Home', message: "* Username or password invalid.", color: "red" });
        }
    })
}
loginController.prototype.deleteUser = (req, res) => {
    httpService.delete("/users/" + req.params.id, req.body, function (node) {
        res.send({ status: true, data: JSON.parse(node) });
    })
}
loginController.prototype.updateuser = (req, res) => {
    req.body.id = req.params.id
    delete req.body.password

    httpService.put("/users/" + req.params.id, req.body, function (node) {
        res.send({ status: false, data: [] });
    });
}
loginController.prototype.editUser = (req, res) => {
    httpService.get("/users/" + req.params.id, req.body, function (node) {
        node = JSON.parse(node)
        if (node != null && node != undefined) {
            if (node.usertype == BatchStatusEnum.userType.police) {
                node.usertypename = "Police station"
            } else if (node.usertype == BatchStatusEnum.userType.digitizationcenter) {
                node.usertypename = "Digitization Center Admin"
            }
            var d = {
                id: node.id, username: node.username, email: node.email, name: node.name, contactnumber: node.contactnumber, employeeid: node.employeeid,
                role: node.role, usertype: node.usertype, usertypename: node.usertypename,
                address: node.address, menus: node.menus,
                department:node.department
            }

            if (node.menus.length != 0) {
                d.menus = []
                for (var i = 0; i < node.menus.length; i++) {
                    d.menus.push({ id: node.menus[i].id, menuname: node.menus[i].menuname })
                }
            }

            res.send({ status: true, data: d });
        } else {
            res.send({ status: false, data: null });
        }

    })
}
loginController.prototype.logout = function (req, res) {
    var userobj = {}//null;
    userobj.jwtkey = req.session.user.jwt
    userobj.sessionid = null;
    userobj.id = req.session.user.user.id
    httpService.put("/users/" + userobj.id, userobj, function (node) {
        req.session.destroy();
        res.redirect("/")
    });
}
loginController.prototype.isvaliduser = function (req, res) {
    //console.log("==============")
    // console.log(req.body)
    //console.log("==============")

    var query = ""
    if (req.body.employeeid != undefined) {
        query = "?employeeid=" + req.body.employeeid;
        query = query + "&usertype=" + req.body.userType;
        query = query + "&createdby_d2=" + req.session.user.user.id;
    } else if (req.body.username != undefined) {
        query = "?username=" + req.body.username
    } else if (req.body.email != undefined) {
        query = "?email=" + req.body.email
    }


    console.log(query);
    httpService.get("/users" + query, req.body, function (user) {
        user = JSON.parse(user)
        if (user.length == 0) {
            res.send({ status: true })
        } else {
            res.send({ status: false })
        }
    })
}
loginController.prototype.digitizationuser = function (req, res) {
    if (req.query.type == BatchStatusEnum.userType.digitizationcenteruser) {
        httpService.get("/users-permissions/roles?roletype=" + BatchStatusEnum.userType.digitizationcenteruser, "", function (role) {
            res.locals.type = "Digitization center User"
            httpService.get("/menus", req.body, function (menus) {
                res.render('userdigitization', { title: 'Digitization User', roles: JSON.parse(role).roles, type: BatchStatusEnum.userType.digitizationcenteruser, locals: res.locals, menus: JSON.parse(menus) });
            })

        })
    } else {
        res.render('404', { locals: res.locals })
    }
}
loginController.prototype.user = function (req, res) {
    if (req.query.type == BatchStatusEnum.userType.police) {

        httpService.get("/users-permissions/roles?roletype=" + BatchStatusEnum.userType.police, req.body, function (role) {
            res.locals.type = "Police station"
            httpService.get("/menus", req.body, function (menus) {
                res.render('user', { title: 'User', roles: JSON.parse(role).roles, type: BatchStatusEnum.userType.police, locals: res.locals, menus: JSON.parse(menus) });
            })


        })
    } else if (req.query.type == BatchStatusEnum.userType.digitizationcenter) {
        httpService.get("/users-permissions/roles?roletype=" + BatchStatusEnum.userType.digitizationcenter, req.body, function (role) {
            httpService.get("/menus", req.body, function (menus) {
                res.locals.type = "Digitization Center Admin"
                res.render('user', { title: 'User', roles: JSON.parse(role).roles, type: BatchStatusEnum.userType.digitizationcenter, locals: res.locals, menus: JSON.parse(menus) });
            })
        })

    } else {
        res.render('404', { locals: res.locals })
    }

}
loginController.prototype.Registeruser = function (req, res) {
    req.body.confirmed = true;
    req.body.createdby_d2 = req.session.user.user.id;
    req.body.blocked = false;
    if (req.body.usertype == BatchStatusEnum.userType.digitizationcenteruser || req.body.usertype == BatchStatusEnum.userType.police) {
        req.body.digitizationcenter = req.session.user.user.id;
    }
    httpService.post("/users", req.body, function (user) {
        res.send({ status: true, data: user })
    })
}
loginController.prototype.getAllUser = (req, res) => {
    var user = req.session.user.user;
    httpService.get("/users?createdby_d2=" + user.id + "&usertype=" + req.query.type + "&_limit=-1", req.body, function (node) {
        if (node != null) {
            res.send({ status: true, data: JSON.parse(node) });
        } else {
            res.send({ status: false, data: [] });
        }

    })
}
loginController.prototype.policestationByid = function (req, res) {
    httpService.get("/policestationswithdistrict/" + req.params.id, req.body, function (policestation) {
        res.render('user', { title: 'User', policestation: JSON.parse(policestationByid) });
    })
}
loginController.prototype.roles = function (req, res) {
    httpService.get("/users-permissions/roles/" + req.params.id, req.body, function (role) {
        res.send(JSON.parse(role));
    })
}
loginController.prototype.policestationsbydistrict = function (req, res) {
    var id = req.params.id
    httpService.get("/policestations?district=" + req.params.id + "&isdeleted=false&_limit=-1", req.body, function (role) {
        res.send(JSON.parse(role));
    })
}
module.exports = new loginController();

