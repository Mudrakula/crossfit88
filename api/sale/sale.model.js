'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
let Sale = new Schema({
  type: {type: String, enum: ['product', 'ticket']},
  title: String,
  cost: Number,
  count: {type: Number, default: 1},
  purchaseCost: Number,
  date: Number
});

module.exports = mongoose.model('Sale', Sale);