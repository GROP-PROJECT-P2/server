const { RoomUser } = require('../models');

module.exports = class RoomController {
    static async getRooms(req, res, next) {
        try {
            const rooms = await Room.findAll();
            res.status(200).json(rooms);
        } catch (err) {
            next(err);
        }
    }

    static async createRoom(req, res, next) {
        try {
            const { name } = req.body;
            const newRoom = await Room.create({ name, description, price });

            const newRoomUser = await RoomUser.create({
                UserId: req.user.id,
                RoomId: newRoom.id,
            });
            
            res.status(201).json({ newRoom, newRoomUser });
        } catch (error) {
            next(error);
        }
    }
}