'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
let User = new Schema({
  firstname: String,
  lastname: String,
  phone: String,
  birthDate: Number,
  trainer: {type: Schema.Types.ObjectId, ref: 'Trainer'},
  ticket: {type: Schema.Types.ObjectId, ref: 'Ticket'},
  trainings: {
    startDate: Number,
    endDate: Number,
    ramain: Number,
    used: [Number]
  }
});

module.exports = mongoose.model('User', User);