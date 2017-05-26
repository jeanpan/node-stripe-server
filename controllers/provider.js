'use strict';

var stripe = require('stripe')(process.env.STRIPE_SECRET_TEST_KEY);

exports.listCards = function(req, res) {
  stripe.customers.listCards(req.body.customer, function(err, cards) {
    if (err) res.send(err);
    res.send(cards);
  });
};

exports.charge = function(req, res) {
  stripe.charges.create({
    amount: req.body.amount,
    currency: req.body.currency,
    customer: req.body.customer, // obtained with Stripe.js
    description: req.body.description,
    receipt_email: req.body.email
  }, function(err, charge) {
    // asynchronously called
  });
};

