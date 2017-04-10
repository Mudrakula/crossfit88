'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('./user.model');

router.get('/', (req, res) => {
  User.find({}, (err, data) => {
    res.status(200).json(data);
  });
});

router.post('/update', (req, res) => {
  req.body._id = req.body._id || new mongoose.mongo.ObjectID();
  User.findOneAndUpdate({_id: req.body._id}, req.body, {new: true, upsert: true}, (err, data) => {
    if (err)
      return console.log(err);

    res.status(200).json(data);
  });
});

router.post('/delete', (req, res) => {
  User.remove({_id: req.body.id}, err => {
    if (err)
      return console.log(err);

    res.status(200).send();
  })
});

module.exports = router;