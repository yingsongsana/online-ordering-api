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
  imageFile: String,
  count: Number,
  category: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

// Virtual property that generates the file URL location for images stored on AWS S3
dishSchema.virtual('fileUrl').get(function () {
  // Generating
  const url = 'https://' + process.env.BUCKET_NAME + '.s3.amazonaws.com/' + this.imageFile
  // Return the value
  return url
})

module.exports = mongoose.model('Dish', dishSchema)
