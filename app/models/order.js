const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  items: {
    type: [String],
    required: true
  },
  subtotal: Number,
  tax: Number,
  tip: Number,
  total: Number,
  paymentMethod: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Order', orderSchema)
