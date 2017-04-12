'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
let Ticket = new Schema({
  title: String,
  cost: Number,
  daysCount: Number,
  trainingsCount: Number
});

module.exports = mongoose.model('Ticket', Ticket);