const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  players: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    required: true
  },
  board: {
    type: String,
    required: true
  },
  settlements: String,
  roads: String
}, {
  timestamps: true
})

module.exports = mongoose.model('Game', gameSchema)