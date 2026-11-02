module.exports = {
    development: {
        host: "localhost",
        port: "1337",
        digitizationApi: {
            baseUrl: "https://staging-dcms.keralacourts.in/",
            username: "digitizationIM",
            password: "f2qX36k6ME3D",
            courtCode: "KLER04",
            tokenTtlMs: 150000,
            encryptionKey: "U2FsdGVkX1+Fz3Z5Y2V0b3JQZXRlcjE="
        }
    }

};
//https://filing.keralacourts.in/    Q2hhdEdQVF9BRVNfMjU2X1NlY3VyZV9LZXlfMTIzNA==
//https://staging-dcms.keralacourts.in/ U2FsdGVkX1+Fz3Z5Y2V0b3JQZXRlcjE= 