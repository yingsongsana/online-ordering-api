const express = require('express')
const passport = require('passport')

const multer = require('multer')
const storage = multer.memoryStorage()
const multerUpload = multer({ storage: storage })

const Dish = require('../models/dish')
const awsBucketApi = require('../lib/awsBucketApi')

const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404

const requireToken = passport.authenticate('bearer', { session: false })

const removeBlanks = require('../../lib/remove_blank_fields')

const router = express.Router()

// INDEX
// GET /dishes
router.get('/dishes', (req, res, next) => {
  Dish.find()
    .then(dishes => {
      return dishes.map(dish => dish.toObject())
    })
    .then(dishes => res.status(200).json({ dishes: dishes }))
    .catch(next)
})

// SHOW
// GET /dishes/:id
router.get('/dishes/:id', (req, res, next) => {
  Dish.findById(req.params.id)
    .then(handle404)
    .then(dish => res.status(200).json({ dish: dish.toObject() }))
    .catch(next)
})

// CREATE
// POST /dishes
router.post('/dishes', multerUpload.single('file'), requireToken, (req, res, next) => {
  console.log(req.file)

  awsBucketApi(req.file)
    .then(awsResponse => {
      return Dish.create({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        imageFile: awsResponse.key,
        count: req.body.count,
        category: req.bosy.category
      })
    })
    .then(dish => {
      res.status(201).json({ dish: dish.toObject() })
    })
    .catch(next)
})

// UPDATE
// PATCH
router.patch('/dishes/:id', requireToken, removeBlanks, (req, res, next) => {
  Dish.findById(req.params.id)
    .then(handle404)
    .then(dish => {
      return dish.updateOne(req.body.dish)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

// DESTROY
// DELETE /dishes/:id
router.delete('/dishes/:id', requireToken, (req, res, next) => {
  Dish.findById(req.params.id)
    .then(handle404)
    .then(dish => dish.deleteOne())
    .then(() => res.status(204))
    .catch(next)
})

module.exports = router
