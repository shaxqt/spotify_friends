const express = require('express')
const cors = require('cors')
const server = express()
const { mongoDB } = require('../config/config')
const mongoose = require('mongoose')

mongoose
  .connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('connected to mongoDB'))
  .catch(err => console.log('error connecting to mongoDB', err))
server.listen(3333, () => console.log('Server ready on port 3333'))
server.use(express.json())
server.use(cors())
server.set('json spaces', 2)

server.use('/', require('./routes/auth'))
