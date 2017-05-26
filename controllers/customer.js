'use strict';

var stripe = require('stripe')('sk_test_p7cidZqygRjBHjhXDBnDhf4h');

var Customer = require('../models/Customer');

/**
 * POST /createCard
 */
exports.createCard = function(req, res, next) {
  console.log(req.body);
  Customer.findOne({ account: req.body.account }, function(err, customer) {
    console.log(customer);

    if (customer) {
      console.log('Update Existing Customer >>>');

      // create a new card
      stripe.customers.createSource(
        customer.customer,
        { source: req.body.token },
        function(err, card) {
          console.log(err);
          console.log(card);
          if (err) res.send(err);
          res.json(customer);
        }
      );

    } else {
      console.log('Create New Customer >>>');

      // create customer
      stripe.customers.create({
        email: req.body.email,
        source: req.body.token // obtained with Stripe.js
      }, function(err, customer) {
        console.log(err);
        if (err) res.send(err);
        console.log(customer);
        customer = new Customer({
          account: req.body.account,
          email: customer.email,
          customer: customer.id
        });
        customer.save(function(err, customer) {
          if(err) res.send(err);
          res.json(customer);
        });
      });

    }
  });
};

exports.getCustomer = function(req, res) {
  Customer.findOne({ account: req.body.account }, function(err, customer) {
    if (err) res.send(err);

    stripe.customers.retrieve(
      customer.customer,
      function(err, customer) {
        if (err) res.send(err);
        res.send(customer);
        // asynchronously called
      }
    );
  });
};

exports.listCards = function(req, res) {
  Customer.findOne({ account: req.body.account }, function(err, customer) {
    if (err) res.send(err);
    stripe.customers.listCards(customer.customer, function(err, cards) {
      if (err) res.send(err);
      res.send(cards);
    });
  });
};

exports.charge = function(req, res) {
  Customer.findOne({ account: req.body.account }, function(err, customer) {
    if (err) res.send(err);

    console.log(req.body);
  
    stripe.charges.create({
      amount: 1.99,
      currency: req.body.currency,
      customer: customer.customer, // obtained with Stripe.js
      description: req.body.description,
      receipt_email: customer.email
    }, function(err, charge) {
      if (err) res.send(err);
      customer.transactions.push(charge.id);
      customer.save(function(err, customer) {
        if(err) res.send(err);
        res.json(customer);
      });
    });

  });
};

exports.delete = function(req, res) {
  Customer.findOne({ account: req.body.account }, function(err, customer) {
    if (err) res.send(err);

    stripe.customers.deleteCard(
      customer.customer,
      req.body.cardId,
      function(err, confirmation) {
        if (err) res.send(err);
        res.json(confirmation);
      }
    );
  });
};

exports.update = function(req, res) {
  Customer.findOne({ account: req.body.account }, function(err, customer) {
    if (err) res.send(err);

    stripe.customers.update(customer.customer, {
      default_source: req.body.cardId
    }, function(err, customer) {
      if (err) res.send(err);
      res.json(customer);
    });
  });
};

