const express = require('express')
const cors = require('cors')
const server = express()
const cookieParser = require('cookie-parser')

server.listen(3333, () => console.log('Server ready on port 3333'))
server.use(express.json())
server.use(cors())
server.use(cookieParser())
server.set('json spaces', 2)

server.use('/', require('./routes/auth'))
