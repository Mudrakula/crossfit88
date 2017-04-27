'use strict';

var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var Admin = require('./admin.model');

router.post('/login', (req, res) => {
  Admin.findOne({
    username: req.body.username
  }, (err, admin) {
    if (err)
      return console.log(err);

    let hash = crypto.createHash('sha256').update(req.body.password).digest('hex');
    if (admin.password === hash)
      res.status(200).json(admin);
    else
      res.status(200).json({'status': 'fail'});
  });
});

router.post('/registration', (req, res) => {
  req.body.password = crypto.createHash('sha256').update(req.body.password).digest('hex');
  Admin.create(req.body, (err, admin) => {
    if (err)
      return console.log(err);

    res.status(200).json(admin);
  });
});