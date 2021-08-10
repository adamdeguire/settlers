// require necessary NPM packages
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

// define server and client ports
// used for cors and local port declaration
const serverDevPort = 4741
const clientDevPort = 7165

// define port for API to run on
const port = process.env.PORT || serverDevPort

const app = express()

app.use(cors({ origin: process.env.CLIENT_ORIGIN || `http://localhost:${clientDevPort}` }))

// run API on designated port (4741 in this case)
const server = app.listen(port, () => {
  console.log('listening on port ' + port)
})
const io = require('socket.io')(server, { cors: { origin: '*' } })

// require route files
const gameRoutes = require('./app/routes/game_routes')
const userRoutes = require('./app/routes/user_routes')

// require middleware
const errorHandler = require('./lib/error_handler')
const requestLogger = require('./lib/request_logger')

// require database configuration logic
// `db` will be the actual Mongo URI as a string
const db = require('./config/db')

// require configured passport authentication middleware
const auth = require('./lib/auth')

// establish database connection
// use new version of URL parser
// use createIndex instead of deprecated ensureIndex
mongoose.connect(db, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})

// instantiate express application object

// set CORS headers on response from this API using the `cors` NPM package
// `CLIENT_ORIGIN` is an environment variable that will be set on Heroku
app.use(cors({ origin: process.env.CLIENT_ORIGIN || `http://localhost:${clientDevPort}` }))

io.on('connection', (socket) => {
  console.log('User connected: ' + socket.id)

  socket.on('new-user', () => {
    socket.broadcast.emit('new-user')
  })

  socket.on('start-game', (gameBoard) => {
    socket.broadcast.emit('start-game', gameBoard)
  })

  socket.on('message', (data) => {
    console.log(data)
    socket.broadcast.emit('message', data)
  })
  
  socket.on('click', (click) => {
    console.log(`Board updated by: ${socket.id}`)
    socket.broadcast.emit('click', click)
  })

  socket.on('settlement', (settlements) => {
    console.log(settlements)
    socket.broadcast.emit('settlement', settlements)
  })

  socket.on('road', (roads) => {
    console.log(roads)
    socket.broadcast.emit('road', roads)
  })

  socket.on('hide-color', (color) => {
    console.log(color)
    socket.broadcast.emit('hide-color', color)
  })

  socket.on('dice-roll', (roll1, roll2) => {
    console.log(roll1, roll2)
    socket.broadcast.emit('dice-roll', roll1, roll2)
  })
})

// register passport authentication middleware
app.use(auth)

// add `express.json` middleware which will parse JSON requests into
// JS objects before they reach the route files.
// The method `.use` sets up middleware for the Express application
app.use(express.json())
// this parses requests sent by `$.ajax`, which use a different content type
app.use(express.urlencoded({ extended: true }))

// log each request as it comes in for debugging
app.use(requestLogger)

// register route files
app.use(gameRoutes)
app.use(userRoutes)

// register error handling middleware
// note that this comes after the route middlewares, because it needs to be
// passed any error messages from them
app.use(errorHandler)

// app.get('/', (req, res) => {
//   res.send(200)
// })

// needed for testing
module.exports = app
