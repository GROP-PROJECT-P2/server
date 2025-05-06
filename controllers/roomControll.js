const { RoomUser, Room } = require('../models');

module.exports = class RoomController {
    static async getRooms(req, res, next) {
        try {
            const rooms = await Room.findAll({
                where: {
                    id: req.user.id,
                }
            });
            res.status(200).json(rooms);
        } catch (err) {
            next(err);
        }
    }

    static async createRoom(req, res, next) {
        try {
            const { name } = req.body;
            const newRoom = await Room.create({ name });

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