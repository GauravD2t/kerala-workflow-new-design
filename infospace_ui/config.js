module.exports = {
    development: {
        username: "root",
        password: "patson123",
        database: "patson",
        host: "localhost",
        dialect: 'mysql',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        dialectOptions: {
            useUTC: false, // for reading from database
        },
        timezone: 'Asia/Kolkata',
        email:{
            email:"support@patsonenterprise.com",
            password:"support@patson"
        },
        key:'patson@akz@!1970',
    },
    production: {
        username: "root",
        password: "STOres1970",
        database: "ecgrdp",
        host: "localhost",
        dialect: 'mysql',
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        dialectOptions: {
            useUTC: false, // for reading from database
        },
        timezone: 'Asia/Kolkata',
    }

};
