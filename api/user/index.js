'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('./user.model');

router.get('/', (req, res) => {
  let sortMode = -1;
  let searchObj = {$or: [
    {firstname: new RegExp(req.query.query, 'i')},
    {lastname: new RegExp(req.query.query, 'i')}
  ]};

  if (req.query.ticket)
    searchObj['ticket'] = req.query.ticket;

  if (req.query.trainer)
    searchObj['trainer'] = req.query.trainer;

  if (req.query.status) {
    searchObj['status'] = +req.query.status;
    sortMode = 1;
  }

  let page = req.query.page || 0;
  let limit = +req.query.limit || 5;
  User.find(searchObj)
    .sort({
      'trainings.endDate': sortMode,
      'trainings.remain': 1,
      'trainer': 1
    })
    .skip(page * limit)
    .limit(limit)
    .populate('trainer')
    .populate('ticket')
    .exec((err, data) => {
      User.find(searchObj)
        .count()
        .exec((err, count) => {
          res.status(200).json({users: data, count: count});
        });
    });
});

router.post('/update', (req, res) => {
  req.body._id = req.body._id || new mongoose.mongo.ObjectID();
  User.findOneAndUpdate({_id: req.body._id}, req.body, {new: true, upsert: true})
    .populate('trainer')
    // .populate('trainings')
    .populate('ticket')
    .exec((err, data) => {
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
  });
});

router.get('/check', (req, res) => {
  User.update({
    status: 1,
    'trainings.endDate': {$lt: + new Date()}
  }, {
    status: 0,
    trainings: {}
  }, {}, (err, data) => {
    if (err)
      return console.log(err);

    res.status(200).send(data);
  });
});

module.exports = router;