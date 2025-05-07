require('dotenv').config();

const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const { getAIResponse } = require('./helpers/openAI');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    },
});

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('io', io);

const chats = [{ text: "hello" }];

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

app.use('/', require('./routers'));

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    socket.emit('chat.verse', chats);

    socket.on('join_group', (groupId) => {
        socket.join(`group_${groupId}`);
        console.log(`user ${socket.id} joined group ${groupId}`);
        socket.emit('mySocketId', socket.id);
        socket.emit('handShakeAuth', socket.handshake.auth);
    });

    socket.on('chat.verse', async (data) => {
        console.log(data, 'pertanyaan yang diajukan<<');

        chats.push(data);

        try {
            const aiResponse = await getAIResponse(data.text);
            console.log(aiResponse, 'jawabanAI<<');

            const aiMessage = { text: aiResponse };
            chats.push(aiMessage);
            console.log(aiMessage, 'pesan yang disampaikan<<');

            io.emit('chat.verse', chats);
        } catch (error) {
            console.error('Error getting AI response:', error.message);
        }
    });
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
