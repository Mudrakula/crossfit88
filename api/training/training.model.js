'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
let Training = new Schema({
  client: {type: Schema.Types.ObjectId, ref: 'User'},
  trainer: {type: Schema.Types.ObjectId, ref: 'Trainer'},
  date: Number
});

module.exports = mongoose.model('Training', Training);