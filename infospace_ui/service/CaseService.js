var db = require('../models');

function CaseService() {
}

var LIST_CHILDREN = {
    additionalSubjects: 'AdditionalSubject',
    witnesses: 'Witness',
    victims: 'Victim',
    caveats: 'Caveat',
    acts: 'CaseAct',
    iaFilings: 'IaFiling',
    caseHistories: 'CaseHistory',
    iaHistories: 'IaHistory',
    orderDetails: 'OrderDetail',
    documents: 'CaseDocument'
};

var SINGLE_CHILDREN = {
    otherParty: 'OtherParty',
    factDetail: 'FactDetail',
    causeofaction: 'CauseOfAction',
    proceedingsPresence: 'ProceedingsPresence',
    trialCourtDetail: 'TrialCourtDetail',
    crimeDetails: 'CrimeDetail',
    transferDetail: 'TransferDetail'
};

function mapMainParty(party, partytype) {
    if (!party) return null;
    var adv = party.advocate || {};
    return {
        partytype: partytype,
        name: party.name,
        address: party.address,
        isPartyInPerson: party.isPartyInPerson || false,
        mobileNumber: party.mobileNumber,
        isHidden: party.isHidden || false,
        legalHeir: party.legalHeir,
        advName: adv.name,
        advCode: adv.code,
        advReg: adv.regNo
    };
}

function mapExtraParty(p) {
    var personal = p.personalDetails || {};
    var address = p.address || {};
    var org = p.organizationDetails || {};
    var adv = p.advocate || {};
    return {
        partyType: p.partyType,
        partyNo: p.partyNo,
        partyId: p.partyId,
        isPartyInPerson: p.isPartyInPerson || false,
        firstName: personal.firstName,
        lastName: personal.lastName,
        rank: personal.rank,
        age: personal.age,
        dateOfBirth: personal.dateOfBirth,
        gender: personal.gender,
        email: personal.email,
        mobile: personal.mobile,
        fullAddress: address.fullAddress,
        pincode: address.pincode,
        villageCode: address.villageCode,
        talukaCode: address.talukaCode,
        districtCode: address.districtCode,
        stateId: address.stateId,
        orgName: org.name,
        orgType: org.type,
        advName: adv.name,
        advCode: adv.code,
        advReg: adv.regNo,
        legalHeir: p.legalHeir,
        isNameHidden: p.isNameHidden || false,
        status: p.status || 'Y'
    };
}

function explodeAdditionalAdvocates(groups) {
    var rows = [];
    (groups || []).forEach(function (g) {
        (g.advocates || []).forEach(function (a) {
            rows.push({
                partyNo: g.partyNo,
                partyId: g.partyId,
                partyType: g.partyType,
                advName: a.name,
                advCode: a.code,
                advReg: a.regNo
            });
        });
    });
    return rows;
}

function buildChildRows(payload) {
    var rows = {};

    var mainParties = [];
    if (payload.mainparties) {
        var pet = mapMainParty(payload.mainparties.petitioner, 1);
        var res = mapMainParty(payload.mainparties.respondent, 2);
        if (pet) mainParties.push(pet);
        if (res) mainParties.push(res);
    }
    rows.MainParty = mainParties;

    rows.ExtraParty = (payload.extraParties || []).map(mapExtraParty);
    rows.AdditionalAdvocate = explodeAdditionalAdvocates(payload.additionalAdvocates);

    Object.keys(LIST_CHILDREN).forEach(function (key) {
        rows[LIST_CHILDREN[key]] = payload[key] || [];
    });

    Object.keys(SINGLE_CHILDREN).forEach(function (key) {
        rows[SINGLE_CHILDREN[key]] = payload[key] ? [payload[key]] : [];
    });

    return rows;
}

CaseService.prototype.saveCase = async function (payload) {
    return db.sequelize.transaction(async function (t) {
        var detail = await db.CaseDetail.create(payload.caseDetails, { transaction: t });
        var fk = { case_detail_id: detail.id };
        var childRows = buildChildRows(payload);

        for (var modelName in childRows) {
            var items = childRows[modelName];
            if (items.length) {
                await db[modelName].bulkCreate(
                    items.map(function (item) { return Object.assign({}, item, fk); }),
                    { transaction: t }
                );
            }
        }
        return detail;
    });
};

CaseService.prototype.updateCase = async function (id, payload) {
    return db.sequelize.transaction(async function (t) {
        var detail = await db.CaseDetail.findById(id, { transaction: t });
        if (!detail) return null;

        await detail.update(payload.caseDetails, { transaction: t });

        var allChildren = ['MainParty', 'ExtraParty', 'AdditionalAdvocate']
            .concat(Object.keys(LIST_CHILDREN).map(function (k) { return LIST_CHILDREN[k]; }))
            .concat(Object.keys(SINGLE_CHILDREN).map(function (k) { return SINGLE_CHILDREN[k]; }));

        for (var i = 0; i < allChildren.length; i++) {
            await db[allChildren[i]].destroy({ where: { case_detail_id: detail.id }, transaction: t });
        }

        var fk = { case_detail_id: detail.id };
        var childRows = buildChildRows(payload);
        for (var modelName in childRows) {
            var items = childRows[modelName];
            if (items.length) {
                await db[modelName].bulkCreate(
                    items.map(function (item) { return Object.assign({}, item, fk); }),
                    { transaction: t }
                );
            }
        }
        return detail;
    });
};

CaseService.prototype.getCase = async function (id) {
    var includes = db.CASE_CHILDREN.map(function (name) { return { model: db[name] }; });
    return db.CaseDetail.findById(id, { include: includes });
};

CaseService.prototype.getCaseByCino = async function (cino) {
    var includes = db.CASE_CHILDREN.map(function (name) { return { model: db[name] }; });
    return db.CaseDetail.findOne({ where: { cino: cino }, include: includes });
};

CaseService.prototype.deleteCase = async function (id) {
    return db.sequelize.transaction(async function (t) {
        for (var i = 0; i < db.CASE_CHILDREN.length; i++) {
            await db[db.CASE_CHILDREN[i]].destroy({ where: { case_detail_id: id }, transaction: t });
        }
        return db.CaseDetail.destroy({ where: { id: id }, transaction: t });
    });
};

module.exports = new CaseService();
