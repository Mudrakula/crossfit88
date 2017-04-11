'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
let Ticket = new Schema({
  title: String,
  status: Number,
  cost: Number,
  daysCount: Number,
  startDate: Number,
  endDate: Number,
  trainings: {
    total: Number,
    remain: Number,
    used: [Number]
  }
});

module.exports = mongoose.model('Ticket', Ticket);