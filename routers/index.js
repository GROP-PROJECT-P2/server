const express = require('express')
const router = express.Router()
const RoomController = require('../controllers/roomControll.js')
const UserController = require('../controllers/userControll.js')
const errorHandler = require('../middleware/errorHandler.js')

router.get('/', (req, res) => {
    res.json({ message: 'Hello World!' })
})

router.post("/register", UserController.register);
router.post("/login", UserController.login);

router.get("/rooms", RoomController.getRooms);

router.use(errorHandler)

module.exports = router