'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Ticket = require('./ticket.model');

router.get('/', (req, res) => {
  Ticket.find()
    .sort('cost')
    .exec((err, data) => {
      res.status(200).json(data);
    });
});

router.post('/', (req, res) => {
  req.body._id = req.body._id || new mongoose.mongo.ObjectID();
  Ticket.findOneAndUpdate({_id: req.body._id}, req.body, {new: true, upsert: true}, (err, data) => {
    if (err)
      return console.log(err);

    res.status(200).json(data);
  });
});

router.delete('/:id', (req, res) => {
  Ticket.remove({_id: req.params.id}, err => {
    if (err)
      return console.log(err);

    res.status(200).send();
  })
});

module.exports = router;