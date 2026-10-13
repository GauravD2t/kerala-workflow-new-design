var db = require('../config/connection');
var sequelize = db.sequelize;
var DataTypes = db.Sequelize;

var caseModels = require('./caseModels')(sequelize, DataTypes);
var masterModels = require('./masterModels')(sequelize, DataTypes);

Object.keys(caseModels).forEach(function (name) { db[name] = caseModels[name]; });
Object.keys(masterModels).forEach(function (name) { db[name] = masterModels[name]; });

var CHILDREN = [
    'AdditionalSubject', 'MainParty', 'ExtraParty', 'AdditionalAdvocate',
    'OtherParty', 'Witness', 'Victim', 'Caveat', 'CaseAct', 'FactDetail',
    'CauseOfAction', 'IaFiling', 'CaseHistory', 'IaHistory',
    'ProceedingsPresence', 'TrialCourtDetail', 'CrimeDetail',
    'TransferDetail', 'OrderDetail', 'CaseDocument'
];

CHILDREN.forEach(function (name) {
    db.CaseDetail.hasMany(db[name], { foreignKey: 'case_detail_id' });
    db[name].belongsTo(db.CaseDetail, { foreignKey: 'case_detail_id' });
});

db.CASE_CHILDREN = CHILDREN;
db.MASTER_MODELS = Object.keys(masterModels);

module.exports = db;
