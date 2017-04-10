'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
let Trainer = new Schema({
  firstname: String,
  lastname: String,
  phone: String,
  birthDate: Number,
});

module.exports = mongoose.model('Trainer', Trainer);