const mongoose = require('mongoose')
const User = require('./user')

const playerSchema = new mongoose.Schema({
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }          
}, {
  timestamps: true
})

module.exports = playerSchema