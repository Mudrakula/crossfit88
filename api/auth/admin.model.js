'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
let Admin = new Schema({
  username: {type: String, index:true, unique: true, dropDups: true},
  password: String
});

module.exports = mongoose.model('Admin', Admin);