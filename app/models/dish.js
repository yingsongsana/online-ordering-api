const mongoose = require('mongoose')

const dishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  image: String,
  count: Number
}, {
  timestamps: true
})

module.exports = mongoose.model('Dish', dishSchema)
