'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Trainer = require('./trainer.model');

router.get('/', (req, res) => {
  Trainer.find()
    .populate('trainings.user')
    .exec((err, data) => {
      res.status(200).json(data);
    });
});

router.post('/update', (req, res) => {
  req.body._id = req.body._id || new mongoose.mongo.ObjectID();
  Trainer.findOneAndUpdate({_id: req.body._id}, req.body, {new: true, upsert: true}, (err, data) => {
    if (err)
      return console.log(err);

    res.status(200).json(data);
  });
});

router.post('/delete', (req, res) => {
  Trainer.remove({_id: req.body.id}, err => {
    if (err)
      return console.log(err);

    res.status(200).send();
  })
});

module.exports = router;