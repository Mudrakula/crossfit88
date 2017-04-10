'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
let User = new Schema({
  firstname: String,
  lastname: String,
  phone: String,
  birthDate: Number,
  trainer: {type: Schema.Types.ObjectId, ref: 'Trainer'},
  ticket: {
    title: String,
    status: Number,
    cost: Number,
    startDate: Number,
    endDate: Number,
    trainings: {
      remain: Number,
      used: [Number]
    }
  }
});

module.exports = mongoose.model('User', User);