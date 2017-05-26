'use strict';

var stripe = require('stripe')('sk_test_p7cidZqygRjBHjhXDBnDhf4h');

exports.new = function(req, res) {
  stripe.customers.createSource(
    req.params.customerId,
    { source: req.params.token },
    function(err, card) {
      if (err) res.send(err);
      res.json(card);
    }
  );
}

exports.list = function(req, res) {
  stripe.customers.listCards(req.params.customerId, function(err, cards) {
    if (err) res.send(err);
    res.send(cards);
  });
};

exports.update = function(req, res) {
  stripe.customers.update(req.params.customerId, req.body, function(err, customer) {
    if (err) res.send(err);
    res.json(customer);
  });
};

exports.delete = function(req, res) {
  stripe.customers.deleteCard(
    req.params.customerId,
    req.params.cardId,
    function(err, confirmation) {
      if (err) res.send(err);
      res.json(confirmation);
    }
  );
};