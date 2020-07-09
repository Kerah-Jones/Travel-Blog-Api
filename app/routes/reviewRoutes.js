const express = require('express')
const passport = require('passport')
const router = express.Router()
const requireToken = passport.authenticate('bearer', { session: false })
const removeBlanks = require('../../lib/remove_blank_fields')
const customErrors = require('../../lib/custom_errors')
const requireOwnership = customErrors.requireOwnership

// require restaurant model
const Blog = require('../models/blog')
const handle404 = require('../../lib/custom_errors')

// CREATE
// POST /reviews/
router.post('/reviews', requireToken, (req, res, next) => {
  // get the review data from the body of the request
  const reviewData = req.body.review
  // get the blog id from the body
  const blogId = reviewData.blogId
  // find the restaurant by its id
  Blog.findById(blogId)
    .then(handle404)
    .then(blog => {
      // add review to restaurant
      blog.reviews.push(reviewData)
      // save restaurant
      return blog.save()
    })
    // send responsne back to client
    .then(blog => res.status(201).json({restaurant: blog}))
    .catch(next)
})
module.exports = router
