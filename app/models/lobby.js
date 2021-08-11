const mongoose = require('mongoose')

const lobbySchema = new mongoose.Schema({       
  players: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    required: true
  },
}, {
  timestamps: true
})

module.exports = mongoose.model('Lobby', lobbySchema)