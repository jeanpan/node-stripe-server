'use strict';

var express = require("express");
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var stripe = require('stripe')(process.env.STRIPE_SECRET_TEST_KEY);
var app = express();

var userController = require('../controllers/userController');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB);
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'app://blank.gaiamobile.org');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.post('/create', userController.create);
app.post('/retrieve', userController.retrieve);
app.post('/update', userController.update);
app.post('/delete', userController.delete);
app.post('/charge', userController.charge);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});