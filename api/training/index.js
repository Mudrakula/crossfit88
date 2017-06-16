'use strict';

var express = require('express');
var router = express.Router();
var Training = require('./training.model');

router.get('/', (req, res) => {
  Training.find()
    .populate('client')
    .populate('trainer')
    .exec((err, data) => {
      if (err)
        return console.log(err);

      res.status(200).json(data);
    });
});

router.get('/:id', (req, res) => {
  Training.find({trainer: req.params.id})
    .populate('client')
    .populate('trainer')
    .exec((err, data) => {
      if (err)
        return console.log(err);

      res.status(200).json(data);
    });
});

router.post('/', (req, res) => {
  Training.create(req.body, (err, data) => {
    if (err)
      return console.log(err);

    res.status(200).json(data);
  });
});

module.exports = router;