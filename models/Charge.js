var mongoose = require('mongoose');

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

var chargeSchema = new mongoose.Schema({
  customer: String,
  transactions: Array
}, schemaOptions);

module.exports = mongoose.model('Charges', chargeSchema);