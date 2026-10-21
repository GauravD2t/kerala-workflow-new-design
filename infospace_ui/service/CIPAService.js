var connection = null;

function CIPAService() {
    connection = require('../config/connection');

}

CIPAService.prototype.executeSQL = function (SQL, callback) {

    connection.sequelize.query(SQL).then(function (data) {
        if (!data) {
            callback(null)
        } else {
            callback(data);
        }
    })

}
CIPAService.prototype.asyncexecuteSQL = async function (SQL) {

    return await connection.sequelize.query(SQL);

}
CIPAService.prototype.executeSQLOnlyData = function (SQL, callback) {

    connection.sequelize.query(SQL, { type: connection.sequelize.QueryTypes.SELECT }).then(function (data) {
        if (!data) {
            callback(null)
        } else {
            callback(data);
        }
    })

}
CIPAService.prototype.executeSQLOnlyDatawithwait = async function (SQL, callback) {
    return await connection.sequelize.query(SQL, { type: connection.sequelize.QueryTypes.SELECT });


}
CIPAService.prototype.UpdateexecuteSQL = function (SQL, callback) {

    connection.sequelize.query(SQL, {
        type: connection.sequelize.QueryTypes.UPDATE
    }).then(function (data) {
        if (!data) {
            callback(null)
        } else {
            callback(data);
        }
    })

}
CIPAService.prototype.asyncUpdateexecute = async function (SQL, callback) {
    try {
        return await connection.sequelize.query(SQL, {
            type: connection.sequelize.QueryTypes.UPDATE
        });
    } catch (err) {
        console.log(err)
        return null;
    }

}
CIPAService.prototype.DeleteeexecuteSQL = function (SQL, callback) {

    connection.sequelize.query(SQL, {
        type: connection.sequelize.QueryTypes.DELETE
    }).then(function (data) {
        if (!data) {
            callback(null)
        } else {
            callback(data);
        }
    })

}
CIPAService.prototype.InsertexecuteSQL = function (SQL, callback) {

    connection.sequelize.query(SQL, {
        type: connection.sequelize.QueryTypes.INSERT
    }).then(function (data) {
        if (!data) {
            callback(null)
        } else {
            callback(data);
        }
    })

}




module.exports = new CIPAService();