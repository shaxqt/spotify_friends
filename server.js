const express = require('express')
const cors = require('cors')
const server = express()

server.listen(3333, () => console.log('Server ready on port 3333'))
server.use(express.json())
server.use(cors())
server.set('json spaces', 2)

server.use('/cards', require('./routes/auth'))
