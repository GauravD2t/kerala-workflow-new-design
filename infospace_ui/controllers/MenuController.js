var httpService = require('../service/httpService.js')
//var XLSX = require('xlsx');
//var fs = require('fs');
function MenuController() {
}

MenuController.prototype.readDataFromExcle = function (req, res) {
    console.log("gaurav patel")
    var strsql="INSERT INTO public.policestation(ps_cd, lang_cd, ps, isdeleted, district, created_by, updated_by, created_at, updated_at)	VALUES ";
  //  var strDistricsql="INSERT INTO public.district(district_cd, lang_cd, state, range_cd, district, isdeleted, created_by, updated_by, created_at, updated_at)	VALUES ";
    var counter = 0;
    console.log("xlData MAster Datata");
    var workbook = XLSX.readFile('F:\\snvccnts\\cctns_UI\\controllers\\master_tables.xlsx');
    var sheet_name_list = workbook.SheetNames;
    //var StatexlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[1]]);
   // var DistrixlctData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[2]]);
    var PolicstaticxlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[3]]);
    var stateSTRIAPI = [];
    var distric = [];
    var policstatis = [];
// insert into District 
//  httpService.get("/districts?state.state_cd=27", "", function (node) {
//         stateSTRIAPI = JSON.parse(node)
//         console.log("gaurav" + DistrixlctData.length)
//         for (var i = 0; i < DistrixlctData.length; i++) {
//                 if (DistrixlctData[i].LANG_CD != 6 && DistrixlctData[i].DISTRICT_CD != 0) {
//                     if(DistrixlctData[i].STATE_CD==27){
//                         console.log(counter++);
//                         var district = {}
//                     district.district_cd = DistrixlctData[i].DISTRICT_CD;
//                     district.lang_cd = DistrixlctData[i].LANG_CD;
//                     district.state=1
//                     district.range_cd=DistrixlctData[i].RANGE_CD == undefined ? 0 : DistrixlctData[i].RANGE_CD;
//                     district.district=DistrixlctData[i].DISTRICT;
//                     district.isdeleted=false;
                                                  
//                     strDistricsql=strDistricsql+ "("+district.district_cd+","+district.lang_cd+","+district.state+","+district.range_cd+",'"+district.district+"',false,null, null, null, null),";
                   
//                     }
                    
//                 }
//         }

//         fs.appendFile('mynewfile1.txt',strDistricsql, function (err) {
//             if (err) throw err;
//             console.log('Saved!');
          
//           });
        
//     });

    //insert in to policstation

    // httpService.get("/districts?state.state_cd=27", "", function (node) {
    //     stateSTRIAPI = JSON.parse(node)
    //     console.log("gaurav" + PolicstaticxlData.length)
    //     for (var i = 0; i < PolicstaticxlData.length; i++) {
    //             if (PolicstaticxlData[i].LANG_CD != 6 && PolicstaticxlData[i].PS_CD != 0) {
                    
    //                 var police = {}
    //                 police.ps_cd = PolicstaticxlData[i].PS_CD;
    //                 police.lang_cd = PolicstaticxlData[i].LANG_CD;
    //                 var d=stateSTRIAPI.find(item => {
    //                     if (item.district_cd == PolicstaticxlData[i].DISTRICT_CD) {
    //                         police.district = item.id;
    //                         police.ps = PolicstaticxlData[i].PS
    //                         police.isdeleted = false;
    //                        // console.log("successfully" + counter++)
    //                         strsql=strsql+ "("+police.ps_cd+","+police.lang_cd+",'"+police.ps+"',false,"+police.district+",null, null, null, null),";
    //                         return true;
    //                     }
    //                 })
                    
    //             }
    //     }

    //     fs.appendFile('mynewfile1.txt',strsql, function (err) {
    //         if (err) throw err;
    //         console.log('Saved!');
          
    //       });
        
    // });

}
MenuController.prototype.menuPage = function (req, res) {
    res.render('menu', { title: 'Menu' });
}
MenuController.prototype.menu = (req, res) => {
    httpService.get("/menus", "", function (node) {
        res.send({ status: true, data: JSON.parse(node) });
    })
}
MenuController.prototype.save = (req, res) => {
    console.log(JSON.stringify(req.body))
    httpService.post("/menus", JSON.stringify(req.body), function (node) {
        res.send({ status: true, data: JSON.parse(node) });
    })
}
MenuController.prototype.delete = (req, res) => {
    console.log(req.params.id)
    httpService.delete("/menus/" + req.params.id, "", function (node) {
        console.log(node)
        res.send({ status: true, data: JSON.parse(node) });
    })
    // res.send({ status: true});
}
MenuController.prototype.edit = (req, res) => {
    console.log(req.params.id)
    httpService.get("/menus/" + req.params.id, "", function (node) {
        console.log(node)
        res.send({ status: true, data: JSON.parse(node) });
    })
    // res.send({ status: true});
}
//update
MenuController.prototype.update = (req, res) => {
    console.log(JSON.stringify(req.body))
    httpService.put("/menus/" + req.params.id, JSON.stringify(req.body), function (node) {
        res.send({ status: true, data: JSON.parse(node) });
    })
}
MenuController.prototype.getmenubyrole = (req, res) => {
    
    httpService.get("/menus?roles.id=" + req.params.id,req.body, function (node) {
        res.send({ status: true, data: JSON.parse(node) });
    })
}
module.exports = new MenuController();