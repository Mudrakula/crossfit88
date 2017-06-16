'use strict';

var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var Admin = require('./admin.model');

router.post('/login', (req, res) => {
  Admin.findOne({
    username: req.body.username
  }, (err, admin) => {
    if (err)
      return console.log(err);

    if (! admin)
      return res.status(200).json({status: 'fail'});

    let hash = crypto.createHash('sha256').update(req.body.password).digest('hex');
    if (admin.password === hash)
      return res.status(200).json({
        status: 'success',
        admin: admin
      });
    else
      return res.status(200).json({status: 'fail'});
  });
});

router.post('/registration', (req, res) => {
  if (req.body.password !== req.body.passwordConfirm)
    return res.status(200).json({
      status: 'fail'
    });

  req.body.password = crypto.createHash('sha256').update(req.body.password).digest('hex');
  Admin.create(req.body, (err, admin) => {
    if (err)
      return console.log(err);

    res.status(200).json({
      status: 'success',
      admin: admin
    });
  });
});

router.post('/update', (req, res) => {
  Admin.findOneAndUpdate({_id: req.body._id}, req.body, {new: true, upsert: true}, (err, data) => {
    if (err)
      return console.log(err);

    res.status(200).json(data);
  });
});

router.get('/', (req, res) => {
  Admin.find()
    .sort('role')
    .exec((err, data) => {
      if (err)
        return console.log(err);

      res.status(200).json(data);
    });
});

router.delete('/:id', (req, res) => {
  Admin.remove({_id: req.params.id}, err => {
    if (err)
      return console.log(err);

    res.status(200).send();
  });
});

module.exports = router;