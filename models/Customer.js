var mongoose = require('mongoose');

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

var customerSchema = new mongoose.Schema({
  account: { type: String, unique: true },
  email: String,
  name: String,
  customer: String,
  transactions: Array
}, schemaOptions);

module.exports = mongoose.model('Customers', customerSchema);