'use strict';

var mongoose = require('mongoose');

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

var userSchema = new mongoose.Schema({
  userId: { type: String, unique: true },
  email: String,
  name: String,
  customer: String,
  transactions: Array
}, schemaOptions);

module.exports = mongoose.model('Users', userSchema);