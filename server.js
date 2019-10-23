const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const server = express()
const mongoose = require('mongoose')
const { getSessionIfValid } = require('./server/auth_utils')
const {
  startCurrSongFetchIntervall,
  startTopSongFetchIntervall
} = require('./server/spotify_utils')
const clients = require('./server/clients')
const http = require('http').createServer(server)
const io = require('socket.io')(http, {
  pingTimeout: 60000
})
const path = require('path')

// Serve static files from the React app
server.use(express.static(path.join(__dirname, 'build')))

const mongoDB =
  process.env.NODE_ENV === 'production'
    ? process.env.MONGODB
    : require('./server/config/config').mongoDB

mongoose
  .connect(mongoDB, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('connected to mongoDB'))
  .catch(err => console.log('error connecting to mongoDB', err))

io.sockets.on('connection', socket => {
  if (socket.handshake.query && socket.handshake.query.spotify_friends_token) {
    getSessionIfValid(socket.handshake.query.spotify_friends_token)
      .then(session => {
        if (session != null && session['userID'] != null) {
          socket.session = session
          clients.add(socket)
        } else {
          socket.disconnect()
        }
      })
      .catch(err => {
        socket.disconnect()
      })
  }

  socket.on('disconnect', socket => {
    clients.remove(socket.id)
  })
})

http.listen(3333, _ => {
  console.log('listening on *:3333')
})

server.use(express.json())
server.use(cors())
server.use(cookieParser())
server.set('json spaces', 2)

server.use('/auth', require('./server/routes/auth'))
server.use('/user', require('./server/routes/user'))

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
server.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'))
})

startCurrSongFetchIntervall()
startTopSongFetchIntervall()
