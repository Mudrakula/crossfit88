'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('./user.model');

router.get('/', (req, res) => {
  let searchObj = {$or: [
    {firstname: new RegExp(req.query.query, 'i')},
    {lastname: new RegExp(req.query.query, 'i')}
  ]};

  if (req.query.ticket)
    searchObj['ticket._id'] = req.query.ticket;

  if (req.query.trainer)
    searchObj['trainer'] = req.query.trainer;
  User.find(searchObj)
    .sort({
      'trainer': 1,
      'ticket.trainings.remain': 1,
      'ticket.endDate': 1
    })
    .populate('trainer')
    .exec((err, data) => {
      res.status(200).json(data);
    });
});

router.post('/update', (req, res) => {
  req.body._id = req.body._id || new mongoose.mongo.ObjectID();
  User.findOneAndUpdate({_id: req.body._id}, req.body, {new: true, upsert: true})
    .populate('trainer')
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

module.exports = router;