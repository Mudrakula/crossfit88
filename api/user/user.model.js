'use strict';

var mongoose = require('mongoose');
let User = new mongoose.Schema({
  firstname: String,
  lastname: String,
});

module.exports = mongoose.model('User', User);