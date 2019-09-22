const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const server = express()
const { mongoDB } = require('./config/config')
const mongoose = require('mongoose')

mongoose
  .connect(mongoDB, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('connected to mongoDB'))
  .catch(err => console.log('error connecting to mongoDB', err))
server.listen(3333, () => console.log('Server ready on port 3333'))
server.use(express.json())
server.use(cors())
server.use(cookieParser())
server.set('json spaces', 2)

server.use('/auth', require('./routes/auth'))
server.use('/v1', require('./routes/apiv1'))
