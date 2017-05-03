var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();

// view engine setup
// app.engine('ejs', require('express-ejs-extend'));
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

mongoose.connect('mongodb://localhost/crossfit88');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/app', express.static(path.join(__dirname, 'app')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));

app.use('/api/auth', require('./api/auth'));
app.use('/api/users', require('./api/user'));
app.use('/api/trainers', require('./api/trainer'));
app.use('/api/tickets', require('./api/ticket'));

app.route('/*')
  .get(function(req, res) {
    res.sendFile(path.resolve('index.html'));
  })

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  console.log(err);
  res.status(err.status || 500);
  res.render('error', err);
});

module.exports = app;
