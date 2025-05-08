const crypto = require('crypto');
const { RoomUser, Room } = require('../models');

module.exports = class RoomController {
    static async getRooms(req, res, next) {
        try {
            const room = await RoomUser.findAll({
                where: {
                    UserId: req.user.id
                },
                include: [{
                    model: Room
                }]
            })

            if (room.length === 0) {
                throw { name: 'notFound', message: 'No Room found for this user' };
            }

            res.status(200).json(room)
        } catch (err) {
            next(err);
        }
    }

    static async createRoom(req, res, next) {
        try {
            const { name } = req.body;
            const userId = req.user.id;

            if (!name) {
                throw { name: "badRequest", message: "Room name is required" };
            }

            const inviteCode = crypto.randomBytes(4).toString("hex");

            const room = await Room.create({
                name,
                inviteCode,
                createdBy: userId
            });

            await RoomUser.create({
                UserId: userId,
                RoomId: room.id,
                role: "admin"
            });

            res.status(201).json({ message: "Room created", room });
        } catch (error) {
            next(error);
        }
    }

    static async shareRoom(req, res, next) {
        try {
            const { inviteCode } = req.params;
            const userId = req.user.id;

            const room = await Room.findOne({ where: { inviteCode } });

            if (!room) {
                throw { name: "notFound", message: "Room not found" };
            }

            const isMember = await RoomUser.findOne({
                where: { RoomId: room.id, UserId: userId }
            });

            if (isMember) {
                throw { name: "badRequest", message: "You are already a member of this Room." };
            }

            await RoomUser.create({
                RoomId: room.id,
                UserId: userId,
                role: "member"
            });

            return res.status(200).json({
                message: "Successfully joined the room.",
                room: {
                    id: room.id,
                    name: room.name
                }
            });
        } catch (err) {
            next(err)
        }
    }
}