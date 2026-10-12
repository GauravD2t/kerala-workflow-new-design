/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var AlarmService = require('../service/AlarmService.js')

var textutil = require('../util/textutil');
var path = require('path')
var each = require('sync-each');
var json2csv = require('json2csv').Parser;
this.db = null
var moment = require('moment');
function AlarmController() {
}

AlarmController.prototype.emptypage = function (req, res) {
    res.render('emptypage', { title: 'emptypage' });
}

module.exports = new AlarmController();

