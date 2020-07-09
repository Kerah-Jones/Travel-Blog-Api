const mongoose = require('mongoose')
const reviewSchema = require('./review')

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  post: {
    type: String,
    required: true
  },
  reviews: [reviewSchema],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})
module.exports = mongoose.model('Blog', blogSchema)
