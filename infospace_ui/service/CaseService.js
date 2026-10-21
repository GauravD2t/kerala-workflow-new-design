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
                id: a.id,
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

function stripChildMeta(item) {
    var data = Object.assign({}, item);
    delete data.id;
    delete data.case_detail_id;
    delete data.createdAt;
    delete data.updatedAt;
    return data;
}

var CHILD_MATCH_KEYS = {
    MainParty: 'partytype',
    AdditionalSubject: 'subjectcode',
    Caveat: 'single',
    OtherParty: 'single',
    FactDetail: 'single',
    CauseOfAction: 'single',
    ProceedingsPresence: 'single',
    TrialCourtDetail: 'single',
    CrimeDetail: 'single',
    TransferDetail: 'single'
};

async function syncChildRows(modelName, items, caseId, t, matchKey) {
    var Model = db[modelName];
    var existing = await Model.findAll({ where: { case_detail_id: caseId }, transaction: t });
    var byId = {}, byKey = {};
    existing.forEach(function (r) {
        byId[r.id] = r;
        if (matchKey && matchKey !== 'single') {
            var v = r.get(matchKey);
            if (v !== null && v !== undefined && !byKey['k_' + v]) byKey['k_' + v] = r;
        }
    });
    var seen = {};
    for (var i = 0; i < items.length; i++) {
        var item = items[i] || {};
        var rid = (item.id !== null && item.id !== undefined && item.id !== '') ? parseInt(item.id, 10) : null;
        var data = stripChildMeta(item);
        data.case_detail_id = caseId;
        var target = null;
        if (rid && byId[rid]) {
            target = byId[rid];
        } else if (matchKey && matchKey !== 'single' && item[matchKey] !== null && item[matchKey] !== undefined) {
            target = byKey['k_' + item[matchKey]] || null;
        } else if (matchKey === 'single' && existing.length && !seen[existing[0].id]) {
            target = existing[0];
        }
        if (target && !seen[target.id]) {
            await target.update(data, { transaction: t });
            seen[target.id] = true;
        } else {
            var created = await Model.create(data, { transaction: t });
            seen[created.id] = true;
        }
    }
    for (var j = 0; j < existing.length; j++) {
        if (!seen[existing[j].id]) await existing[j].destroy({ transaction: t });
    }
}

CaseService.prototype.updateCase = async function (id, payload) {
    return db.sequelize.transaction(async function (t) {
        var detail = await db.CaseDetail.findById(id, { transaction: t });
        if (!detail) return null;

        await detail.update(payload.caseDetails, { transaction: t });

        var childRows = buildChildRows(payload);
        for (var modelName in childRows) {
            await syncChildRows(modelName, childRows[modelName], detail.id, t, CHILD_MATCH_KEYS[modelName]);
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
    return db.CaseDetail.findOne({ where: { cino: cino }, include: includes, order: [['id', 'DESC']] });
};

CaseService.prototype.getCaseByFir = async function (firId) {
    var includes = db.CASE_CHILDREN.map(function (name) { return { model: db[name] }; });
    return db.CaseDetail.findOne({ where: { fir: firId }, include: includes, order: [['id', 'DESC']] });
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
