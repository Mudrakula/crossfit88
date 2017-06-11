'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
let Sale = new Schema({
  type: {type: String, enum: ['product', 'ticket']},
  title: String,
  cost: Number,
  count: {type: Number, default: 1},
  purchaseCost: {type: Number, default: 0},
  date: Number
});

module.exports = mongoose.model('Sale', Sale);