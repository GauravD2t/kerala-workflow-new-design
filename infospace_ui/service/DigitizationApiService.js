var axios = require('axios');
var crypto = require('crypto');
var env = process.env.NODE_ENV || 'development';
var config = require('../config/config.js')[env];

function decryptDigitizationPayload(payload, secretKey) {
    var parts = payload.split(':');
    if (parts.length !== 2) throw new Error('Invalid encrypted payload format');
    var iv = Buffer.from(parts[0], 'hex');
    var ciphertext = Buffer.from(parts[1], 'hex');
    var key = crypto.createHash('sha256').update(secretKey).digest();
    var decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    var decrypted = decipher.update(ciphertext, null, 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
}

var MASTER_RESOURCES = [
    'state', 'district', 'taluka', 'village', 'casetype', 'ia_casetype', 'purpose',
    'act', 'ia_nature', 'docutype', 'police_stn', 'firtype', 'subject', 
    'organization', 'disposal_nature', 'courtcases', 'advocate'
];

var tokenCache = { token: null, fetchedAt: 0 };

function DigitizationApiService() {
}

async function getToken(forceRefresh) {
    var now = Date.now();
    var ttl = config.digitizationApi.tokenTtlMs || 150000;
    if (!forceRefresh && tokenCache.token && (now - tokenCache.fetchedAt) < ttl) {
        return tokenCache.token;
    }
    var res = await axios.post(config.digitizationApi.baseUrl + 'api/tokenRequest', {
        username: config.digitizationApi.username,
        password: config.digitizationApi.password
    }, { timeout: 30000 });
    tokenCache = { token: res.data.token, fetchedAt: Date.now() };
    return tokenCache.token;
}

function isJwtExpiredResponse(res) {
    return res && res.data && typeof res.data.error === 'string' &&
        res.data.error.toLowerCase().indexOf('jwt expired') !== -1;
}

async function postWithToken(path, body, forceTokenRefresh, timeoutMs) {
    var timeout = timeoutMs || 60000;
    var token = await getToken(forceTokenRefresh);
    try {
        var res = await axios.post(config.digitizationApi.baseUrl + path, body, {
            headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
            timeout: timeout
        });
        if (isJwtExpiredResponse(res)) {
            token = await getToken(true);
            res = await axios.post(config.digitizationApi.baseUrl + path, body, {
                headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
                timeout: timeout
            });
            if (isJwtExpiredResponse(res)) {
                throw new Error('JWT expired even after forced token refresh');
            }
        }
        return res;
    } catch (err) {
        if (err.response && err.response.status === 401) {
            token = await getToken(true);
            return await axios.post(config.digitizationApi.baseUrl + path, body, {
                headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
                timeout: timeout
            });
        }
        throw err;
    }
}

DigitizationApiService.prototype.getToken = getToken;
DigitizationApiService.prototype.MASTER_RESOURCES = MASTER_RESOURCES;

function defaultCourtCode() {
    var list = (config.digitizationApi && config.digitizationApi.establishments) || [];
    return (list[0] && list[0].courtCode) || '';
}

DigitizationApiService.prototype.fetchMaster = async function (master, courtCode, params) {
    var body = Object.assign({ courtCode: courtCode || defaultCourtCode() }, params || {});
    var res = await postWithToken('api/digitization/master/' + master, body);
    return res.data;
};

DigitizationApiService.prototype.fetchCaseByCino = async function (cino, courtCode) {
    var body = { cino: cino, courtCode:  String(cino).trim().slice(0, 6).toUpperCase() || courtCode };
    var res = await postWithToken('api/digitization', body, true);
    var responseBody = res.data;
    if (responseBody && responseBody.success && typeof responseBody.data === 'string') {
        if (config.digitizationApi.encryptionKey) {
            try {
                responseBody.data = decryptDigitizationPayload(responseBody.data, config.digitizationApi.encryptionKey);
                responseBody.encrypted = false;
            } catch (decryptErr) {
                console.error('Case decryption failed (check digitizationApi.encryptionKey):', decryptErr.message);
                responseBody.encrypted = true;
                responseBody.decrypt_error = decryptErr.message;
            }
        } else {
            responseBody.encrypted = true;
        }
    }
    return responseBody;
};

DigitizationApiService.prototype.decryptPayload = decryptDigitizationPayload;

DigitizationApiService.prototype.syncAllMasters = async function (db, courtCode) {
    await getToken(true);
    var results = [];
    var syncCode = courtCode || defaultCourtCode();
    for (var i = 0; i < MASTER_RESOURCES.length; i++) {
        var name = MASTER_RESOURCES[i];
        var timeout = name === 'courtcases' ? 3600000 : 180000;
        try {
            var res = await postWithToken('api/digitization/master/' + name, {
                courtCode: syncCode
            }, false, timeout);
            var data = (res.data && res.data.success && Array.isArray(res.data.data)) ? res.data.data : [];
            var existing = await db.MasterCache.findOne({ where: { master_name: name, courtcode: syncCode } });
            if (existing) {
                await existing.update({ data: data, synced_at: new Date() });
            } else {
                await db.MasterCache.create({ master_name: name, courtcode: syncCode, data: data, synced_at: new Date() });
            }
            results.push({ master: name + ':' + syncCode, success: true, count: data.length });
        } catch (err) {
            console.error('Master sync failed (' + name + ':' + syncCode + '):', err.message);
            results.push({ master: name + ':' + syncCode, success: false, error: err.message });
        }
    }
    return results;
};


DigitizationApiService.prototype.pushDigitizedEntry = async function (caseData, isUpdate) {
    var cinoCode = caseData && caseData.caseDetails && caseData.caseDetails.cino
        ? String(caseData.caseDetails.cino).trim().slice(0, 6).toUpperCase()
        : '';
    var payload = Object.assign({ courtCode: cinoCode || defaultCourtCode() }, caseData);
    var res = await requestWithToken(isUpdate ? 'put' : 'post', 'api/digitization/digitizedEntry', payload);
    return res.data;
};

async function requestWithToken(method, path, body, forceTokenRefresh, timeoutMs) {
    var timeout = timeoutMs || 60000;
    var token = await getToken(forceTokenRefresh);
    var opts = {
        method: method,
        url: config.digitizationApi.baseUrl + path,
        data: body,
        headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
        timeout: timeout
    };
    try {
        var res = await axios(opts);
        if (isJwtExpiredResponse(res)) {
            token = await getToken(true);
            opts.headers.Authorization = 'Bearer ' + token;
            res = await axios(opts);
            if (isJwtExpiredResponse(res)) {
                throw new Error('JWT expired even after forced token refresh');
            }
        }
        return res;
    } catch (err) {
        if (err.response && err.response.status === 401) {
            token = await getToken(true);
            opts.headers.Authorization = 'Bearer ' + token;
            return await axios(opts);
        }
        throw err;
    }
}

module.exports = new DigitizationApiService();
