'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
let Admin = new Schema({
  username: {type: String, index:true, unique: true, dropDups: true},
  role: {type: String, enum: ['admin', 'employee'], default: 'employee'},
  password: String
});

module.exports = mongoose.model('Admin', Admin);