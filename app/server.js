'use strict';

var express = require("express");
var bodyParser = require('body-parser');
var stripe = require('stripe')(process.env.STRIPE_SECRET_TEST_KEY);
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

/*
app.all('/', function(req, res, next) {
  console.log(req.headers);
  console.log(req.body);
  var allowedOrigins = ['http://localhost:3000'];
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  }
  next();
});
*/

app.post('/pay', function(req, res) {
  var paymentData = req.body;

  stripe.charges.create({
    amount: paymentData.amount,
    currency: paymentData.currency,
    source: paymentData.token, 
    description: paymentData.description
  }, function(error, charge) {
    if (error) {
      console.log('Error ', error);
      res.send(error);
    } else {
      res.send(charge);
    }
  });
});


app.post('/verify', function(req, res) {
  var data = req.body;

  stripe.tokens.create({
    card: data
  }, function(error, token) {
    if (error) {
      console.log('Error ', error);
      res.send(error);
    } else {
      console.log(token);
      res.send(token)
    }
  });  
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});