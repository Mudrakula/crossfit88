'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
let Admin = new Schema({
  username: String,
  password: String
});

module.exports = mongoose.model('Admin', Admin);