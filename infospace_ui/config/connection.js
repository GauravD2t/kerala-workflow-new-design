/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var Sequelize = require('sequelize');
var db = {};

var sequelize = new Sequelize('kerala_workflow', 'dspace', 'dspace', {
  host: "localhost",
  dialect: 'postgres',
  port: 5432,
  logging: true
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;


module.exports = db;
