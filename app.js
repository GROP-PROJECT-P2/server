require('dotenv').config();

const express = require('express')

const { createServer } = require('node:http')
const { join } = require('node:path')
const { Server } = require('socket.io')

const app = express()
const port = 3000

const server = createServer(app)
const io = new Server(server)

const cors = require('cors')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

app.use('/', require('./routers'))

io.on('connection', (socket) => {
    console.log('a user connected')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
