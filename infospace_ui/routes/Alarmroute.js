function Alarmroute(app, db) {
    var AlarmController = require('../controllers/AlarmController');


    app.route("/emptypage.dwf").get(AlarmController.emptypage);

}
module.exports = Alarmroute