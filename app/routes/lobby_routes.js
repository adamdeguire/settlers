
const express = require('express')

const passport = require('passport')

const Lobby = require('../models/lobby')

const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { lobby: { title: '', text: 'foo' } } -> { lobby: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')

const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

// INDEX
// GET /lobby
router.get('/lobby', requireToken, (req, res, next) => {
  Lobby.find()
    .then(lobby => {
      return lobby.map(lobby => lobby.toObject())
    })
    .then(lobby => res.status(200).json({ lobby }))
    .catch(next)
})
  
  // CREATE
  // POST /lobby
  router.post('/lobby', requireToken, (req, res, next) => {
    Lobby.create(req.body)
       .then(lobby => {
        res.status(201).json({ lobby })
      })
      .catch(next)
  })
  
  // UPDATE
  // PATCH /add-player/5a7db6c74d55bc51bdf39793
  router.patch('/add-player/:id', requireToken, removeBlanks, (req, res, next) => {
    Lobby.findById(req.params.id)
      .then(handle404)
      .then(lobby => {
        lobby.players.push(req.body.player)
        return lobby.save()
      })
      .then(lobby => res.status(200).json({ lobby }))
      .catch(next)
  })

  // UPDATE
  // PATCH /remove-player/5a7db6c74d55bc51bdf39793
  router.patch('/remove-player/:id', requireToken, removeBlanks, (req, res, next) => {
    Lobby.findById(req.params.id)
      .then(handle404)
      .then(lobby => {
        lobby.players.pull(req.body.player)
        return lobby.save()
      })
      .then(lobby => res.status(200).json({ lobby }))
      .catch(next)
  })
  
  // DESTROY
  // DELETE /lobby/5a7db6c74d55bc51bdf39793
  router.delete('/lobby/:id', requireToken, (req, res, next) => {
    Lobby.findById(req.params.id)
      .then(handle404)
      .then(lobby => {
        lobby.deleteOne()
      })
      .then(() => res.sendStatus(204))
      .catch(next)
  })

    // DESTROY ALL
  // DELETE /lobby
  router.delete('/lobby', requireToken, (req, res, next) => {
    Lobby.deleteMany({})
      .then(() => res.sendStatus(204))
      .catch(next)
  })

  module.exports = router