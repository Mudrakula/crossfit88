'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Sale = require('./sale.model');

router.get('/', (req, res) => {
  Sale.find()
    .exec((err, data) => {
      res.status(200).json(data);
    });
});

router.post('/create', (req, res) => {
  Sale.create(req.body, (err, data) => {
    if (err)
      return console.log(err);

    res.status(200).json(data);
  });
});

module.exports = router;