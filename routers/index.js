const express = require('express')
const router = express.Router()
const RoomController = require('../controllers/roomControll.js')
const UserController = require('../controllers/userControll.js')
const errorHandler = require('../middleware/errorHandler.js')
const authentication = require('../middleware/authentication.js')
const MessageController = require('../controllers/messageControll.js')
const FriendController = require('../controllers/friendControll.js')

router.get('/', (req, res) => {
    res.json({ message: 'Hello World!' })
})

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/login/google", UserController.loginGoogle);

router.use(authentication)

router.get("/groups", RoomController.getRooms);
router.post("/groups", RoomController.createRoom);
router.get('/groups/join/:inviteCode', RoomController.shareRoom)

router.get("/friends", FriendController.getFriend);
router.post("/friends", FriendController.addFriend);
router.patch("/friends/:id", FriendController.acceptFriend);

router.post("/groups/:groupId", MessageController.sendMessage);
router.get("/groups/:groupId", MessageController.getMessage);
router.delete("/groups/:groupId/:messageId", MessageController.deleteMessage);
router.put("/groups/:groupId/:messageId", MessageController.updateMessage);

router.get('/chats', MessageController.getChats);
router.post('/chats', MessageController.sendMessageAI);

router.use(errorHandler)

module.exports = router