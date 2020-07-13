const express = require('express')
const passport = require('passport')
const router = express.Router()
const requireToken = passport.authenticate('bearer', { session: false })
const removeBlanks = require('../../lib/remove_blank_fields')
const customErrors = require('../../lib/custom_errors')
const requireOwnership = customErrors.requireOwnership

// require blog model
const Blog = require('../models/blog')
const handle404 = require('../../lib/custom_errors')

// CREATE
// POST /reviews/
router.post('/reviews/:blogId', requireToken, (req, res, next) => {
  // get the review data from the body of the request
  req.body.review.owner = req.user.id
  const reviewData = req.body.review
  // get the blog id from the body
  const blogId = req.params.blogId
  // find the blog by its id
  Blog.findById(blogId)
    .then(handle404)
    .then(blog => {
      // add review to blog
      blog.reviews.push(reviewData)
      // save blog
      return blog.save()
    })
    // send responsne back to client
    .then(blog => res.status(201).json({blog: blog}))
    .catch(next)
})
module.exports = router
