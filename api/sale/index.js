'use strict';

var express = require('express');
var router = express.Router();
var fs = require('fs');
var _ = require('lodash');
var path = require('path')
var moment = require('moment');
var parser = require('babyparse');
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

router.post('/export', (req, res) => {
  var fromDate = req.body.fromDate;
  var toDate = req.body.toDate;

  Sale.find({
    date: {$gte: fromDate, $lte: toDate}
  })
    .sort({
      date: 1
    })
    .exec((err, data) => {
      if (err)
        return console.log(err);

      var day = moment(data[0].date);
      var total = 0;
      var netProfit = 0;
      var dayTotal = 0;
      var dayNetProfit = 0;
      var startObj = {
        'Дата': day.format('DD.MM.YYYY'),
        'Товар': null,
        'Цена (цена закупки)': null,
        'Количество': null,
        'Сумма': null
      };
      var report = _.reduce(data, (result, sale) => {
        if (! moment(sale.date).isSame(day, 'day')) {
          day = moment(sale.date);
          total += dayTotal;
          netProfit += dayNetProfit;
          result.push({
            'Дата': 'Прибыль за день: ' + dayTotal,
            'Товар': 'Чистая прибыль за день: ' + dayNetProfit
          });
          result.push('\n');
          result.push({'Дата': day.format('DD.MM.YYYY')});
          dayTotal = dayNetProfit = 0;
        }

        dayTotal += sale.cost * sale.count;
        dayNetProfit += (sale.cost - sale.purchaseCost) * sale.count;

        result.push({
          'Дата': moment(sale.date).format('HH:mm'),
          'Товар': sale.title,
          'Цена (цена закупки)': sale.cost + ' (' + sale.purchaseCost + ')',
          'Количество': sale.count,
          'Сумма': sale.cost * sale.count
        });

        return result;
      }, [startObj]);

      report.push({
        'Дата': 'Прибыль за день: ' + dayTotal,
        'Товар': 'Чистая прибыль за день: ' + dayNetProfit
      });
      report.push('\n\n\n');
      report.push({
        'Дата': 'Прибыль: ' + (total + dayTotal),
        'Товар': 'Чистая прибыль: ' + (netProfit + dayNetProfit)
      });

      var sales = parser.unparse(JSON.stringify(report));
      var file = 'app/reports/report_' + moment().format('DD.MM.YYYY') + '.csv';
      fs.writeFile(file, sales, err => {
        if (err)
          return console.log(err);

        res.status(200).json(file);
      });
    });
});

module.exports = router;