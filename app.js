require('dotenv').config();

const express = require('express')

const { createServer } = require('node:http')
const { Server } = require('socket.io')

const app = express()
const port = 3000

const cors = require('cors')
const server = createServer(app)

const io = new Server(server, {
    cors: {
        origin: '*'
    },
})

app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// const chats = [
//     {
//         messages: 'Hello World!',
//     }
// ]

io.on('connection', (socket) => {
    console.log('a user connected', socket.id)

    socket.on('join_group', (groupId) => {
        socket.join(`group_${groupId}`)
        console.log(`user ${socket.id} joined group ${groupId}`)
    })

    io.emit('mySocketId', socket.id)
    io.emit('handShakeAuth', socket.handshake.auth)
})

app.set('io', io);
app.use('/', require('./routers'))

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
