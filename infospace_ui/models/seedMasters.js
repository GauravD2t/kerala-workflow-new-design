var db = require('./index');

var MASTER_DATA = {
    State: [
        { state_id: 32, state: 'KERALA' }
    ],
    District: [
        { dist_code: 4, dist_name: 'Alappuzha' }
    ],
    Taluka: [
        { dist_code: 3, taluka_code: 1057, taluka_name: 'Adoor' }
    ],
    Village: [
        { dist_code: 10, taluka_code: 1049, village_code: 285, village_name: 'Abdu Rahiman Nagar (Ct)' }
    ],
    CaseType: [
        { case_type: 56, type_name: 'AOP', full_form: 'OP(ARBITRATION)' }
    ],
    IaCaseType: [
        { ia_case_type: 2, ia_type_name: 'Crl.MP', ia_full_form: 'Crl.MP' }
    ],
    Purpose: [
        { purpose_code: 189, purpose_name: '82-83 Steps' }
    ],
    ActMaster: [
        { actcode: '2262', actname: 'Aadhaar (Targeted Delivery of Financial and Other Subsidies, Benefits and Services) Act, 2016' }
    ],
    IaNature: [
        { iacls_code: 1501, iacls_name: '205 Crpc Petition' }
    ],
    DocumentType: [
        { docu_type: 23, docu_name: '164 Statement' }
    ],
    PoliceStationMaster: [
        { police_st_code: 17, police_st_name: 'Ernakulam' }
    ],
    FirType: [
        { fir_type_code: 3, fir_type_name: 'Complaint' }
    ],
    Subject: [
        { subject_code: 501, subject_name: '138 NI Act cases' }
    ],
    Advocate: [
        { adv_code: '226', adv_name: 'AABID ALI K', adv_reg: 'K/809/2022' }
    ],
    Organization: [
        { orgid: 14, orgname: 'AVA Condiments Private Limited' }
    ],
    CourtMaster: [
        { court_no: 1, judge_code: 5, from_dt: '2016-05-26T18:30:00.000Z', to_dt: '2016-07-10T18:30:00.000Z', jocode: 'KL00652', desg_code: 1, judge_name: 'Jisha Mukundan R' }
    ],
    DisposalNature: [
        { disp_type: 1, disp_name: 'AQUITTED' }
    ]
};

async function seed() {
    await db.sequelize.sync();
    for (var modelName in MASTER_DATA) {
        var rows = MASTER_DATA[modelName];
        if (!rows.length) continue;
        await db[modelName].destroy({ where: {} });
        await db[modelName].bulkCreate(rows);
        console.log(modelName + ': seeded ' + rows.length + ' row(s)');
    }
    console.log('Master seed complete.');
}

seed()
    .then(function () { process.exit(0); })
    .catch(function (err) {
        console.error('Master seed failed:', err);
        process.exit(1);
    });
