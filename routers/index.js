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

router.get("/rooms", RoomController.getRooms);
router.post("/rooms", RoomController.createRoom);

router.get("/friends", FriendController.getFriend);
router.post("/friends", FriendController.addFriend);
router.patch("/friends/:id", FriendController.acceptFriend);

router.post("/messages/:roomId", MessageController.sendMessage);
router.get("/messages/:roomId", MessageController.getMessage);
router.delete("/messages/:roomId/:messageId", MessageController.deleteMessage);
router.put("/messages/:roomId/:messageId", MessageController.updateMessage);

router.use(errorHandler)

module.exports = router