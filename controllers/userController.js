'use strict';

var stripe = require('stripe')(process.env.STRIPE_SECRET_TEST_KEY);

var User = require('../models/User');

function _retrieveCustomer(customerId) {
  return new Promise(function(resolve, reject) {
    stripe.customers.retrieve(customerId, function(err, customer) {
      if (err) reject(err);
      resolve(customer);
    });
  });
}

/**
 * Create a new customer or a card under the existing customer
 * 
 */
exports.create = function(req, res) {
  User.findOne({ userId: req.body.userId }, function(err, user) {
    if (user) {
      // create a card
      stripe.customers.createSource(
        user.customer,
        { source: req.body.token },
        function(err, card) {
          if (err) {
            res.send(err);
          } else {
            // retrieve customer
            _retrieveCustomer(user.customer)
              .then(function(customer) {
                res.json(customer);
              })
              .catch(function(error) {
                res.send(error);
              });
          }
        }
      );
    } else {
      // create a customer
      stripe.customers.create({
        email: req.body.email,
        source: req.body.token
      }, function(err, customer) {
        if (err) {
          res.send(err);
        } else {
          var user = new User({
            userId: req.body.userId,
            email: customer.email,
            customer: customer.id
          });

          user.save(function(err, user) {
            if (err) res.send(err);
            res.json(customer);
          });
        }
      });
    }
  });
};

/**
 * Get customer by userId
 * 
 */
exports.retrieve = function(req, res) {
  User.findOne({ userId: req.body.userId }, function(err, user) {
    if (err) res.send(err);

    _retrieveCustomer(user && user.customer)
      .then(function(customer) {
        res.json(customer);
      })
      .catch(function(error) {
        res.send(error);
      });
  });
}

/**
 * Update customer's default_source by customerId
 * 
 */
exports.update = function(req, res) {
  stripe.customers.update(req.body.customerId, {
    default_source: req.body.cardId
  }, function(err, customer) {
    if (err) {
      res.send(err);
    } else {
      res.json(customer);
    }
  });
};

/**
 * Delete customer's card by customerId & cardId
 * 
 */
exports.delete = function(req, res) {
  stripe.customers.deleteCard(
    req.body.customerId,
    req.body.cardId,
    function(err, confirmation) {
      if (err) {
        res.send(err);
      } else {
        _retrieveCustomer(req.body.customerId)
          .then(function(customer) {
            res.json(customer);
          })
          .catch(function(error) {
            res.send(error);
          });
      }
    }
  );
};

/**
 * Charge customer
 * 
 */
exports.charge = function(req, res) {
  User.findOne({ userId: req.body.userId }, function(err, user) {
    if (err) {
      res.send(err);
    } else {
      stripe.charges.create({
        amount: req.body.amount,
        currency: req.body.currency,
        customer: user.customer,
        description: req.body.description,
        receipt_email: user.email
      }, function(err, charge) {
        if (err) {
          res.send(err);
        } else {
          user.transactions.push(charge.id);
          user.save(function(err, user) {
            if(err) res.send(err);
            res.json(user);
          });
        }
      });
    }
  });
};


