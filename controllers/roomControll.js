const { Room } = require('../models/roomModel.js');

module.exports = class RoomController {
    static async getRooms(req, res, next) {
        try {
            const rooms = await Room.findAll();
            res.status(200).json(rooms);
        } catch (error) {
            next(error);
        }
    }
}