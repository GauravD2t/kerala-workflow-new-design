module.exports = function (sequelize, DataTypes) {
    var models = {};

    models.CaseDetail = sequelize.define('case_detail', {
        cino: { type: DataTypes.STRING, allowNull: false },
        efilno: { type: DataTypes.STRING, allowNull: false },
        dateOfEfiling: { type: DataTypes.DATEONLY },
        filNo: { type: DataTypes.INTEGER },
        filYear: { type: DataTypes.INTEGER },
        dateOfFiling: { type: DataTypes.DATEONLY },
        dateOfScrutiny: { type: DataTypes.DATEONLY },
        regNo: { type: DataTypes.INTEGER },
        regYear: { type: DataTypes.INTEGER },
        dtRegis: { type: DataTypes.DATEONLY },
        typeName: { type: DataTypes.STRING },
        caseType: { type: DataTypes.INTEGER },
        status: { type: DataTypes.ENUM('Draft', 'Pending', 'Disposed'), defaultValue: 'Draft' },
        dateFirstList: { type: DataTypes.DATEONLY },
        dateNextList: { type: DataTypes.DATEONLY },
        dateLastList: { type: DataTypes.DATEONLY },
        dateOfDecision: { type: DataTypes.DATEONLY },
        dateFilingDisp: { type: DataTypes.DATEONLY },
        dateFilingDispO: { type: DataTypes.DATEONLY },
        dispNature: { type: DataTypes.INTEGER, defaultValue: 0 },
        courtNo: { type: DataTypes.INTEGER },
        policeStCode: { type: DataTypes.INTEGER },
        subject: { type: DataTypes.INTEGER },
        caseNo: { type: DataTypes.STRING },
        mainCaseNo: { type: DataTypes.STRING },
        mainMatterCino: { type: DataTypes.STRING },
        fir: { type: DataTypes.INTEGER }
    }, { tableName: 'case_filing_details' });

    models.AdditionalSubject = sequelize.define('additional_subject', {
        subjectcode: { type: DataTypes.INTEGER }
    }, { tableName: 'additional_subjects' });

    models.MainParty = sequelize.define('main_party', {
        partytype: { type: DataTypes.INTEGER },
        name: { type: DataTypes.STRING },
        address: { type: DataTypes.TEXT },
        isPartyInPerson: { type: DataTypes.BOOLEAN, defaultValue: false },
        mobileNumber: { type: DataTypes.STRING },
        isHidden: { type: DataTypes.BOOLEAN, defaultValue: false },
        legalHeir: { type: DataTypes.STRING },
        advName: { type: DataTypes.STRING },
        advCode: { type: DataTypes.INTEGER },
        advReg: { type: DataTypes.STRING }
    }, { tableName: 'main_parties' });

    models.ExtraParty = sequelize.define('extra_party', {
        partyType: { type: DataTypes.INTEGER },
        partyNo: { type: DataTypes.INTEGER },
        partyId: { type: DataTypes.INTEGER },
        isPartyInPerson: { type: DataTypes.BOOLEAN, defaultValue: false },
        firstName: { type: DataTypes.STRING },
        lastName: { type: DataTypes.STRING },
        rank: { type: DataTypes.STRING },
        age: { type: DataTypes.INTEGER },
        dateOfBirth: { type: DataTypes.DATEONLY },
        gender: { type: DataTypes.STRING },
        email: { type: DataTypes.STRING },
        mobile: { type: DataTypes.STRING },
        fullAddress: { type: DataTypes.TEXT },
        pincode: { type: DataTypes.STRING },
        villageCode: { type: DataTypes.INTEGER },
        talukaCode: { type: DataTypes.INTEGER },
        districtCode: { type: DataTypes.INTEGER },
        stateId: { type: DataTypes.INTEGER },
        orgName: { type: DataTypes.STRING },
        orgType: { type: DataTypes.STRING },
        advName: { type: DataTypes.STRING },
        advCode: { type: DataTypes.INTEGER },
        advReg: { type: DataTypes.STRING },
        legalHeir: { type: DataTypes.STRING },
        isNameHidden: { type: DataTypes.BOOLEAN, defaultValue: false },
        status: { type: DataTypes.CHAR(1), defaultValue: 'Y' }
    }, { tableName: 'extra_parties' });

    models.AdditionalAdvocate = sequelize.define('additional_advocate', {
        partyNo: { type: DataTypes.INTEGER },
        partyId: { type: DataTypes.INTEGER },
        partyType: { type: DataTypes.INTEGER },
        advName: { type: DataTypes.STRING },
        advCode: { type: DataTypes.INTEGER },
        advReg: { type: DataTypes.STRING }
    }, { tableName: 'additional_advocates' });

    models.OtherParty = sequelize.define('other_party', {
        otherPartyId: { type: DataTypes.INTEGER },
        otherPartyNo: { type: DataTypes.INTEGER },
        orgId: { type: DataTypes.INTEGER },
        partyName: { type: DataTypes.STRING },
        address: { type: DataTypes.TEXT },
        age: { type: DataTypes.INTEGER },
        mobile: { type: DataTypes.STRING },
        email: { type: DataTypes.STRING },
        pincode: { type: DataTypes.INTEGER },
        stateId: { type: DataTypes.INTEGER },
        districtCode: { type: DataTypes.INTEGER },
        talukCode: { type: DataTypes.INTEGER },
        villageCode: { type: DataTypes.INTEGER },
        hideParty: { type: DataTypes.CHAR(1) },
        display: { type: DataTypes.STRING },
        advocates: { type: DataTypes.JSONB }
    }, { tableName: 'other_parties' });

    models.Witness = sequelize.define('witness', {
        partyNo: { type: DataTypes.INTEGER },
        witnessNo: { type: DataTypes.INTEGER },
        witnessFlag: { type: DataTypes.INTEGER },
        benchWitnessType: { type: DataTypes.STRING },
        benchWitnessNo: { type: DataTypes.INTEGER },
        witnessName: { type: DataTypes.STRING },
        address: { type: DataTypes.TEXT },
        stateCode: { type: DataTypes.INTEGER },
        districtCode: { type: DataTypes.INTEGER },
        talukCode: { type: DataTypes.INTEGER },
        villageCode: { type: DataTypes.INTEGER },
        age: { type: DataTypes.INTEGER },
        mobile: { type: DataTypes.STRING },
        email: { type: DataTypes.STRING },
        fatherName: { type: DataTypes.STRING },
        pincode: { type: DataTypes.INTEGER },
        hideParty: { type: DataTypes.CHAR(1) },
        advocates: { type: DataTypes.JSONB }
    }, { tableName: 'witnesses' });

    models.Victim = sequelize.define('victim', {
        partyNo: { type: DataTypes.INTEGER },
        victimName: { type: DataTypes.STRING },
        address: { type: DataTypes.TEXT },
        districtCode: { type: DataTypes.INTEGER },
        talukCode: { type: DataTypes.INTEGER },
        villageCode: { type: DataTypes.INTEGER },
        age: { type: DataTypes.INTEGER },
        mobile: { type: DataTypes.STRING },
        email: { type: DataTypes.STRING },
        pincode: { type: DataTypes.INTEGER },
        hideParty: { type: DataTypes.CHAR(1) },
        advocates: { type: DataTypes.JSONB }
    }, { tableName: 'victims' });

    models.Caveat = sequelize.define('caveat', {
        caveatNumber: { type: DataTypes.STRING },
        caveatfilNo: { type: DataTypes.STRING },
        subject: { type: DataTypes.INTEGER },
        dtRegis: { type: DataTypes.STRING },
        dtFiling: { type: DataTypes.STRING },
        caveatorName: { type: DataTypes.STRING },
        caveatorOrgName: { type: DataTypes.INTEGER },
        caveateeeName: { type: DataTypes.STRING },
        caveateeOrgName: { type: DataTypes.INTEGER }
    }, { tableName: 'caveats' });

    models.CaseAct = sequelize.define('case_act', {
        actcode: { type: DataTypes.INTEGER },
        section: { type: DataTypes.STRING }
    }, { tableName: 'case_acts' });

    models.FactDetail = sequelize.define('fact_detail', {
        factOfCause: { type: DataTypes.TEXT },
        dateTimeOfFact: { type: DataTypes.DATE },
        issueReportedAt: { type: DataTypes.STRING }
    }, { tableName: 'fact_details' });

    models.CauseOfAction = sequelize.define('cause_of_action', {
        dateOfCause: { type: DataTypes.DATEONLY },
        state: { type: DataTypes.INTEGER },
        district: { type: DataTypes.INTEGER },
        taluka: { type: DataTypes.INTEGER },
        village: { type: DataTypes.INTEGER },
        policeStationCode: { type: DataTypes.INTEGER }
    }, { tableName: 'cause_of_actions' });

    models.IaFiling = sequelize.define('ia_filing', {
        iaType: { type: DataTypes.INTEGER },
        iaNumber: { type: DataTypes.STRING },
        iaYear: { type: DataTypes.INTEGER },
        iaNature: { type: DataTypes.INTEGER },
        filingDate: { type: DataTypes.DATEONLY },
        applicantName: { type: DataTypes.STRING },
        applicantAdvocate: { type: DataTypes.INTEGER },
        respondentName: { type: DataTypes.STRING },
        respondentAdvocate: { type: DataTypes.INTEGER },
        documentPath: { type: DataTypes.STRING },
        status: { type: DataTypes.STRING },
        dateOfDecision: { type: DataTypes.DATEONLY },
        nextdate: { type: DataTypes.DATEONLY }
    }, { tableName: 'ia_filings' });

    models.CaseHistory = sequelize.define('case_history', {
        courtNo: { type: DataTypes.INTEGER },
        judgeCode: { type: DataTypes.INTEGER },
        jocode: { type: DataTypes.STRING },
        desgCode: { type: DataTypes.INTEGER },
        hearingDate: { type: DataTypes.DATEONLY },
        nextdate: { type: DataTypes.DATEONLY },
        purposeCode: { type: DataTypes.INTEGER },
        businessOnDate: { type: DataTypes.DATEONLY },
        remarks: { type: DataTypes.TEXT },
        disposal: { type: DataTypes.CHAR(1), defaultValue: 'N' },
        decisionDate: { type: DataTypes.DATEONLY },
        contestedUnContested: { type: DataTypes.STRING },
        disposalNature: { type: DataTypes.INTEGER },
        dormantSineDie: { type: DataTypes.ENUM('dormant', 'SineDie') },
        admissionStageDisposed: { type: DataTypes.STRING },
        witnessCount: { type: DataTypes.INTEGER },
        postDisposalProceedings: { type: DataTypes.JSONB }
    }, { tableName: 'case_histories' });

    models.IaHistory = sequelize.define('ia_history', {
        courtNo: { type: DataTypes.INTEGER },
        judgeCode: { type: DataTypes.INTEGER },
        jocode: { type: DataTypes.STRING },
        desgCode: { type: DataTypes.INTEGER },
        iaNumber: { type: DataTypes.STRING },
        hearingDate: { type: DataTypes.DATEONLY },
        nextdate: { type: DataTypes.DATEONLY },
        purposeCode: { type: DataTypes.INTEGER },
        businessOnDate: { type: DataTypes.DATEONLY },
        remarks: { type: DataTypes.TEXT },
        disposal: { type: DataTypes.CHAR(1), defaultValue: 'N' },
        decisionDate: { type: DataTypes.DATEONLY },
        contestedUnContested: { type: DataTypes.STRING },
        disposalNature: { type: DataTypes.INTEGER },
        dormantSineDie: { type: DataTypes.ENUM('dormant', 'SineDie') }
    }, { tableName: 'ia_histories' });

    models.ProceedingsPresence = sequelize.define('proceedings_presence', {
        complainantName: { type: DataTypes.STRING },
        complainantAdvocate: { type: DataTypes.STRING },
        accusedName: { type: DataTypes.STRING },
        accusedAdvocate: { type: DataTypes.STRING },
        complainantOtherPresentee: { type: DataTypes.STRING },
        accusedOtherPresentee: { type: DataTypes.STRING }
    }, { tableName: 'proceedings_presences' });

    models.TrialCourtDetail = sequelize.define('trial_court_detail', {
        caseType: { type: DataTypes.STRING },
        caseTypeNo: { type: DataTypes.INTEGER },
        caseNumber: { type: DataTypes.STRING },
        caseYear: { type: DataTypes.INTEGER },
        lcourtName: { type: DataTypes.STRING },
        courtCode: { type: DataTypes.STRING },
        lcnrNumber: { type: DataTypes.STRING },
        dateOfDecision: { type: DataTypes.DATEONLY },
        certifiedCopyAppliedDate: { type: DataTypes.DATEONLY },
        certifiedCopyReadyDate: { type: DataTypes.DATEONLY },
        certifiedCopyReceivedDate: { type: DataTypes.DATEONLY }
    }, { tableName: 'trial_court_details' });

    models.CrimeDetail = sequelize.define('crime_detail', {
        crno: { type: DataTypes.STRING },
        firNo: { type: DataTypes.STRING },
        firTypeCode: { type: DataTypes.INTEGER },
        firYear: { type: DataTypes.INTEGER },
        firDate: { type: DataTypes.DATEONLY },
        policeStName: { type: DataTypes.STRING },
        policeStCode: { type: DataTypes.STRING },
        state: { type: DataTypes.STRING },
        district: { type: DataTypes.STRING },
        taluka: { type: DataTypes.STRING },
        investofficer: { type: DataTypes.STRING },
        rank: { type: DataTypes.STRING },
        occurrenceDatetime: { type: DataTypes.DATE },
        placeOfOccurrence: { type: DataTypes.STRING },
        detailsOfIncident: { type: DataTypes.TEXT },
        dateOfFilingChargesheet: { type: DataTypes.DATEONLY },
        chargesheetReceivedDate: { type: DataTypes.DATEONLY },
        subsequentDocType: { type: DataTypes.STRING },
        subsequentDocReceivedDate: { type: DataTypes.DATEONLY }
    }, { tableName: 'crime_details' });

    models.TransferDetail = sequelize.define('transfer_detail', {
        mainCaseType: { type: DataTypes.STRING },
        mainCaseNumber: { type: DataTypes.STRING },
        mainCaseYear: { type: DataTypes.INTEGER },
        transfereeCourtName: { type: DataTypes.STRING },
        transfereeCourtCode: { type: DataTypes.INTEGER },
        transfereeCourtCnr: { type: DataTypes.STRING },
        transfereeLastPosting: { type: DataTypes.STRING },
        transferorCourtName: { type: DataTypes.STRING },
        transferorCourtCode: { type: DataTypes.INTEGER },
        transferorCourtCnr: { type: DataTypes.STRING },
        transferorLastPosting: { type: DataTypes.STRING }
    }, { tableName: 'transfer_details' });

    models.OrderDetail = sequelize.define('order_detail', {
        documentType: { type: DataTypes.INTEGER },
        orderDate: { type: DataTypes.DATEONLY },
        documentPath: { type: DataTypes.STRING },
        judgeCode: { type: DataTypes.INTEGER },
        jocode: { type: DataTypes.STRING },
        iaNumber: { type: DataTypes.STRING },
        iaType: { type: DataTypes.INTEGER }
    }, { tableName: 'order_details' });

    models.CaseDocument = sequelize.define('case_document', {
        partyNo: { type: DataTypes.INTEGER, defaultValue: 0 },
        partyType: { type: DataTypes.STRING },
        documentType: { type: DataTypes.INTEGER },
        documentName: { type: DataTypes.STRING },
        documentTitle: { type: DataTypes.STRING },
        description: { type: DataTypes.TEXT },
        remarks: { type: DataTypes.TEXT },
        documentPath: { type: DataTypes.STRING },
        advReg: { type: DataTypes.STRING },
        advCode: { type: DataTypes.INTEGER },
        filedDate: { type: DataTypes.DATEONLY },
        documentOrder: { type: DataTypes.INTEGER },
        fileSize: { type: DataTypes.INTEGER },
        fileExtension: { type: DataTypes.STRING }
    }, { tableName: 'case_documents' });

    return models;
};
