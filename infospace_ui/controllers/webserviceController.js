/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var BatchNoGenrate = require('../util/batchNumberGenrate.js')
var db = require('../models');
var textutil = require('../util/textutil');
var httpService = require('../service/httpService.js')
var path = require('path')

const AsiosUtil = require("../service/AxiosUtil")
var LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');
var CIPAService = require("../service/CIPAService");
var dspacepassword = "dspace";
var moment = require('moment');
function webserviceController() {
}
webserviceController.prototype.home = function (req, res) {
    res.render('login', { title: 'Home' });
}
webserviceController.prototype.loginservice = function (req, res) {
    
    req.body.jwtkey = null;
    
    httpService.post("/auth/local", req.body, function (user) {
        if (user.statusCode == 200) {
            req.session.user = JSON.parse(user.data);
            // const AxiosUtil = new AsiosUtil();
            // AxiosUtil.postxForm("/api/authn/login", { "password": dspacepassword, "user": 'support@d2t.co' }).then(function (loginResponce) {
            //     localStorage.setItem("authorization", loginResponce.headers['authorization'])
            // });



            if (req.session.user.user.sessionid != null) {

                var userobj = { jwtkey: "Bearer " + req.session.user.jwt, name: req.session.user.user.username, email: req.session.user.user.email, session: req.session.id, role: req.session.user.user.role.roleindex }
                res.send({ status: true, data: userobj, menu: req.session.user.user.role.menus })
            } else {

                var userobj = req.session.user.user;
                userobj.jwtkey = req.session.user.jwt
                userobj.sessionid = req.session.id
                httpService.put("/users/" + userobj.id, userobj, function (node) {
                    if (node != null) {
                        var loginuserobj = { jwtkey: "Bearer " + req.session.user.jwt, name: req.session.user.user.username, email: req.session.user.user.email, session: userobj.sessionid, role: req.session.user.user.role.roleindex }
                        res.send({ status: true, data: loginuserobj, menumodel: { menu: req.session.user.user.role.menus } })
                    } else {
                        res.send({ status: false })
                    }
                })
            }

        } else {
            res.send({ status: false, data: null })
        }

    })
}
webserviceController.prototype.getAllbatch = function (req, res) {
    let user = req.session.user;

    //need to add in enm  
    httpService.get(encodeURI("/findfirbyQuery?batch.created_by_d2.digitizationcenter=" + req.session.user.user.digitizationcenter.id + "&inwardstatus=1&imagestatus=0&qcreject=false&_sort=id:asc&_limit=-1"), req.body, function (allbatch) {
        allbatch = JSON.parse(allbatch)
        //console.log(allbatch.statusCode)
        if (allbatch.statusCode != 403) {
            getbatchByFire(allbatch).then(function (retuennode) {

                retuennode = retuennode.sort((a, b) => {
                    if (a.bundlenumber < b.bundlenumber) {
                        return -1;
                    }
                });
                res.send({ status: true, data: retuennode });
            })
        } else {
            res.send({ status: false, message: allbatch.message });
        }


    })
}
webserviceController.prototype.getAllScanbatchRejectByverify = function (req, res) {
    httpService.get(encodeURI("/findfirbyQuery?batch.created_by_d2.digitizationcenter=" + req.session.user.user.digitizationcenter.id + "&inwardstatus=1&imagestatus=0&qcreject=false&_sort=id:asc&_limit=-1"), req.body, function (allbatch) {
        allbatch = JSON.parse(allbatch)
        //console.log(allbatch.statusCode)
        if (allbatch.statusCode != 403) {
            getbatchByFire(allbatch).then(function (retuennode) {

                retuennode = retuennode.sort((a, b) => {
                    if (a.bundlenumber < b.bundlenumber) {
                        return -1;
                    }
                });
                res.send({ status: true, data: retuennode });
            })
        } else {
            res.send({ status: false, message: allbatch.message });
        }


    })
}
webserviceController.prototype.getAllClassficationbatchRejectbyVerify = function (req, res) {
    httpService.get(encodeURI("/findfirbyQuery?verify_by_null=false&batch.created_by_d2.digitizationcenter=" + req.session.user.user.digitizationcenter.id + "&inwardstatus=1&imagestatus=2&qcreject=false&_sort=id:asc&_limit=-1"), req.body, function (allbatch) {
        allbatch = JSON.parse(allbatch)
        //console.log(allbatch.statusCode)
        if (allbatch.statusCode != 403) {
            getbatchByFire(allbatch).then(function (retuennode) {

                retuennode = retuennode.sort((a, b) => {
                    if (a.bundlenumber < b.bundlenumber) {
                        return -1;
                    }
                });
                res.send({ status: true, data: retuennode });
            })
        } else {
            res.send({ status: false, message: allbatch.message });
        }


    })
}
webserviceController.prototype.getAllbatchCaseNoCaseYear = function (req, res) {
    /*
    type enum
    1.scaning
    2.qcscan
    3.classfication
    */
    let user = req.session.user;
    let type = req.body.type;
    if (req.body.query != undefined && req.body.query != '') {
        let data = req.body.query.split("/");
        if (data.length == 2) {
            if (type == 1) {
                httpService.get(encodeURI("/findfirbyQuery?year=" + data[1] + "&caseno=" + data[0] + "&verify_by_null=true&batch.created_by_d2.digitizationcenter=" + req.session.user.user.digitizationcenter.id + "&inwardstatus=1&imagestatus=0&qcreject=false&_sort=id:asc&_limit=-1"), req.body, function (allbatch) {
                    allbatch = JSON.parse(allbatch)
                    //console.log(allbatch.statusCode)
                    if (allbatch.statusCode != 403) {
                        getbatchByFire(allbatch).then(function (retuennode) {

                            retuennode = retuennode.sort((a, b) => {
                                if (a.bundlenumber < b.bundlenumber) {
                                    return -1;
                                }
                            });
                            res.send({ status: true, data: retuennode });
                        })
                    } else {
                        res.send({ status: false, message: allbatch.message });
                    }


                })
            } else if (type == 2) {
                httpService.get(encodeURI("/findfirbyQuery?year=" + data[1] + "&caseno=" + data[0] + "&verify_by_null=true&batch.created_by_d2.digitizationcenter=" + req.session.user.user.digitizationcenter.id + "&inwardstatus=1&imagestatus=1&qcreject=false&_sort=id:asc&_limit=-1"), req.body, function (allbatch) {
                    allbatch = JSON.parse(allbatch)
                    //console.log(allbatch)
                    if (allbatch.statusCode == undefined) {
                        getbatchByFire(allbatch).then(function (retuennode) {
                            retuennode = retuennode.sort((a, b) => {
                                if (a.bundlenumber < b.bundlenumber) {
                                    return -1;
                                }
                            });
                            res.send({ status: true, data: retuennode });
                        })
                    } else {
                        res.send({ status: false, message: "" });
                    }
                })
            } else if (type == 3) {
                httpService.get(encodeURI("/findfirbyQuery?year=" + data[1] + "&caseno=" + data[0] + "&verify_by_null=true&batch.created_by_d2.digitizationcenter=" + req.session.user.user.digitizationcenter.id + "&inwardstatus=1&imagestatus=2&qcreject=false&_sort=id:asc&_limit=-1"), req.body, function (allbatch) {
                    allbatch = JSON.parse(allbatch)
                    console.log("=======getAllClassficationbatch===")
                    // console.log(allbatch)
                    if (allbatch.statusCode == undefined) {
                        getbatchByFire(allbatch).then(function (retuennode) {
                            retuennode = retuennode.sort((a, b) => {
                                if (a.bundlenumber < b.bundlenumber) {
                                    return -1;
                                }
                            });
                            res.send({ status: true, data: retuennode });
                        })
                    } else {
                        res.send({ status: false, message: "" });
                    }
                })
            }
        } else {
            res.send({ status: true, data: [] });
        }
    } else {
        res.send({ status: true, data: [] });
    }

}
webserviceController.prototype.getAllQCrejectedBatch = function (req, res) {
    let user = req.session.user;
    //need to add in enm  
    httpService.get(encodeURI("/findfirbyQuery?batch.created_by_d2.digitizationcenter=" + req.session.user.user.digitizationcenter.id + "&inwardstatus=1&imagestatus=1&qcreject=true&_sort=id:asc&_limit=-1"), req.body, function (allbatch) {
        allbatch = JSON.parse(allbatch)
        //console.log(allbatch.statusCode)
        if (allbatch.statusCode != 403) {
            getbatchByFire(allbatch).then(function (retuennode) {
                retuennode = retuennode.sort((a, b) => {
                    if (a.bundlenumber < b.bundlenumber) {
                        return -1;
                    }
                });
                res.send({ status: true, data: retuennode });
            })
        } else {
            res.send({ status: false, message: allbatch.message });
        }


    })
}

webserviceController.prototype.setFIRQCrejected = function (req, res) {
    let user = req.session.user;
    //need to add in enm  
    //paramerter pass
    //qcreject_reason
    //qcreject_by
    //firregisternumber
    httpService.get(encodeURI("/firs?crn=" + req.body.firregisternumber), req.body, function (node) {
        var data = JSON.parse(node);
        req.body.imagestatus = 0;
        // req.body.firvalidate=true;
        req.body.qcreject = true;
        //req.body.qcreject_reason=req.body.rejection_reason;
        httpService.put("/firs/" + data[0].id, req.body, function (node1) {
            res.send({ status: true, data: JSON.parse(node1) });
        })

    })

}

webserviceController.prototype.setFIRQCApproval = function (req, res) {
    let user = req.session.user;
    httpService.get(encodeURI("/firs?crn=" + req.body.firregisternumber), req.body, function (node) {
        var data = JSON.parse(node);
        // req.body.imagestatus=0;
        req.body.firvalidate = true;
        // req.body.qcreject=true;
        // req.body.qcreject_reason=req.body.rejection_reason;
        httpService.put("/firs/" + data[0].id, req.body, function (node1) {
            res.send({ status: true, data: JSON.parse(node1) });
        })

    })
}

webserviceController.prototype.getDocumenttype = function (req, res) {
    let user = req.session.user;
    try {
        const AxiosUtil = new AsiosUtil();
        AxiosUtil.get("/api/documenttypetree/documenttypetrees/search/searchDocumentTreeByDocumentTypeName?", { page: 0, size: 4999, query: req.body.query }).then(function (loginResponce) {
            res.send({ status: true, data: loginResponce.data });
        });
    } catch (err) {
        if (err.statuscode == 401) {
            AxiosUtil.postxForm("/api/authn/login", { "password": dspacepassword, "user": 'support@d2t.co' }).then(function (loginResponce) {

                localStorage.setItem("authorization", loginResponce.headers['authorization'])

                AxiosUtil.get("/api/documenttypetree/documenttypetrees/search/searchDocumentTreeByDocumentTypeName?", { page: 0, size: 4999, query: req.body.query }).then(function (loginResponce1) {
                    res.send({ status: true, data: loginResponce1.data });
                });
            });

        }
        res.send({ status: false, data: [] });
    }

}
webserviceController.prototype.getAllnodehierarchyforScanning = async function (req, res) {
    try {
        var cached = await db.MasterCache.findOne({ where: { master_name: 'docutype' } });
        var data = (cached && Array.isArray(cached.data)) ? cached.data : [];
        res.send({ status: true, data: data });
    } catch (err) {
        console.error('getAllnodehierarchyforScanning error:', err);
        res.send({ status: false, data: [] });
    }
}

webserviceController.prototype.getIssubchildNodeByparentID = function (req, res) {
    let user = req.session.user;
    try {
        const AxiosUtil = new AsiosUtil();
        AxiosUtil.get("/api/documenttypetree/documenttypetrees/search/getChildNodeByparentIDForScanning?", { page: 0, size: 4999, query: req.body.query, parentID: req.body.parentID, isTemplet: true }).then(function (loginResponce) {
            res.send({ status: true, data: loginResponce.data });
        });
    } catch (err) {
        if (err.statuscode == 401) {
            AxiosUtil.postxForm("/api/authn/login", { "password": dspacepassword, "user": 'support@d2t.co' }).then(function (loginResponce) {

                localStorage.setItem("authorization", loginResponce.headers['authorization'])

                AxiosUtil.get("/api/documenttypetree/documenttypetrees/search/getChildNodeByparentIDForScanning?", { page: 0, size: 4999, query: req.body.query, parentID: req.body.parentID, isTemplet: true }).then(function (loginResponce1) {
                    res.send({ status: true, data: loginResponce1.data });
                });
            });

        }
        res.send({ status: false, data: [] });
    }

}

webserviceController.prototype.updatepagecount = function (req, res) {
    var body = { jwtkey: req.body.jwtkey, scanpagecount: req.body.scanpagecount }
    httpService.put("/firs/" + req.body.id, body, function (node) {
        node = JSON.parse(node)
        if (node.statusCode == undefined) {
            var fir = { id: node.id, scanpagecount: node.scanpagecount, firserialnumber: node.crn, pagecount: node.pagecount, year: node.year };
            res.send({ status: true, data: fir });
        } else {
            res.send({ status: false, message: "fir not Found" });
        }

    })
}
webserviceController.prototype.savefirfromscan = function (req, res) {
    var body = { scan_by: req.session.user.user.id, jwtkey: req.body.jwtkey, imagestatus: 1, islock: false, scancommited_at: new Date(), scanpagecount: req.body.scanpagecount }  //need to add in enm  
    httpService.put("/firs/" + req.body.id, body, function (node) {
        node = JSON.parse(node)
        if (node.statusCode == undefined) {
            var fir = { id: node.id, scanpagecount: node.scanpagecount, firserialnumber: node.crn, pagecount: node.pagecount, year: node.year };
            res.send({ status: true, data: fir });
        } else {
            res.send({ status: false, message: "fir not Found" });
        }

    })
}
webserviceController.prototype.receivefirfromscan = function (req, res) {
    //console.log(req.body);
    httpService.get("/firs/" + req.body.id, req.body, function (node1) {
        node1 = JSON.parse(node1)
        if (node1.islock) {
            var fir = { id: node1.id, scanpagecount: node1.scanpagecount, firserialnumber: node1.crn, pagecount: node1.pagecount, year: node1.year };
            res.send({ status: true, data: fir });
        } else {
            var body = { jwtkey: req.body.jwtkey, islock: true, scanreceive_at: new Date() }  //need to add in enm  
            httpService.put("/firs/" + req.body.id, body, function (node) {
                node = JSON.parse(node)
                if (node.statusCode == undefined) {
                    var fir = { id: node.id, scanpagecount: node.scanpagecount, firserialnumber: node.crn, pagecount: node.pagecount, year: node.year };
                    res.send({ status: true, data: fir });
                } else {
                    res.send({ status: false, message: "fir not Found" });
                }

            })
        }
    })

}
webserviceController.prototype.receivefirfromscanQC = function (req, res) {
    httpService.get("/firs/" + req.body.id, req.body, function (node1) {
        node1 = JSON.parse(node1)
        if (node1.statusCode == undefined) {
            if (node1.islock) {
                var fir = { id: node1.id, scanpagecount: node1.scanpagecount, firserialnumber: node1.crn, pagecount: node1.pagecount, year: node1.year };
                res.send({ status: true, data: fir });
            } else {
                var body = { jwtkey: req.body.jwtkey, islock: true, qcreceive_at: new Date() }  //need to add in enm  
                httpService.put("/firs/" + req.body.id, body, function (node) {
                    node = JSON.parse(node)
                    if (node.statusCode == undefined) {
                        var fir = { id: node.id, scanpagecount: node.scanpagecount, firserialnumber: node.crn, pagecount: node.pagecount, year: node.year };
                        res.send({ status: true, data: fir });
                    } else {
                        res.send({ status: false, message: "fir not Found" });
                    }

                })
            }

        } else {
            res.send({ status: false, message: "fir not Found" });
        }

    })

}
webserviceController.prototype.getAllscanQCbatch = function (req, res) {
    let user = req.session.user;
    //need to add in enm  
    httpService.get(encodeURI("/findfirbyQuery?batch.created_by_d2.digitizationcenter=" + req.session.user.user.digitizationcenter.id + "&inwardstatus=1&imagestatus=1&qcreject=false&_sort=id:asc&_limit=-1"), req.body, function (allbatch) {
        allbatch = JSON.parse(allbatch)
        //console.log(allbatch)
        if (allbatch.statusCode == undefined) {
            getbatchByFire(allbatch).then(function (retuennode) {
                retuennode = retuennode.sort((a, b) => {
                    if (a.bundlenumber < b.bundlenumber) {
                        return -1;
                    }
                });
                res.send({ status: true, data: retuennode });
            })
        } else {
            res.send({ status: false, message: "" });
        }
    })
}

webserviceController.prototype.getAllBatchPDFGenerate = function (req, res) {
    let user = req.session.user;
    //need to add in enm  
    httpService.get(encodeURI("/findfirbyQuery?batch.created_by_d2.digitizationcenter=" + req.session.user.user.digitizationcenter.id + "&inwardstatus=1&imagestatus=4&_sort=id:asc&_limit=-1"), req.body, function (allbatch) {
        allbatch = JSON.parse(allbatch)
        // //console.log("==========allbatch=============")
        // //console.log(allbatch)
        if (allbatch.statusCode == undefined) {
            getbatchByFire(allbatch).then(function (retuennode) {
                retuennode = retuennode.sort((a, b) => {
                    if (a.bundlenumber < b.bundlenumber) {
                        return -1;
                    }
                });
                res.send({ status: true, data: retuennode });
            })
        } else {
            res.send({ status: false, message: "" });
        }
    })
}
webserviceController.prototype.savefirfromscanQC = function (req, res) {
    let user = req.session.user;
    var body = { qc_by: req.session.user.user.id, jwtkey: req.body.jwtkey, imagestatus: 2, islock: false, qccommited_at: new Date(), qcpagecount: req.body.qcpagecount }  //need to add in enm      
    httpService.put("/firs/" + req.body.id, body, function (node) {
        node = JSON.parse(node)
        if (node.statusCode == undefined && node.batch.id != undefined) {
            var fir = { id: node.id, qcpagecount: node.qcpagecount, firserialnumber: node.crn, pagecount: node.pagecount, year: node.year };
            httpService.get(encodeURI("/firs/count?batch=" + node.batch.id + "&imagestatus_ne=2&inwardstatus_ne=2"), req.body, function (count) {
                if (count == 0) {
                    var batchbody = { jwtkey: req.body.jwtkey, qcreceive_at: new Date(), qccommited_at: new Date(), qccommited_by: user.id }
                    httpService.put("/batches/" + node.batch.id, batchbody, function (batch) {
                        if (batch.statusCode == undefined) {
                            res.send({ status: true, islast: true });
                        } else {
                            res.send({ false: false, message: "" });
                        }
                    })

                } else {
                    res.send({ status: true, data: fir, islast: false });
                }
            })
        } else {
            res.send({ status: false, message: "fir not Found" });
        }

    })
}
webserviceController.prototype.saveClassficationFile = function (req, res) {
    let user = req.session.user;
    console.log("req.body.crnid::" + req.body.crnid)
    console.log(" req.body.parent::" + req.body.parent)
    console.log("req.body.issubchild::" + req.body.issubchild)
    var parent = 0;
    var crnid = (req.body.crnid == null || req.body.crnid == undefined || req.body.crnid == "") ? null : req.body.crnid;
    // if (req.body.documentdesc=="" || req.body.documentdesc==null || req.body.documentdesc==undefined) {
    //     req.body.documentdesc = req.body.documenttypename.split(">>")[req.body.documenttypename.split(">>").length - 1].trim();
    // }
    var body = "";
    if (parent == 0) {
        var body = { jwtkey: req.body.jwtkey, documenttype: req.body.documenttype, documentdate: req.body.documentdate, documentdesc: req.body.documentdesc, documentremark: req.body.documentremark, fir: crnid, imagename: req.body.imagename, issubchild: req.body.issubchild, documenttypename: req.body.documenttypename, firstsign: false, secondsign: false }
    } else {
        var body = { jwtkey: req.body.jwtkey, documenttype: req.body.documenttype, documentdate: req.body.documentdate, documentdesc: req.body.documentdesc, documentremark: req.body.documentremark, fir: crnid, imagename: req.body.imagename, issubchild: req.body.issubchild, parent: req.body.parent, documenttypename: req.body.documenttypename, firstsign: false, secondsign: false }
    }

    httpService.post("/classficationfiles", body, function (node1) {
        files = JSON.parse(node1.data);

        res.send({ status: true, data: files });
    })
}
webserviceController.prototype.getClassficationByFile = function (req, res) {
    let user = req.session.user;
    console.log("save classfication::" + req.body.crnid)
    //var body = { jwtkey: req.body.jwtkey,documenttype:req.body.documenttype,documentdate:req.body.documentdate,documentdesc:req.body.documentdesc,documentremark:req.body.documentremark,fir:req.body.crnid, imagename: req.body.imagename} 
    httpService.get(encodeURI("/classficationfiles?fir=" + req.body.crnid + "&_sort=id:asc&_limit=-1"), req.body, function (node1) {
        files = JSON.parse(node1);
        classficationDTOP(files)
        res.send({ status: true, data: files });
    })
}
webserviceController.prototype.DeleteClassficationByFile = function (req, res) {
    let user = req.session.user;
    console.log("class file wise delete ", req.body)
    var deletequery = "delete from classficationfiles where fir=" + req.body.id;
    var updatequery ="update firs set formab=false where id="+req.body.id;
    CIPAService.DeleteeexecuteSQL(deletequery, function (data) {
        CIPAService.UpdateexecuteSQL(updatequery, function (data1) {
            if (data != null) {
                res.send({ status: true });
            } else {
                res.send({ status: false });
            }
        })
    })

}
webserviceController.prototype.createBatch = function (req, res) {
    let user = req.session.user;

    var bundlenumber = "";
    try {
        httpService.get("/batchesfindOnebycreatedby?created_by_d2.id=" + parseInt(user.user.id) + "&batchstatus_ne=" + BatchStatusEnum.batchstatus.createbatch + "&_sort=id:desc", req.body, function (node2) {
            node2 = JSON.parse(node2)
            if (node2.status != false) {
                BatchNoGenrate.getbatchno(node2.bundlenumber.split("-")[2], function (batchno) {
                    var ps = user.user.username.replace(/\s+/g, '').toUpperCase();
                    bundlenumber = ps.slice(0, 4) + "-" + new Date().toISOString().slice(0, 10).replace(/[^0-9]/g, '') + "-" + batchno;
                })
            } else {
                //first time create batch
                BatchNoGenrate.getbatchno("0", function (batchno) {
                    var ps = user.user.username.replace(/\s+/g, '').toUpperCase();
                    bundlenumber = ps.slice(0, 4) + "-" + new Date().toISOString().slice(0, 10).replace(/[^0-9]/g, '') + "-" + batchno;
                })
            }
            req.body.deliveryschedule = new Date();

            req.body.created_by_d2 = user.user.id;
            req.body.inwardcommited_by = user.user.id;
            req.body.scanningcommited_by = user.user.id;
            req.body.qccommited_by = user.user.id;
            req.body.qccommited_at = new Date();
            req.body.scanningcommited_at = new Date();
            req.body.inwardcommited_at = new Date();
            req.body.islock = false;
            req.body.batchstatus = BatchStatusEnum.batchstatus.Qccommited;
            req.body.bundlenumber = bundlenumber;
            req.body.created_at_d2 = new Date();
            req.body.islock = false;
            httpService.post("/batches", req.body, function (returnnode) {
                res.send({ status: true, data: JSON.parse(returnnode.data) });

            })

        })
    } catch (err) {
        res.send({ status: false, data: null });
    }


}
webserviceController.prototype.createfile = function (req, res) {
    let user = req.session.user;
    try {
        if (req.body.batch != null) {
            req.body.inwardstatus = 1;
            req.body.tagstatus = 1;
            req.body.imagestatus = 5;
            req.body.returnstatus = 0;
            req.body.firvalidate = false;
            req.body.qcreject = false;
            req.body.isupload = false;
            httpService.post("/firs", req.body, function (node1) {
                res.send({ status: true, data: JSON.parse(node1.data) });
            })
        } else {
            res.send({ status: false, data: null });
        }
    } catch (err) {
        res.send({ status: false, data: null });
    }

}


webserviceController.prototype.updateClassficationByID = function (req, res) {
    let user = req.session.user;
    var parent = (req.body.parent == null || req.body.parent == undefined) ? 0 : req.body.parent;
    var crnid = (req.body.crnid == null || req.body.crnid == undefined || req.body.crnid == "") ? null : req.body.crnid;
    var body = "";
    if (req.body.documentdesc == "" || req.body.documentdesc == null || req.body.documentdesc == undefined) {
        req.body.documentdesc = req.body.documentdesc = req.body.documenttypename.split(">>")[req.body.documenttypename.split(">>").length - 1].trim();
    }
    if (parent == 0) {
        body = { jwtkey: req.body.jwtkey, documenttype: req.body.documenttype, documentdate: req.body.documentdate, documentdesc: req.body.documentdesc, documentremark: req.body.documentremark, fir: crnid, imagename: req.body.imagename, issubchild: req.body.issubchild, documenttypename: req.body.documenttypename }
    } else {
        body = { jwtkey: req.body.jwtkey, documenttype: req.body.documenttype, documentdate: req.body.documentdate, documentdesc: req.body.documentdesc, documentremark: req.body.documentremark, fir: crnid, imagename: req.body.imagename, issubchild: req.body.issubchild, parent: req.body.parent, documenttypename: req.body.documenttypename }
    }

    httpService.put("/classficationfiles/" + req.body.id, body, function (node) {
        node = JSON.parse(node)
        res.send({ status: true, data: node });

    })
}

webserviceController.prototype.updateImageClassficationByID = function (req, res) {
    httpService.put("/classficationfiles/" + req.body.id, req.body, function (node) {
        node = JSON.parse(node)
        res.send({ status: true, data: node });

    })
}


webserviceController.prototype.updatePDFPathClassficationByID = function (req, res) {
  try {
        if( req.body.id=='' ||  req.body.id == undefined || req.body.id == null){
            res.send({ status: false, message: "File ID is required" });
            return;
        }
  
    if (req.body.pagecount == undefined || req.body.pagecount == null) {
        console.log("pagecount::" + req.body.pagecount)

        var body = { jwtkey: req.body.jwtkey, ocrpdfpath: req.body.ocrpdfpath, isupload: false }
        httpService.put("/classficationfiles/" + req.body.id, body, function (node) {
            node = JSON.parse(node)
            res.send({ status: true, data: node });

        })
    }
    else {
        // console.log("pagecount is null or undefined::" + req.body.pagecount)
        if (req.body.pagecount != null && req.body.pagecount != undefined) {
            req.body.pagecount = parseInt(req.body.pagecount);
        } else {
            req.body.pagecount = 0;
        }
        var body = {
                jwtkey: req.body.jwtkey,
                ocrpdfpath: req.body.ocrpdfpath,
                isupload: false,
                pagecount: req.body.pagecount,
                filesize: req.body.filesize
            }
        httpService.put("/classficationfiles/" + req.body.id, body, function (node) {
            node = JSON.parse(node)
            //quesry = "select count(*) from classficationfiles where fir in (select fir from classficationfiles where id=" + req.body.id + ") and  (ocrpdfpath is null or ocrpdfpath='') ";
        const quesry = `
SELECT COUNT(*)
FROM classficationfiles c
WHERE (c.ocrpdfpath IS NULL OR c.ocrpdfpath = '')
AND c.fir = (
    SELECT fir 
    FROM classficationfiles 
    WHERE id = ${req.body.id}
);
`;

            // console.log("check ocrpdfpath update query::" + quesry);
            CIPAService.executeSQL(quesry, function (data) {
                var resultbat = data[0];
                if (resultbat[0].count == 0) {
                    //  let firupdate = "update firs set pdf_by=" + req.session.user.user.id + ",imagestatus=5,islock=false,pdf_at='" + moment().format() + "',pdfpagecount=(SELECT SUM(pagecount) AS total_pagecount FROM (SELECT ocrpdfpath, MAX(pagecount) AS pagecount FROM classficationfiles WHERE fir in ( SELECT fir  FROM classficationfiles  WHERE id = " + req.body.id + ") AND ocrpdfpath IS NOT NULL  GROUP BY ocrpdfpath) t)  where id in (select fir from classficationfiles where id=" + req.body.id + ")";
                  const firupdate = `
UPDATE firs f 
SET 
    pdf_by = ${req.session.user.user.id},
    imagestatus = 5,
    islock = false,
    pdf_at = NOW(),
    pdfpagecount = (
        SELECT SUM(pagecount)
        FROM (
            SELECT ocrpdfpath, MAX(pagecount) AS pagecount
            FROM classficationfiles
            WHERE fir = f.id
              AND ocrpdfpath IS NOT NULL
            GROUP BY ocrpdfpath
        ) t
    )
WHERE f.id = (
    SELECT fir 
    FROM classficationfiles 
    WHERE id = ${req.body.id}
);
`;
                    //console.log("firupdate pdf page conut update query::" + firupdate)
                    CIPAService.UpdateexecuteSQL(firupdate, function (data22) {
                        res.send({ status: true, data: node });
                    })
                } else {
                    res.send({ status: true, data: node });
                }
            })
        })
    }
 } catch (e) {
        res.send({ status: false, message: "Error occurred while updating PDF path classification by ID" });
    }




}

// webserviceController.prototype.updatePDFPathClassficationByID = function (req, res) {

//     var body = { jwtkey: req.body.jwtkey, ocrpdfpath: req.body.ocrpdfpath, isupload: false }
//     httpService.put("/classficationfiles/" + req.body.id, body, function (node) {
//         node = JSON.parse(node)
//         res.send({ status: true, data: node });

//     })
// }
webserviceController.prototype.updateitemIdofFile = function (req, res) { 
    if (req.body.itemid == null || req.body.itemid == undefined || req.body.itemid == "null") {
        req.body.itemid = "";
    }
    query="update firs set itemid='"+req.body.itemid+"' where id="+req.body.id;
    CIPAService.UpdateexecuteSQL(query, function (data22) {
        res.send({ status: true });
    })
}
webserviceController.prototype.updateStatusUploadFileSetFalse = function (req, res) {
    try {
        httpService.get("/classficationfiles/" + req.body.id, req.body, function (node) {
            node = JSON.parse(node);
            if (node.issubchild == null || !node.issubchild) {

                var updatechild = "update  classficationfiles set isupload=false where id=" + node.id;
                let firupdate = "update firs set isupload=false,setuploadfile=false where id =" + node.fir.id;
                CIPAService.UpdateexecuteSQL(firupdate, function (data22) {
                    CIPAService.UpdateexecuteSQL(updatechild, function (data22) {
                        res.send({ status: true });
                    })
                })
            } else {

                var updatechild = "update  classficationfiles set isupload=false where id=" + node.id;
                var updateparent = "update  classficationfiles set isupload=false where id=" + node.parent.id;
                let firupdate = "update firs set isupload=false,setuploadfile=false where id =" + node.parent.fir;
                CIPAService.UpdateexecuteSQL(firupdate, function (data22) {
                    CIPAService.UpdateexecuteSQL(updatechild, function (data22) {
                        CIPAService.UpdateexecuteSQL(updateparent, function (data22) {
                            res.send({ status: true });
                        })
                    })

                })
            }
        })
    } catch (err) {
        res.send({ status: false, data: err });
    }
}

webserviceController.prototype.updateStatusUploadFile = function (req, res) {
    try {
        var deletequery = "update  classficationfiles set isupload=true where id=" + req.body.id;
        var updatefir = "select count(*) from classficationfiles  where fir in (select fir from classficationfiles where id=" + req.body.id + ") and isupload=false and ocrpdfpath is not  null";
        var childclass = "select count(*) from classficationfiles where isupload = false and ocrpdfpath is not  null and parent in (select parent from classficationfiles where id = " + req.body.id + " and fir is null)";
        var selected = "select * from classficationfiles where id=" + req.body.id;
        CIPAService.UpdateexecuteSQL(deletequery, function (data) {
            if (data != null) {
                CIPAService.executeSQL(selected, function (selecteddata) {
                    let chid = selecteddata[0][0];
                    if (chid.fir == null && chid.issubchild) {
                        //console.log("inside if.........")
                        CIPAService.executeSQL(childclass, function (childdata) {
                            var resultbatchilddata = childdata[0];
                            if (resultbatchilddata[0].count == 0) {
                                let parentupdate = "update classficationfiles set  isupload=true where id in(select parent from classficationfiles where id =" + req.body.id + " )";
                                CIPAService.UpdateexecuteSQL(parentupdate, function (data22) {

                                    updatefir = "select count(*) from classficationfiles  where fir in (select fir from classficationfiles where id in (select parent from classficationfiles where id=" + req.body.id + " )) and isupload=false and ocrpdfpath is not  null"
                                    CIPAService.executeSQL(updatefir, function (batchdata) {
                                        var resultbat = batchdata[0];
                                        if (resultbat[0].count == 0) {
                                            let firupdate = "update firs set isupload=true,setuploadfile=true,upload_at=NOW() where id in (select fir from classficationfiles where id in (select parent from classficationfiles where id=" + req.body.id + " ))";
                                            CIPAService.UpdateexecuteSQL(firupdate, function (data22) {
                                                res.send({ status: true });
                                            })
                                        } else {
                                            res.send({ status: true });
                                        }
                                    })
                                })
                            } else {
                                res.send({ status: true });
                            }

                        })
                    } else {
                        // console.log("inside else if.........")
                        CIPAService.executeSQL(updatefir, function (batchdata) {
                            var resultbat = batchdata[0];
                            if (resultbat[0].count == 0) {
                                let firupdate = "update firs set isupload=true,setuploadfile=true,upload_at=NOW() where id in (select fir from classficationfiles where id=" + req.body.id + ")";
                                CIPAService.UpdateexecuteSQL(firupdate, function (data22) {
                                    res.send({ status: true });
                                })
                            } else {
                                res.send({ status: true });
                            }
                        })
                    }


                })




            } else {
                res.send({ status: false });
            }
        })
    } catch (err) {
        res.send({ status: false, data: err });
    }


}
webserviceController.prototype.resetuploadtoDMS = function (req, res) {
    var setfirupload = "update firs set setuploadfile=false where isupload=false ";
    CIPAService.UpdateexecuteSQL(setfirupload, function (data22) {
        res.send({ status: true });
    })
}
webserviceController.prototype.getListofpdfuploadtoDMS = function (req, res) {
    httpService.get("/firs?imagestatus=6&setuploadfile=false&readyforupload=true&isupload_eq=false&_limit=100", req.body, function (node1) {
        var query = "?isupload_eq=false";
        firs = JSON.parse(node1)
        var setfirupload = "update firs set setuploadfile=true where id in (";

        for (var i = 0; i < firs.length; i++) {
            if (i != firs.length - 1) {
                query = query + "&fir=" + parseInt(firs[i].id);
                setfirupload = setfirupload + "" + parseInt(firs[i].id) + ",";
            } else {
                setfirupload = setfirupload + "" + parseInt(firs[i].id) + ")";
                query = query + "&fir=" + parseInt(firs[i].id) + "&_limit=-1";
            }
        }

        //console.log("..setfirupload.....", setfirupload)
        if (firs.length == 0) {
            res.send({ status: true, data: [] });
        } else {
            CIPAService.UpdateexecuteSQL(setfirupload, function (data22) {
            })
            console.log(".............../classficationfiles" + query)
            httpService.get("/classficationfiles" + query, req.body, function (node) {
                node = JSON.parse(node)
                let parentnode = [];
                node.forEach(element => {

                    if (element.issubchild) {
                        let childaaray = [];
                        element.child.forEach(child => {
                            if (!child.isupload) {
                                childaaray.push(child);
                            }
                        })
                        element.child = childaaray;
                        if (element.child.length != 0) {
                            parentnode.push(element);
                        } else {
                            httpService.put("/classficationfiles/" + element.id, { isupload: true }, function (update) {
                                let firupdate = "update firs set isupload=true,upload_at=NOW() where id in (select fir from classficationfiles where id=" + element.id + ")";
                                CIPAService.UpdateexecuteSQL(firupdate, function (data22) {
                                })

                            })
                        }
                    } else {
                        parentnode.push(element);
                    }
                })
                res.send({ status: true, data: parentnode });

            })
        }


        // res.send({ status: true, data: batchs });
    })


}

webserviceController.prototype.commitFileFromClassification = function (req, res) {
    let user = req.session.user;

    console.log("=====================commit Classfication FILE============")
    console.log("body...", req.body)
    console.log("=====================commit Classfication FILE============")
    if (req.body.Classficationpagecount == undefined || req.body.Classficationpagecount == null) {
        req.body.Classficationpagecount = 0;
    }
    var body = { jwtkey: req.body.jwtkey, imagestatus: 4, islock: false, classification_at: new Date(), classification_by: user.user.id, classficationpagecount: req.body.Classficationpagecount }  //need to add in enm      
    httpService.put("/firs/" + req.body.id, body, function (node) {
        node = JSON.parse(node)
        if (node.statusCode == undefined && node.batch.id != undefined) {
            var fir = { id: node.id, pagecount: node.pagecount, year: node.year };
            res.send({ status: true, data: fir });
        } else {
            res.send({ status: false, message: "fir not Found" });
        }

    })
}
webserviceController.prototype.finalQC = function (req, res) {
    let user = req.session.user;
    var body = { jwtkey: req.body.jwtkey, imagestatus: 4, islock: false, classificationqc_at: new Date(), classificationqc_by: user.user.id }  //need to add in enm      
    httpService.put("/firs/" + req.body.id, body, function (node) {
        node = JSON.parse(node)
        if (node.statusCode == undefined && node.batch.id != undefined) {
            var fir = { id: node.id, pagecount: node.pagecount, year: node.year };
            res.send({ status: true, data: fir });
        } else {
            res.send({ status: false, message: "fir not Found" });
        }

    })
}
webserviceController.prototype.editClassficationByID = function (req, res) {
    let user = req.session.user;
    var body = { jwtkey: req.body.jwtkey }  //need to add in enm      
    httpService.get("/classficationfiles/" + req.body.id, body, function (node) {
        files = JSON.parse(node);
        classficationDTOP(files)
        res.send({ status: true, data: files });
    })
}

webserviceController.prototype.deleteClassficationByID = function (req, res) {
    let user = req.session.user;
    var body = { jwtkey: req.body.jwtkey }
    console.log("class delete ", req.body)
    var deletequery = "delete from classficationfiles where id=" + req.body.id;
    CIPAService.DeleteeexecuteSQL(deletequery, function (data) {
        if (data != null) {
            res.send({ status: true });
        } else {
            res.send({ status: false });
        }
    })
}


webserviceController.prototype.savefirfromscanPDF = function (req, res) {
    let user = req.session.user;
    var body = { jwtkey: req.body.jwtkey, imagestatus: 5, islock: false, pdfpagecount: req.body.pdfpagecount, pdf_at: new Date(), pdf_by: req.session.user.user.id }
    //var body = { jwtkey: req.body.jwtkey, imagestatus: 5, islock: false, pdfpagecount: req.body.pdfpagecount }  //need to add in enm      
    httpService.put("/firs/" + req.body.id, body, function (node) {
        node = JSON.parse(node)
        if (node.statusCode == undefined && node.batch.id != undefined) {
            var fir = { id: node.id, pdfpagecount: node.pdfpagecount, crn: node.crn, pagecount: node.pagecount, year: node.year };
            httpService.get(encodeURI("/firs/count?batch=" + node.batch.id + "&imagestatus_ne=5&inwardstatus_ne=2"), req.body, function (count) {
                if (count == 0) {
                    var batchbody = { jwtkey: req.body.jwtkey, qcreceive_at: new Date(), qccommited_at: new Date(), qccommited_by: user.user.id, islock: false, batchstatus: BatchStatusEnum.batchstatus.Qccommited }
                    httpService.put("/batches/" + node.batch.id, batchbody, function (batch) {
                        if (batch.statusCode == undefined) {
                            res.send({ status: true, islast: true });
                        } else {
                            res.send({ false: false, message: "" });
                        }
                    })

                } else {
                    res.send({ status: true, data: fir, islast: false });
                }
            })


        } else {
            res.send({ status: false, message: "fir not Found" });
        }

    })
}
// need to remove after done
webserviceController.prototype.getAllQCbatch = function (req, res) {
    let user = req.session.user;
    httpService.get(encodeURI("/batchesfindOnebyCreatedby?qccommited_by.id=" + req.session.user.user.id + "&islock=true"), req.body, function (node) {
        node = JSON.parse(node)
        if (node.status != false) {
            var lockbatch = { id: node.id, bundlenumber: node.bundlenumber }
            res.send({ status: true, islock: true, data: lockbatch });
        } else {
            httpService.get(encodeURI("/batchesfindAllbyCreatedby?scanningcommited_by.digitizationcenter.id=" + req.session.user.user.digitizationcenter.id + "&batchstatus=" + BatchStatusEnum.batchstatus.scanningcommited + "&islock=false"), "", function (allbatch) {
                allbatch = JSON.parse(allbatch)
                batchDTOs(allbatch)
                res.send({ status: true, islock: false, data: allbatch });
            })
        }

    })
}

// need to remove after done
webserviceController.prototype.getAllClassficationbatch = function (req, res) {
    let user = req.session.user;
    //need to add in enm  
    httpService.get(encodeURI("/findfirbyQuery?batch.created_by_d2.digitizationcenter=" + req.session.user.user.digitizationcenter.id + "&inwardstatus=1&imagestatus=3&qcreject=false&_sort=id:asc&_limit=-1"), req.body, function (allbatch) {
        allbatch = JSON.parse(allbatch)
        console.log("=======getAllClassficationbatch===")
        // console.log(allbatch)
        if (allbatch.statusCode == undefined) {
            getbatchByFire(allbatch).then(function (retuennode) {
                retuennode = retuennode.sort((a, b) => {
                    if (a.bundlenumber < b.bundlenumber) {
                        return -1;
                    }
                });
                res.send({ status: true, data: retuennode });
            })
        } else {
            res.send({ status: false, message: "" });
        }
    })
}
webserviceController.prototype.getQCfirbybatch = function (req, res) {
    var batchid = req.body.id
    httpService.get("/firs?batch.id=" + batchid + "&_limit=-1", req.body, function (allfir) {
        allfir = JSON.parse(allfir);
        if (allfir != null) {
            firDTOs(allfir)
            res.send({ status: true, data: allfir });
        } else {
            res.send({ status: false, data: [] });
        }
    })
}
webserviceController.prototype.getfirbybatch = function (req, res) {
    var batchid = req.body.id
    httpService.get("/firs?batch.id=" + batchid + "&_limit=-1", req.body, function (allfir) {
        allfir = JSON.parse(allfir);
        if (allfir != null) {
            firDTOs(allfir)
            res.send({ status: true, data: allfir });
        } else {
            res.send({ status: false, data: [] });
        }
    })
}
webserviceController.prototype.QCbatchCommited = (req, res) => {
    var batchid = req.body.id
    req.body.batchstatus = BatchStatusEnum.batchstatus.Qccommited;
    req.body.qccommited_at = new Date();
    req.body.qccommited_by = req.session.user.user.id;
    req.body.islock = false;
    httpService.put("/batches/" + batchid, req.body, function (node1) {
        node1 = JSON.parse(node1)
        var batchDTO = { id: node1.id, bundlenumber: node1.bundlenumber }
        res.send({ status: true, data: batchDTO });

    })
}
webserviceController.prototype.scanbatchCommited = (req, res) => {
    var batchid = req.body.id
    req.body.batchstatus = BatchStatusEnum.batchstatus.scanningcommited;
    req.body.scanningcommited_at = new Date();
    req.body.scanningcommited_by = req.session.user.user.id;
    req.body.islock = false;
    httpService.put("/batches/" + batchid, req.body, function (node1) {
        node1 = JSON.parse(node1)
        var batchDTO = { id: node1.id, bundlenumber: node1.bundlenumber }
        res.send({ status: true, data: batchDTO });

    })
}
webserviceController.prototype.recivebatchforQC = function (req, res) {
    let user = req.session.user;
    var batchid = req.body.id
    if (batchid != undefined && batchid != null) {
        httpService.get("/batchesfindOnebycreatedby?id=" + batchid, req.body, function (node) {
            var batch = JSON.parse(node);
            if (batch.islock) {
                if (batch.qccommited_by == req.session.user.user.id) {
                    var batchDTO = { id: batch.id, bundlenumber: batch.bundlenumber }
                    res.send({ status: true, data: batchDTO });
                } else {
                    res.send({ status: false, message: "" });
                }
            } else {
                req.body.qccommited_by = req.session.user.user.id;
                req.body.islock = true;
                req.body.qccommited_by = new Date();
                httpService.put("/batches/" + batchid, req.body, function (node1) {
                    node1 = JSON.parse(node1)

                    if (node1.statusCode == 200) {
                        res.send({ status: true });
                    } else {
                        res.send({ status: false });
                    }

                })
            }
        })
    } else {
        res.send({ status: false, data: null });
    }
}
webserviceController.prototype.recivebatchforscanning = function (req, res) {
    let user = req.session.user;
    var batchid = req.body.id
    if (batchid != undefined && batchid != null) {
        httpService.get("/batchesfindOnebycreatedby?id=" + batchid, req.body, function (node) {
            var batch = JSON.parse(node);
            if (batch.islock) {
                if (batch.scanningcommited_by.id == req.session.user.user.id) {
                    res.send({ status: true, data: batch });
                } else {
                    res.send({ status: false, message: "" });
                }
            } else {
                req.body.scanningcommited_by = req.session.user.user.id;
                req.body.islock = true;
                req.body.scanningreceive_at = new Date();
                httpService.put("/batches/" + batchid, req.body, function (batch) {
                    batch = JSON.parse(batch)
                    if (batch.statusCode == 200) {
                        res.send({ status: true });
                    } else {
                        res.send({ status: false });
                    }

                })
            }
        })
    } else {
        res.send({ status: false, data: null });
    }
}
webserviceController.prototype.logoutservice = function (req, res) {
    req.session.destroy();
    const AxiosUtil = new AsiosUtil();
    const loginResponce = AxiosUtil.postxForm("/api/authn/logout", {});
    localStorage.clear();
    res.send({ status: true })
}
webserviceController.prototype.logout = function (req, res) {
    req.session.destroy();
    res.redirect("/")
}

webserviceController.prototype.getAllDataEnterybatch = function (req, res) {
    let user = req.session.user;
    //need to add in enm  
    httpService.get(encodeURI("/findfirbyQuery?batch.created_by_d2.digitizationcenter=" + req.session.user.user.digitizationcenter.id + "&inwardstatus=1&imagestatus=2&qcreject=false&_sort=fileno:asc&_limit=-1"), req.body, function (allbatch) {
        allbatch = JSON.parse(allbatch)
        //console.log("=======getAllClassficationbatch===")
        // //console.log(allbatch)
        if (allbatch.statusCode == undefined) {
            getbatchByFire(allbatch).then(function (retuennode) {
                retuennode = retuennode.sort((a, b) => {
                    if (a.bundlenumber < b.bundlenumber) {
                        return -1;
                    }
                });
                res.send({ status: true, data: retuennode });
            })
        } else {
            res.send({ status: false, message: "" });
        }
    })
}
webserviceController.prototype.metadatamaster = function (req, res) {
    httpService.get("/metadata?isactive=true&_limit=-1", req.body, function (node) {
        //console.log(node);
        node = JSON.parse(node)
        res.send({ status: true, data: node });

    })
}
webserviceController.prototype.savemetadataByFile = function (req, res) {

    const jsonArray = JSON.parse(req.body.metadata);
    //console.log("req.body>>>", jsonArray);
    //res.send({ status: false, data: null });
    if (jsonArray == null || jsonArray == undefined || jsonArray.length == 0) { 
        res.send({ status: false, message: "No metadata found" });
        return;
    } else {
        let query = "insert INTO metadatavalues (value, fir, Metadatum) VALUES ";
        for (let i = 0; i < jsonArray.length; i++) {
            if (i != jsonArray.length - 1) {
                query = query + "('" + jsonArray[i].value.replace(/'/g, "''") + "'," + req.body.fileid + "," + jsonArray[i].metadataid + "),"
            } else {
                query = query + "('" + jsonArray[i].value.replace(/'/g, "''") + "'," + req.body.fileid + "," + jsonArray[i].metadataid + ")"
            }

        }
        var deletequesy = "delete from metadatavalues where fir = " + req.body.fileid;
        CIPAService.DeleteeexecuteSQL(deletequesy, function (data111) {
            CIPAService.InsertexecuteSQL(query, function (data22) {
                var body = { jwtkey: req.body.jwtkey, imagestatus: 3, islock: false, metadata_at: new Date(), metadata_by: req.session.user.user.id, metadatapage: req.body.pages }


                httpService.put("/firs/" + req.body.fileid, body, function (node1) {
                    files = JSON.parse(node1);
                    var fir = { id: files.id, firserialnumber: files.fileno, pagecount: files.pagecount, year: files.year };
                    res.send({ status: true, data: fir });
                })
            })
        })
    }

   
    // //console.log(query)



    // res.send({ status: true });
}
webserviceController.prototype.updatemetadataByFile = function (req, res) {

    const jsonArray = JSON.parse(req.body.metadata);
    //console.log("req.body>>>", jsonArray);
    //res.send({ status: false, data: null });
    if (jsonArray == null || jsonArray == undefined || jsonArray.length == 0) { 
        res.send({ status: false, message: "No metadata found" });
    } else {
        let query = "insert INTO metadatavalues (value, fir, Metadatum) VALUES ";
        for (let i = 0; i < jsonArray.length; i++) {
            if (i != jsonArray.length - 1) {
                query = query + "('" + jsonArray[i].value.replace(/'/g, "''") + "'," + req.body.fileid + "," + jsonArray[i].metadataid + "),"
            } else {
                query = query + "('" + jsonArray[i].value.replace(/'/g, "''") + "'," + req.body.fileid + "," + jsonArray[i].metadataid + ")"
            }

        }
        var deletequesy = "delete from metadatavalues where fir = " + req.body.fileid;
        CIPAService.DeleteeexecuteSQL(deletequesy, function (data111) {
            CIPAService.InsertexecuteSQL(query, function (data22) {


                res.send({ status: true, data: data22 });
            })
        })
        // //console.log(query)

    }

   


    // res.send({ status: true });
}
async function firDTOs(allfir) {
    await allfir.forEach(elm => {
        delete elm.inwardstatus
        delete elm.batch
        delete elm.firinwardremarks
        delete elm.updated_at
        delete elm.created_at
        delete elm.updated_by
        delete elm.created_by
        delete elm.tagstatus

    })
}
async function getbatchByFire(firs) {
    var batchs = []
    var lockbatch = [];
    await firs.forEach(elm => {
        var picked = batchs.find(o => o.id === elm.batch.id);
        var firobj;
        //let caestype = elm.casetype.replace(/\//g, '-').replace(/\s+/g, '-');
        let caestype = elm.casetype.replace(/\//g, '-').replace(/\s+/g, '-').replace(/,/g,'-');
        if (elm.islock) {
            //console.log("garuav:::"+elm.islock)
            firobj = {
                id: elm.id, firserialnumber: caestype + "_" + elm.caseno + "_" + elm.year, itemid: elm.itemid, caseno: elm.crn,
                pagecount: elm.pagecount, firremarks: elm.firremarks,
                metadatavalues: [],
                verify_by: elm.verify_by != null ? elm.verify_by.name : elm.verify_by,
                verifyremarks: elm.verifyremarks,
            }
            var fir = []
            fir.push(firobj);
            lockbatch.push({ id: elm.batch.id, bundlenumber: elm.batch.bundlenumber, fir: fir })
        } else {
            firobj = {
                id: elm.id, firserialnumber: caestype + "_" + elm.caseno + "_" + elm.year, caseno: elm.crn, itemid: elm.itemid,
                pagecount: elm.pagecount, firremarks: elm.firremarks,
                metadatavalues: [],
                verify_by: elm.verify_by != null ? elm.verify_by.name : elm.verify_by,
                verifyremarks: elm.verifyremarks
            }
        }
        if (picked == undefined) {
            var fir = []
            fir.push(firobj);
            batchs.push({ id: elm.batch.id, bundlenumber: elm.batch.bundlenumber, fir: fir })
        } else {
            picked.fir.push(firobj);
        }
    })
    if (lockbatch.length != 0) {
        return lockbatch;
    } else {
        return batchs;
    }

}
async function classficationDTOP(files) {
    await files.forEach(elm => {
        elm.fir = elm.fir.id
    })
}
async function batchDTOs(batchs) {
    await batchs.forEach(elm => {
        delete elm.created_by_d2
        delete elm.firs
        delete elm.scanningcommited_by
        delete elm.scanningcommited_at
        delete elm.scanningreceive_at
        delete elm.filetagcommitted_at
        delete elm.filetagcommitted_by
        delete elm.filetagreceive_at
        delete elm.inwardreceive_at
        delete elm.islock
        delete elm.created_at_d2
        delete elm.inwardcommited_at
        delete elm.inwardcommited_by
        delete elm.createedby_at_d2
        delete elm.updated_at
        delete elm.created_at
        delete elm.updated_by
        delete elm.created_by
        delete elm.batchstatus
        delete elm.deliveryschedule
        delete elm.outwardreceive_at
        delete elm.outwardcommited_at
        delete elm.returndate
        delete elm.qcreceive_at
        delete elm.qccommited_at
        delete elm.qccommited_by
        delete elm.receive_at
        delete elm.receivecommited_at
        delete elm.receivecommited_by
    })
}
module.exports = new webserviceController();

