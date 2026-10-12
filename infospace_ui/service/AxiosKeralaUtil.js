

const axios = require('axios');
const qs = require('querystring');
const url = require('url');
var LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');
const fs = require('fs');
const FormData = require('form-data');
const crypto = require('crypto');
const querystring = require('querystring');
const credentials = {
    grant_type: 'client_credentials',
    scope: 'napix',
    authorization: Buffer.from('0d6a0dda227a50a8d20b1e9514742850:f9e4e7a27edf20758090917e7500e83e').toString('base64'),  // Replace with actual client_id and client_secret
    url: 'https://delhigw.napix.gov.in/nic/ecourts//oauth2/token'
};
class AxiosUtilKerala {
    constructor() {

    }

    async getToken() {
        const grant_type = credentials.grant_type;
        const scope = credentials.scope;
        const authorization = credentials.authorization;
        const url = credentials.url;

        // Prepare the post data
        const postFields = qs.stringify({
            grant_type: grant_type,
            scope: scope
        });

        try {
            const response = await axios.post(url, postFields, {
                headers: {
                    'Authorization': `Basic ${authorization}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                maxRedirects: 10,
                timeout: 100000, // No timeout set, you can change it as needed
                httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }) // Equivalent to SSL_VERIFYPEER and SSL_VERIFYHOST disabled
            });
            localStorage.setItem("access_token", 'Bearer ' + response.data.access_token)
            return response.data;

        } catch (error) {
            console.error('Error fetching token:', error.response ? error.response.data : error.message);
            throw error;
        }
    }
    encrypt(inputStr) {
        const authentication_key = "rlQP1e2GpD1ubU7T";  // Replace with actual authentication key
        const iv = "rlQP1e2GpD1ubU7T";  // Replace with actual IV (initialization vector)

        const cipher = crypto.createCipheriv('aes-128-cbc', Buffer.from(authentication_key, 'utf-8'), Buffer.from(iv, 'utf-8'));
        let encrypted = cipher.update(inputStr, 'utf8', 'base64');
        encrypted += cipher.final('base64');

        return encrypted;
    }

    decrypt(data) {
        const authentication_key = "rlQP1e2GpD1ubU7T";  // Replace with actual authentication key
        const iv = "rlQP1e2GpD1ubU7T";  // Replace with actual IV (initialization vector)


        // Base64 decode the input data
        const payload = Buffer.from(data, 'base64');

        // Create a decipher using AES-128-CBC algorithm, authentication key, and IV
        const decipher = crypto.createDecipheriv('aes-128-cbc', Buffer.from(authentication_key), Buffer.from(iv));

        // Decrypt the payload
        let decrypted = decipher.update(payload, 'base64', 'utf8');
        decrypted += decipher.final('utf8'); // Append the final part of decryption
        //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", decrypted)
        return decrypted;
    }

}


module.exports = AxiosUtilKerala;
