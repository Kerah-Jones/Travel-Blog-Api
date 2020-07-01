const express = require('express')
const passport = require('passport')
const router = express.Router()
const requireToken = passport.authenticate('bearer', { session: false })
const removeBlanks = require('../../lib/remove_blank_fields')

// require restaurant model
const Blog = require('../models/blog')
const handle404 = require('../../lib/custom_errors')

// INDEX
// GET /blogs
router.get('/blogs', requireToken, (req, res, next) => {
  Blog.find()
    .then(examples => {
    // `examples` will be an array of Mongoose documents
    // we want to convert each one to a POJO, so we use `.map` to
    // apply `.toObject` to each one
      return examples.map(example => example.toObject())
    })
    .then(blogs => res.json({ blogs: blogs }))
    .catch(next)
})

// SHOW
// GET /blogs/:id
router.get('/blogs/:id', (req, res, next) => {
  const id = req.params.id
  Blog.findById(id)
    .populate('owner')
    .populate('reviews.reviewer')
    .then(handle404)
    .then(blog => res.json({blog: blog}))
    .catch(next)
})

// CREATE
// POST /blogs/
router.post('/blogs', requireToken, (req, res, next) => {
  // set owner of new example to be current user
  req.body.blog.owner = req.user.id

  Blog.create(req.body.blog)
    // respond to succesful `create` with status 201 and JSON of new "example"
    .then(blog => {
      res.status(201).json({ blog: blog.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
})

// UPDATE
// PATCH /blogs/:id
router.patch('/blogs/:id', requireToken, removeBlanks, (req, res, next) => {
  const id = req.params.id
  const blogData = req.body.blog
  Blog.findById(id)
    .then(handle404)
    .then(blog => blog.updateOne(blogData))
    .then(() => res.sendStatus(204))
    .catch(next)
})

// DESTROY
// DELETE /blogs/:id
router.delete('/blogs/:id', (req, res, next) => {
  const id = req.params.id
  Blog.findById(id)
    .then(handle404)
    .then(blog => blog.remove())
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
