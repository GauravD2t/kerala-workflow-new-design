module.exports = {
    development: {
        host: "localhost",
        port: "1337",
        digitizationApi: {
            baseUrl: "https://filing.keralacourts.in/",
            username: "digitizationIM",
            password: "f2qX36k6ME3D",
            tokenTtlMs: 150000,
            encryptionKey: "Q2hhdEdQVF9BRVNfMjU2X1NlY3VyZV9LZXlfMTIzNA==",
            establishments: [
                { courtCode: "KLAL18", courtName: "Judl.First Class Magistrate Court-I, Mavelikara" },
                { courtCode: "KLAL19", courtName: "Judl.First Class Magistrate Court-II, Mavelikara" },
                { courtCode: "KLAL20", courtName: "Judl.First Class Magistrate Court-III, Mavelikara" },
                { courtCode: "KLAL15", courtName: "Addl MACT, Mavelikkara" },
                { courtCode: "KLAL14", courtName: "Addl.District And Sessions Court-I / Rent Control Appellate Authority, Mavelikkara" },
                { courtCode: "KLAL17", courtName: "Munsiff Court, Mavelikkara" },
                { courtCode: "KLAL16", courtName: "Sub Court, Mavelikkara" },
               
            ]
        }
    }

};
//https://filing.keralacourts.in/    Q2hhdEdQVF9BRVNfMjU2X1NlY3VyZV9LZXlfMTIzNA==
//https://staging-dcms.keralacourts.in/ U2FsdGVkX1+Fz3Z5Y2V0b3JQZXRlcjE= 