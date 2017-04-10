'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
let Ticket = new Schema({
  title: String,
  status: Number,
  cost: Number,
  startDate: Number,
  endDate: Number,
  trainings: {
    remain: Number,
    used: [Number]
  }
});

module.exports = mongoose.model('Ticket', Ticket);