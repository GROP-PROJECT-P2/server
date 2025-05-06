const { Message, RoomUser, User } = require('../models');

module.exports = class MessageController {
    static async sendMessage(req, res, next) {
        try {
            const { roomId } = req.params;
            const { content } = req.body;

            if (!content || content === '') {
                throw { name: 'badRequest', message: 'Message is required' };
            }

            const checkMember = await RoomUser.findOne({
                where: {
                    RoomId: roomId,
                    UserId: req.user.id,
                },
            });

            if (!checkMember) {
                throw { name: 'Forbidden', message: 'You are not a member of this room' };
            }

            const newMessage = await Message.create({
                content,
                RoomId: roomId,
                isBot: false,
                UserId: req.user.id,
            });

            res.status(201).json(newMessage);
        } catch (error) {
            next(error);
        }
    }

    static async getMessage(req, res, next) {
        try {
            const { roomId } = req.params;

            const checkMember = await RoomUser.findOne({
                where: {
                    RoomId: roomId,
                    UserId: req.user.id,
                },
            });

            if (!checkMember) {
                throw { name: 'Forbidden', message: 'You are not a member of this room' };
            }

            const messages = await Message.findAll({
                where: {
                    RoomId: roomId,
                },
                include: [
                    {
                        model: User,
                        attributes: ['id', 'username'],
                    },
                ],
                order: [['createdAt', 'ASC']],
            });

            res.status(200).json(messages);
        } catch (error) {
            next(error);
        }
    }
}