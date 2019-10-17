const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const server = express()
const { mongoDB } = require('./config/config')
const mongoose = require('mongoose')
const { getSessionIfValid } = require('./auth_utils')
const { startCurrSongFetchIntervall } = require('./spotify_utils')
const http = require('http').createServer(server)
const io = require('socket.io')(http)

mongoose
  .connect(mongoDB, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('connected to mongoDB'))
  .catch(err => console.log('error connecting to mongoDB', err))

io.use(async function(socket, next) {
  if (socket.handshake.query && socket.handshake.query.spotify_friends_token) {
    const session = await getSessionIfValid(
      socket.handshake.query.spotify_friends_token
    )
    if (session) {
      socket.session = session
      next()
    } else {
      socket.disconnect()
    }
  }
})

let clients = []
io.sockets.on('connection', function(socket) {
  console.log(
    socket.session.userID + ' joined, client count: ' + clients.push(socket)
  )

  socket.on('disconnect', function(socket) {
    clients = clients.filter(s => s.id === socket.id)
    console.log('client left, client count: ' + clients.length)
  })
})

http.listen(3333, function() {
  console.log('listening on *:3333')
})

server.use(express.json())
server.use(cors())
server.use(cookieParser())
server.set('json spaces', 2)

server.use('/auth', require('./routes/auth'))
server.use('/user', require('./routes/user'))

startCurrSongFetchIntervall((userID, currSong, friends) => {
  friends.forEach(friend => {
    const socketsToPush = clients.filter(
      socket => socket.session.userID === friend
    )
    socketsToPush.forEach(socket => {
      console.log('pushing newsong to ' + socket.session.userID)
      socket.emit('newsong', { userID, currSong })
    })
  })
  //console.log('new song to push: ', userID, currSong.item.name, friends)
})
