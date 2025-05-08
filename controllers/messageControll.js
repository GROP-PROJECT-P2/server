const { Message, RoomUser, User, Room } = require('../models');
const { getAIResponse } = require('../helpers/openAI');

const chats = [{ text: "hello" }];

module.exports = class MessageController {
    static async getChats(req, res, next) {
        try {
            res.status(200).json(chats);
        } catch (error) {
            next(error);
        }
    }

    static async sendMessageAI(req, res, next) {
        try {
            const { text } = req.body;

            if (!text || text.trim() === '') {
                throw { name: 'badRequest', message: 'Message text is required' };
            }

            const userMessage = { text: text.trim() };
            chats.push(userMessage);

            const aiResponse = await getAIResponse(text);
            const aiMessage = { text: aiResponse };
            chats.push(aiMessage);

            const io = req.app.get('io');
            if (io) {
                io.emit('chat.verse', chats);
            }

            res.status(201).json({ userMessage, aiMessage });
        } catch (error) {
            next(error);
        }
    }

    static async sendMessage(req, res, next) {
        try {
            const { groupId } = req.params;
            const { content } = req.body;

            if (!content || content === '') {
                throw { name: 'badRequest', message: 'Message is required' };
            }

            const room = await Room.findByPk(groupId);

            if (!room) {
                throw { name: 'notFound', message: 'Room not found' };
            }

            const checkMember = await RoomUser.findOne({
                where: {
                    RoomId: groupId,
                    UserId: req.user.id,
                },
            });

            if (!checkMember) {
                throw { name: 'Forbidden', message: 'You are not a member of this room' };
            }

            const newMessage = await Message.create({
                content,
                RoomId: groupId,
                isBot: false,
                UserId: req.user.id,
            });

            const io = req.app.get('io');
            io.to(`group_${groupId}`).emit(`newMessage`, newMessage);

            res.status(201).json(newMessage);
        } catch (error) {
            next(error);
        }
    }

    static async getMessage(req, res, next) {
        try {
            const { groupId } = req.params;

            const checkMember = await RoomUser.findOne({
                where: {
                    RoomId: groupId,
                    UserId: req.user.id,
                },
            });

            if (!checkMember) {
                throw { name: 'Forbidden', message: 'You are not a member of this room' };
            }

            const messages = await Message.findAll({
                where: {
                    RoomId: groupId,
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

    static async deleteMessage(req, res, next) {
        try {
            const { groupId, messageId } = req.params;

            const checkMember = await RoomUser.findOne({
                where: {
                    RoomId: groupId,
                    UserId: req.user.id,
                },
            });

            if (!checkMember) {
                throw { name: 'Forbidden', message: 'You are not a member of this room' };
            }

            const message = await Message.findOne({
                where: {
                    id: messageId,
                    RoomId: groupId,
                },
            });

            if (!message) {
                throw { name: 'notFound', message: 'Message not found' };
            }

            await Message.destroy({
                where: {
                    id: messageId,
                },
            });

            res.status(200).json({ message: 'Message deleted successfully' });
        } catch (error) {
            next(error);
        }
    }

    static async updateMessage(req, res, next) {
        try {
            const { groupId, messageId } = req.params;
            const { content } = req.body;

            const checkMember = await RoomUser.findOne({
                where: {
                    RoomId: groupId,
                    UserId: req.user.id,
                },
            });

            if (!checkMember) {
                throw { name: 'Forbidden', message: 'You are not a member of this room' };
            }

            const message = await Message.findOne({
                where: {
                    id: messageId,
                    RoomId: groupId,
                },
            });

            if (!message) {
                throw { name: 'notFound', message: 'Message not found' };
            }

            const updatedMessage = await Message.update(
                {
                    content,
                },
                {
                    where: {
                        id: messageId,
                    },
                    returning: true,
                }
            );

            res.status(200).json(updatedMessage[1][0]);

        } catch (error) {
            next(error);
        }
    }
}