var db = require('./index');
var DigitizationApiService = require('../service/DigitizationApiService');

DigitizationApiService.syncAllMasters(db)
    .then(function (results) {
        results.forEach(function (r) {
            console.log(r.master + ': ' + (r.success ? r.count + ' row(s)' : 'FAILED - ' + r.error));
        });
        console.log('Master sync complete.');
        process.exit(0);
    })
    .catch(function (err) {
        console.error('Master sync failed:', err);
        process.exit(1);
    });
