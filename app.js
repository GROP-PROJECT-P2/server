require('dotenv').config();
const express = require('express')
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");
const { getAIResponse } = require("./helpers/openAI");

const app = express()
const port = 3000

const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const cors = require('cors')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

// app.use('/', require('./routers'))

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

const chats = [{ text: "hello" }];

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.emit("chat.verse", chats);

  socket.on("chat.verse", async (data) => {
    console.log(data, "pertanyaan yang diajukan<<");

    chats.push(data);

    const aiResponse = await getAIResponse(data.text);
    console.log(aiResponse, "jawabanAI<<");

    const aiMessage = { text: aiResponse };
    chats.push(aiMessage);
    console.log(aiMessage, "pesan yang disampaikan<<");

    io.emit("chat.verse", chats);
  });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
