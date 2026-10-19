
var httpService = require('../service/httpService.js')
var BatchNoGenrate = require('../util/batchNumberGenrate.js')
var moment = require('moment');
const AsiosUtil = require("../service/AxiosUtil")
var LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');
var CIPAService = require("../service/CIPAService");
var CaseService = require("../service/CaseService.js");
const crypto = require('crypto');
const axios = require('axios');
var AxiosUtilKerala = require("../service/AxiosKeralaUtil");
const AxiosUtilkr = new AxiosUtilKerala();
const querystring = require('querystring');
const dept_id = 'cpckerala@ecourts.gov.in';
const version = 'v1.0.0';
const secretKey = "15081947";
var fs = require("fs")
function FIRController() {
}
FIRController.prototype.firdPage = function (req, res) {

   
            try {
                let user = req.session.user;
                        httpService.get("/batchesfindOnebycreatedby?created_by_d2=" + parseInt(user.user.id) + "&batchstatus=" + BatchStatusEnum.batchstatus.createbatch, req.body, function (node1) {
                            node1 = JSON.parse(node1)
                            if (node1.status != false) {
                                //Already Exirts
                                req.session.batch = { id: node1.id };
                                res.render('fir', { title: 'Batch Management – Create Batch', batch: node1, locals: res.locals });
                            } else {
                                //create batch
                                req.body.created_by_d2 = user.user.id;
                                req.body.islock = true;
                                req.body.bundlenumber = "";
                                req.body.batchstatus = BatchStatusEnum.batchstatus.createbatch;
                                httpService.post("/batches", req.body, function (returnnode) {
                                    returnnode = JSON.parse(returnnode.data)
                                    if (returnnode != null) {
                                        req.session.batch = { id: returnnode.id };
                                        res.render('fir', { title: 'Batch Management – Create Batch', batch: returnnode, locals: res.locals });
                                    } else {
                                        res.render('fir', { title: 'Batch Management – Create Batch', batch: null, locals: res.locals });
                                    }
                                });
                            }
                        })

            } catch (err) {
                res.send({ status: false })
                // AxiosUtil.postxForm("/api/authn/logout",{}).then(function(loginResponce){});  
                // localStorage.clear();

            }
        

}
FIRController.prototype.getAllfir = (req, res) => {
    var batch = req.session.batch;
    // console.log("FIR::")
    // console.log(batch)
    httpService.get("/firsByBatch/" + batch.id, req.body, function (node) {
        if (node != null) {
            res.send({ status: true, data: JSON.parse(node) });
        } else {
            res.send({ status: true, data: [] });
        }
    })
}
FIRController.prototype.save = (req, res) => {
    if (req.session.batch != null) {

        req.body.inwardstatus = 1;

        req.body.imagestatus = -1;
        req.body.returnstatus = 0;
        req.body.firvalidate = false;
        req.body.qcreject = false;
        req.body.isupload = false;
        req.body.readyforverify = false;
        req.body.readyforupload = false;
        req.body.secondverify = false;
        req.body.thirdverify = false;
        req.body.batch = req.session.batch.id;
        if (req.body.pagecount == "")
            req.body.pagecount = 0;

        const jsonArray = JSON.parse(req.body.metadata);

        let query = "insert INTO metadatavalues (value, fir, Metadatum) VALUES ";

        httpService.post("/firs", req.body, function (node1) {
            let fir = JSON.parse(node1.data)
            for (let i = 0; i < jsonArray.length; i++) {
                if (i != jsonArray.length - 1) {
                    query = query + "('" + jsonArray[i].value.replace(/'/g, "''") + "'," + fir.id + "," + jsonArray[i].id + "),"
                } else {
                    query = query + "('" + jsonArray[i].value.replace(/'/g, "''") + "'," + fir.id + "," + jsonArray[i].id + ")"
                }

            }
           // console.log(query)
           
                CIPAService.InsertexecuteSQL(query, function (data22) {
                    res.send({ status: true, data: JSON.parse(node1.data) });
                })
            
        })

    } else {
        //logout here
    }
}
FIRController.prototype.delete = (req, res) => {
    var firId = req.params.id;
    CaseService.getCaseByFir(firId)
        .then(function (detail) {
            if (!detail) return null;
            return CaseService.deleteCase(detail.id);
        })
        .catch(function (err) {
            console.error('firDelete: case details delete failed:', err);
        })
        .then(function () {
            httpService.delete("/firs/" + firId, "", function (node) {
                res.send({ status: true, data: node ? JSON.parse(node) : null });
            })
        })
    // res.send({ status: true});
}
FIRController.prototype.delteFRIbyBatch = (req, res) => {
    if (req.session.batch != null) {
        httpService.delete("/delteFRIbyBatch/" + req.session.batch.id, "", function (node) {
            res.send({ status: true, data: JSON.parse(node) });
        })
    } else {
        //logout here
    }
    // res.send({ status: true});
}

FIRController.prototype.isvalidFIR = (req, res) => {
    let userID = "";
    if (req.session.user.user.digitizationcenter == null) {
        userID = req.session.user.user.id;
    } else {
        userID = req.session.user.user.digitizationcenter.id;
    }
    // console.log(req.body.casetype);
    //console.log(req.body.caseyear);
    //console.log(req.body.caseno);
    httpService.get(encodeURI("/findfirbyQuery?batch.created_by_d2.digitizationcenter=" + userID + "&casetype_eq=" + req.body.casetype + "&year_eq=" + req.body.caseyear + "&caseno_eq=" + req.body.caseno), req.body, function (node) {
        node = JSON.parse(node)
        // console.log(node)    
        if (node.length == 0) {
            res.send({
                status: true
            })
        } else {
            res.send({ status: false, data: node[0] })
        }
    })

    // res.send({ status: true});
}
FIRController.prototype.edit = (req, res) => {
    httpService.get("/firs/" + req.params.id, req.body, function (node) {
        res.send({ status: true, data: JSON.parse(node) });
    })


    // res.send({ status: true});
}

FIRController.prototype.getcasetypebyEsticode = (req, res) => {
    try {

        let requestStr = "est_code=" + req.params.crn;
        const requestToken = crypto.createHmac('sha256', secretKey).update(requestStr).digest('hex');
        let encrypted_request_str = AxiosUtilkr.encrypt(requestStr);

        // URL encode the encrypted string
        encrypted_request_str = querystring.escape(encrypted_request_str);

        const headers = {
            'Authorization': localStorage.getItem("access_token").trim()
        };
        // console.log("headers......", headers);
        const url = `https://delhigw.napix.gov.in/nic/ecourts/dc-casetype-master-api/casetypeMaster?dept_id=${dept_id}&request_str=${encrypted_request_str}&request_token=${requestToken}&version=${version}`;

        axios.get(url, { headers })
            .then(response => {
                const result = JSON.parse(AxiosUtilkr.decrypt(response.data.response_str));

                const caseTypesArray = Object.keys(result).map(key => {
                    return {
                        case_type: result[key].case_type,
                        type_name: result[key].type_name
                    };
                });

                res.send({ status: true, data: caseTypesArray })
            })
            .catch(error => {

                //console.error("Error occurred:", error);
                res.send({ status: false, data: [] })
            });

    } catch (err) {
        //console.log(err)
        res.send({ status: false, data: [] })
        // AxiosUtil.postxForm("/api/authn/logout",{}).then(function(loginResponce){});  
        // localStorage.clear();

    }




    // res.send({ status: true});
}

FIRController.prototype.getCasetypecaenoyearDMS = (req, res) => {
    try {

        let requestStr = "est_code=" + req.query.est_code + "|case_type=" + req.query.casetype + "|reg_no=" + req.query.caseno + "|reg_year=" + req.query.caseyear;
        //let requestStr = "est_code=MHAH30|case_type=15|reg_no=227|reg_year=2024";
        const requestToken = crypto.createHmac('sha256', secretKey).update(requestStr).digest('hex');
        let encrypted_request_str = AxiosUtilkr.encrypt(requestStr);

        // URL encode the encrypted string
        encrypted_request_str = querystring.escape(encrypted_request_str);

        const headers = {
            'Authorization': localStorage.getItem("access_token").trim()
        };
        // console.log("headers......", headers);
        const url = `https://delhigw.napix.gov.in/nic/ecourts/dc-case-number-api/caseSearch?dept_id=${dept_id}&request_str=${encrypted_request_str}&request_token=${requestToken}&version=${version}`;

        axios.get(url, { headers, timeout: 100000 })
            .then(response => {
                //  console.log("response.data.status>>>>>>>>>>>>>", JSON.parse(AxiosUtilkr.decrypt(response.data.response_str)))
                if (JSON.stringify(response.data).includes('[status] =>')) {

                    res.send({ status: false, data: 'RECORD NOT FOUND' })
                } else {
                    const result = JSON.parse(AxiosUtilkr.decrypt(response.data.response_str));
                    requestStr = "cino=" + result.casenos.case1.cino;
                    const requestToken1 = crypto.createHmac('sha256', secretKey).update(requestStr).digest('hex');
                    let encrypted_request_str1 = AxiosUtilkr.encrypt(requestStr);

                    // URL encode the encrypted string
                    encrypted_request_str1 = querystring.escape(encrypted_request_str1);

                    const url2 = `https://delhigw.napix.gov.in/nic/ecourts/dc-cnr-api/cnr?dept_id=${dept_id}&request_str=${encrypted_request_str1}&request_token=${requestToken1}&version=${version}`;
                    axios.get(url2, { headers, timeout: 100000 })
                        .then(response2 => {
                            const result2 = JSON.parse(AxiosUtilkr.decrypt(response2.data.response_str));
                            //fs.writeFileSync('E://casedata.json', JSON.stringify(result2), 'utf-8');
                            res.send({ status: true, data: result2 })
                        }).catch(error => {

                            console.log("error>>>>>>", error)
                            res.send({ status: false, data: 'RECORD NOT FOUND' })
                        });
                }

                //res.send({ status: true, data: result })
            })
            .catch(error => {

                console.error("Error occurred:", error.data);
                res.send({ status: false, data: 'RECORD NOT FOUND' })
            });

    } catch (err) {
        //console.log(err)
        res.send({ status: false, data: [] })
        // AxiosUtil.postxForm("/api/authn/logout",{}).then(function(loginResponce){});  
        // localStorage.clear();

    }
}
//update
FIRController.prototype.update = (req, res) => {
    if (req.session.batch != null) {
        req.body.updated_by = req.session.user.user.id;
        httpService.put("/firs/" + req.params.id, req.body, function (node1) {
            res.send({ status: true, data: JSON.parse(node1) });
        })
    } else {
        //logout here 
    }
}

FIRController.prototype.editupdateBatch = (req, res) => {
    req.body.islock = false;
    if (req.body.deliveryschedule != undefined) {
        var date = moment(req.body.deliveryschedule, 'DD/MM/YYYY').format('YYYY-MM-DD');
        req.body.deliveryschedule = date + " 23:50:50";
    }
    let bundlenumber = req.session.batch.bundlenumber;
    let lastno = "";
    let bb = bundlenumber.split("-");
    lastno = bb[bb.length - 1];

    req.body.bundlenumber = req.body.departmentsearch + "-" + lastno;


    httpService.put("/batches/" + req.session.batch.id, req.body, function (node) {
        res.send({ status: true, data: JSON.parse(node) });
    })
}
//update
FIRController.prototype.batchCommitUpdate = (req, res) => {
    if (req.body.deliveryschedule != undefined) {
        var date = moment(req.body.deliveryschedule, 'DD/MM/YYYY').format('YYYY-MM-DD');
        req.body.deliveryschedule = date + " 23:50:50";
    }

    var bundlenumber = "";
    console.log("req.body.gapbatch......", req.body.gapbatch);
    var user = req.session.user;
    var deletequesy = "SELECT MAX(CAST(SPLIT_PART(bundlenumber, '-', array_length(string_to_array(bundlenumber, '-'), 1)) AS INTEGER)) AS bundlenumber FROM batches";
    CIPAService.executeSQLOnlyData(deletequesy, function (data111) {
        console.log("data111", data111[0]);


        if (data111[0] != undefined) {
            let lastno = "";
            const lastNo = data111[0].bundlenumber != null ? data111[0].bundlenumber : '0000';
            let batchno = (parseInt(lastNo, 10) + 1).toString().padStart(4, '0');
           
                bundlenumber = req.body.departmentsearch + "-" + batchno;

                req.body.batchstatus = BatchStatusEnum.batchstatus.Createcommitted;
                req.body.bundlenumber = bundlenumber;
                var batch = req.session.batch;
                req.body.created_at_d2 = new Date()
                req.body.islock = false;
                httpService.put("/batches/" + batch.id, req.body, function (node1) {
                    res.send({ status: true, data: JSON.parse(node1) });
                })
            
        } 
       
    })
}
FIRController.prototype.batchesfindAllbyCreatedby = (req, res) => {
    // console.log("req.params==============")
    //console.log(req.query)

    let user = req.session.user;
    var start = 0;
    if (req.query.pagination != undefined) {
        start = (parseInt(req.query.pagination.page) - 1) * parseInt(req.query.pagination.perpage)
        if (req.query.pagination.total != undefined) {
            if (start > parseInt(req.query.pagination.total)) {
                start = 0;
                req.query.pagination.page = 1;
            }
        }
    }
    if (req.params.id == 1) {

        httpService.get(encodeURI("/batches/count?created_by_d2=" + user.user.id + "&batchstatus=" + BatchStatusEnum.batchstatus.Createcommitted + "&deliveryschedule_lt=" + moment().format('YYYY-MM-DD HH:mm:ss')), req.body, function (count) {
            httpService.get(encodeURI("/batchesfindAllbyCreatedby?created_by_d2=" + user.user.id + "&batchstatus=" + BatchStatusEnum.batchstatus.Createcommitted + "&deliveryschedule_lt=" + moment().format('YYYY-MM-DD HH:mm:ss') + "&_sort=bundlenumber:ASC&_start=" + start + "&_limit=" + req.query.pagination.perpage), req.body, function (node) {
                var meta = req.query.pagination;
                meta.total = count;
                res.send({ status: true, data: JSON.parse(node), meta: meta });
            })
        })
    } else if (req.params.id == 2) {

        httpService.get(encodeURI("/batches/count?created_by_d2=" + user.user.id + "&batchstatus=" + BatchStatusEnum.batchstatus.Createcommitted + "&deliveryschedule_gte=" + moment().format('YYYY-MM-DD HH:mm:ss')), req.body, function (count) {
            httpService.get(encodeURI("/batchesfindAllbyCreatedby?created_by_d2=" + user.user.id + "&batchstatus=" + BatchStatusEnum.batchstatus.Createcommitted + "&deliveryschedule_gte=" + moment().format('YYYY-MM-DD HH:mm:ss') + "&_sort=bundlenumber:ASC&_start=" + start + "&_limit=" + req.query.pagination.perpage), req.body, function (node) {
                var meta = req.query.pagination;
                meta.total = count;
                res.send({ status: true, data: JSON.parse(node), meta: meta });
            })

        })

    }
    else if (req.params.id == 3) {

        httpService.get(encodeURI("/batches/count?created_by_d2=" + user.user.id + "&batchstatus_gte=" + BatchStatusEnum.batchstatus.inwardcommited), req.body, function (count) {
            httpService.get(encodeURI("/batchesfindAllbyCreatedby?created_by_d2=" + user.user.id + "&batchstatus_gte=" + BatchStatusEnum.batchstatus.inwardcommited + "&_sort=bundlenumber:ASC&_start=" + start + "&_limit=" + req.query.pagination.perpage), req.body, function (node) {
                var meta = req.query.pagination;
                meta.total = count;
                res.send({ status: true, data: JSON.parse(node), meta: meta });
            })
        })
    } else if (req.params.id == 4) {
        httpService.get(encodeURI("/batches/count?created_by_d2=" + user.user.id + "&batchstatus=" + BatchStatusEnum.batchstatus.Createcommitted), req.body, function (count) {
            httpService.get(encodeURI("/batchesfindAllbyCreatedby?created_by_d2=" + user.user.id + "&batchstatus=" + BatchStatusEnum.batchstatus.Createcommitted + "&_sort=bundlenumber:ASC&_start=" + start + "&_limit=" + req.query.pagination.perpage), req.body, function (node) {
                var meta = req.query.pagination;
                meta.total = count;
                res.send({ status: true, data: JSON.parse(node), meta: meta });
            })
        })
    }
}


FIRController.prototype.editBatch = (req, res) => {
    httpService.get("/batches/" + req.params.id, req.body, function (node) {

        var batch = JSON.parse(node);

        if (batch.islock && batch.inwardcommited_by != null) {

            res.send({ status: false, data: null });
        } else {
            req.body.islock = true;

            httpService.put("/retriveBatchUpdateFIR/" + req.params.id, req.body, function (node1) {
                httpService.get("/batchesfindOnebycreatedby?id=" + req.params.id, req.body, function (node) {
                    var batch = JSON.parse(node);
                    req.session.batch = { id: batch.id, bundlenumber: batch.bundlenumber };

                    res.send({ status: true, data: batch });
                });


            })
        }
    })
}
FIRController.prototype.cancleBatch = (req, res) => {
    req.body.islock = false;
    httpService.put("/batches/" + req.session.batch.id, req.body, function (node) {
        res.send({ status: true, data: JSON.parse(node) });
    })
}


FIRController.prototype.firreport = (req, res) => {
    res.render('FIRtrack', { title: 'FIR Report', locals: res.locals });
}
FIRController.prototype.firreportfilter = (req, res) => {
    var starttime = moment(req.query.start + " 00:00:00", 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    var endtime = moment(req.query.end + " 23:50:50", 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');

    httpService.get("/firhistories?updated_at_gte=" + starttime + "&updated_at_lte=" + endtime, req.body, function (node) {
        res.send({ status: true, data: JSON.parse(node) });
    })
}


FIRController.prototype.metadatamasterlist = (req, res) => {
    httpService.get("/metadata?_limit=-1&isactive=true", req.body, function (node) {
        res.send({ status: true, data: JSON.parse(node) });
    })

}


function getEstablishmentCodes(courtComplexes) {
    const result = [];

    // Iterate through each complex
    for (const complex in courtComplexes) {
        if (courtComplexes.hasOwnProperty(complex)) {
            const establishments = courtComplexes[complex];

            // Iterate through each establishment in the complex
            for (const key in establishments) {
                if (key.startsWith('establishment')) {
                    const establishment = establishments[key];
                    result.push({
                        est_code: establishment.est_code,
                        court_est_name: establishment.court_est_name
                    });
                }
            }
        }
    }

    return result;
}
module.exports = new FIRController();   