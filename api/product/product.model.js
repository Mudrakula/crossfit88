'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
let Product = new Schema({
  title: String,
  cost: Number,
  purchaseCost: Number,
  count: {type: Number, default: 0}
});

module.exports = mongoose.model('Product', Product);