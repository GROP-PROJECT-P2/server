const { Friend, User } = require('../models');

module.exports = class FriendController {
    static async getFriend(req, res, next) {
        try {
            const { UserId } = req.query;

            const whereClause = UserId ? { UserId } : {};
            const friends = await Friend.findAll({
                where: whereClause,
                include: [{
                    model: User,
                    attributes: ['id', 'username', 'avatar', 'status']
                }]
            });
            console.log(friends, "<<<<<<");

            if (!friends || friends.length === 0) {
                throw { name: 'notFound', message: 'No friends found' };
            }

            res.status(200).json({ friends });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    static async addFriend(req, res, next) {
        try {
            const { UserId, friendId } = req.body;

            if (!UserId || !friendId) {
                throw { name: 'badRequest', message: 'UserId and friendId are required' };
            }

            const newFriend = await Friend.create({ UserId, friendId });
            res.status(201).json({ message: 'Friend request sent', friend: newFriend });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    static async acceptFriend(req, res, next) {
        try {
            const { id } = req.params;

            const friendRequest = await Friend.findByPk(id);
            if (!friendRequest) {
                throw { name: 'notFound', message: 'Friend request not found' };
            }

            if (friendRequest.status === 'Accepted') {
                throw { name: 'badRequest', message: 'Friend request already accepted' };
            }

            friendRequest.status = 'Accepted';
            await friendRequest.save();

            res.status(200).json({ message: 'Friend request accepted', friend: friendRequest });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}