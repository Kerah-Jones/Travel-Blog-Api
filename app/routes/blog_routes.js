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
  Blog.findById(req.params.id)
    .then(handle404)
    .then(blog => {
    // pass the `req` object and the Mongoose record to `requireOwnership`
    // it will throw an error if the current user isn't the owner
      requireOwnership(req, blog)

      // pass the result of Mongoose's `.update` to the next `.then`
      return blog.updateOne(req.body.blog)
    })
  // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
  // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
// DELETE /blogs/:id
router.delete('/blogs/:id', requireToken, (req, res, next) => {
  Blog.findById(req.params.id)
    .then(handle404)
    .then(blog => {
      // throw an error if current user doesn't own `blog`
      requireOwnership(req, blog)
      // delete the blog ONLY IF the above didn't throw
      blog.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
