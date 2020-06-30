const express = require('express')
const router = express.Router()

// require restaurant model
const Blog = require('../models/blog')
const handle404 = require('../../lib/custom_errors')

// INDEX
// GET /restaurants
router.get('/blogs', (req, res, next) => {
  Blog.find()
    .populate('owner')
    .populate('reviews.reviewer')
    .then(blogs => res.json({ blogs: blogs }))
    .catch(next)
})

// SHOW
// GET /restaurants/:id
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
// POST /restaurants/
router.post('/blogs', (req, res, next) => {
  const blogData = req.body.blog
  Blog.create(blogData)
    .then(blog => res.status(201).json({blog: blog}))
    .catch(next)
})

// UPDATE
// PATCH /restaurants/:id
router.patch('/blogs/:id', (req, res, next) => {
  const id = req.params.id
  const blogData = req.body.blog
  Blog.findById(id)
    .then(handle404)
    .then(blog => blog.update(blogData))
    .then(() => res.sendStatus(204))
    .catch(next)
})

// DESTROY
// DELETE /restaurants/:id
router.delete('/blogs/:id', (req, res, next) => {
  const id = req.params.id
  Blog.findById(id)
    .then(handle404)
    .then(blog => blog.remove())
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
