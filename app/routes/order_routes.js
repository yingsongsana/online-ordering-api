const express = require('express')
const passport = require('passport')
const Order = require('../models/order')

const customErrors = require('../../lib/custom_errors')
const order = require('../models/order')
const handle404 = customErrors.handle404

const requireOwnership = customErrors.requireOwnership
const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

// CREATE
// POST /orders
router.post('/orders', requireToken, (req, res, next) => {
  req.body.order.owner = req.user.id

  Order.create(req.body.order)
    .then(order => {
      res.status(201).json({ prder: order.toObject() })
    })
    .catch(next)
})

// INDEX
// GET /orders
router.get('/orders', requireToken, (req, res, next) => {
  Order.find()
    .then(orders => {
      return orders.map(order => order.toObject())
    })
    .then(orders => {
      requireOwnership(req, order)
      res.status(200).json({ orders: orders })
    })
    .catch(next)
})

// SHOW
// GET /orders/:id
router.get('/orders/:id', requireToken, (req, res, next) => {
  Order.findById(req.params.id)
    .then(handle404)
    .then(order => {
      requireOwnership(req, order)
      res.status(200).json({ order: order.toObject() })
    })
    .catch(next)
})

module.exports = router
