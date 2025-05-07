require('dotenv').config();

const express = require('express')

const { createServer } = require('node:http')
const { join } = require('node:path')
const { Server } = require('socket.io')

const app = express()
const port = 3000

const cors = require('cors')
const server = createServer(app)

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors({ origin: "http://localhost:5173", credentials: true }))

const io = new Server(server, {
    cors: {
        origin: '*'
    },
})

const chats = [
    {
        messages: 'Hello World!',
    }
]

app.use('/', require('./routers'))

io.on('connection', (socket) => {
    console.log('a user connected', socket.id)

    socket.on('messages.get', () => {
        console.log('messages.get >>>>')
        socket.emit('messages.data', chats)
    })

    socket.on('sendMessage', (data) => {
        console.log('sendMessage >>>>', data)
        chats.push({messages: data.message})
        console.log('chats >>>>', chats)
        io.emit('messages.data', chats)
    })

    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id)
    })
})

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
