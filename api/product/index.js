'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Product = require('./product.model');

router.get('/', (req, res) => {
  let page = req.query.page || 0;
  let limit = +req.query.limit || 10;
  let searchObj = {
    title: new RegExp(req.query.query, 'i')
  };

  Product.find(searchObj)
  .skip(page * limit)
  .limit(limit)
  .exec((err, data) => {
    Product.find(searchObj)
      .count()
      .exec((err, count) => {
        res.status(200).json({products: data, count: count});
      });
  });
});

router.post('/update', (req, res) => {
  req.body._id = req.body._id || new mongoose.mongo.ObjectID();

  Product.findOneAndUpdate({_id: req.body._id}, req.body, {new: true, upsert: true})
    .exec((err, data) => {
      if (err)
        return console.log(err);

      res.status(200).json(data);
    })
});

router.post('/delete', (req, res) => {
  Product.remove({_id: req.body.id}, err => {
    if (err)
      return console.log(err);

    res.status(200).send();
  });
});

module.exports = router;