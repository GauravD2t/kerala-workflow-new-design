module.exports = function (sequelize, DataTypes) {
    var models = {};

    models.State = sequelize.define('state_master', {
        state_id: { type: DataTypes.INTEGER },
        state: { type: DataTypes.STRING }
    }, { tableName: 'master_states', timestamps: false });

    models.District = sequelize.define('district_master', {
        dist_code: { type: DataTypes.INTEGER },
        dist_name: { type: DataTypes.STRING }
    }, { tableName: 'master_districts', timestamps: false });

    models.Taluka = sequelize.define('taluka_master', {
        dist_code: { type: DataTypes.INTEGER },
        taluka_code: { type: DataTypes.INTEGER },
        taluka_name: { type: DataTypes.STRING }
    }, { tableName: 'master_talukas', timestamps: false });

    models.Village = sequelize.define('village_master', {
        dist_code: { type: DataTypes.INTEGER },
        taluka_code: { type: DataTypes.INTEGER },
        village_code: { type: DataTypes.INTEGER },
        village_name: { type: DataTypes.STRING }
    }, { tableName: 'master_villages', timestamps: false });

    models.CaseType = sequelize.define('case_type_master', {
        case_type: { type: DataTypes.INTEGER },
        type_name: { type: DataTypes.STRING },
        full_form: { type: DataTypes.STRING }
    }, { tableName: 'master_case_types', timestamps: false });

    models.IaCaseType = sequelize.define('ia_case_type_master', {
        ia_case_type: { type: DataTypes.INTEGER },
        ia_type_name: { type: DataTypes.STRING },
        ia_full_form: { type: DataTypes.STRING }
    }, { tableName: 'master_ia_case_types', timestamps: false });

    models.Purpose = sequelize.define('purpose_master', {
        purpose_code: { type: DataTypes.INTEGER },
        purpose_name: { type: DataTypes.STRING }
    }, { tableName: 'master_purposes', timestamps: false });

    models.ActMaster = sequelize.define('act_master', {
        actcode: { type: DataTypes.STRING },
        actname: { type: DataTypes.STRING }
    }, { tableName: 'master_acts', timestamps: false });

    models.IaNature = sequelize.define('ia_nature_master', {
        iacls_code: { type: DataTypes.INTEGER },
        iacls_name: { type: DataTypes.STRING }
    }, { tableName: 'master_ia_natures', timestamps: false });

    models.DocumentType = sequelize.define('document_type_master', {
        docu_type: { type: DataTypes.INTEGER },
        docu_name: { type: DataTypes.STRING }
    }, { tableName: 'master_document_types', timestamps: false });

    models.PoliceStationMaster = sequelize.define('police_station_master', {
        police_st_code: { type: DataTypes.INTEGER },
        police_st_name: { type: DataTypes.STRING }
    }, { tableName: 'master_police_stations', timestamps: false });

    models.FirType = sequelize.define('fir_type_master', {
        fir_type_code: { type: DataTypes.INTEGER },
        fir_type_name: { type: DataTypes.STRING }
    }, { tableName: 'master_fir_types', timestamps: false });

    models.Subject = sequelize.define('subject_master', {
        subject_code: { type: DataTypes.INTEGER },
        subject_name: { type: DataTypes.STRING }
    }, { tableName: 'master_subjects', timestamps: false });

    models.Advocate = sequelize.define('advocate_master', {
        adv_code: { type: DataTypes.STRING },
        adv_name: { type: DataTypes.STRING },
        adv_reg: { type: DataTypes.STRING }
    }, { tableName: 'master_advocates', timestamps: false });

    models.Organization = sequelize.define('organization_master', {
        orgid: { type: DataTypes.INTEGER },
        orgname: { type: DataTypes.STRING }
    }, { tableName: 'master_organizations', timestamps: false });

    models.CourtMaster = sequelize.define('court_master', {
        court_no: { type: DataTypes.INTEGER },
        judge_code: { type: DataTypes.INTEGER },
        from_dt: { type: DataTypes.DATE },
        to_dt: { type: DataTypes.DATE },
        jocode: { type: DataTypes.STRING },
        desg_code: { type: DataTypes.INTEGER },
        judge_name: { type: DataTypes.STRING }
    }, { tableName: 'master_court_details', timestamps: false });

    models.DisposalNature = sequelize.define('disposal_nature_master', {
        disp_type: { type: DataTypes.INTEGER },
        disp_name: { type: DataTypes.STRING }
    }, { tableName: 'master_disposal_natures', timestamps: false });

    return models;
};
