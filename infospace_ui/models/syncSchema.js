var db = require('./index');

db.sequelize.sync()
    .then(function () {
        console.log('Case + master tables created successfully.');
        process.exit(0);
    })
    .catch(function (err) {
        console.error('Schema sync failed:', err);
        process.exit(1);
    });
