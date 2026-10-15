module.exports = function (sequelize, DataTypes) {
    var models = {};

    models.MasterCache = sequelize.define('master_cache', {
        master_name: { type: DataTypes.STRING, allowNull: false, unique: true },
        data: { type: DataTypes.JSONB },
        synced_at: { type: DataTypes.DATE }
    }, { tableName: 'master_cache' });

    return models;
};
