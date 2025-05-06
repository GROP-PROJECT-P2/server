const { comparePassword } = require('../helpers/bcrypt');
const { signToken } = require('../helpers/jwt');
const { User } = require('../models')

module.exports = class UserController {
    static async register(req, res, next) {
        try {
            const { password, confirmPassword } = req.body

            if (confirmPassword !== password) {
                throw { name: 'badRequest', message: "Password and confirm password must be the same" }
            }

            if (!confirmPassword) {
                throw { name: 'badRequest', message: "Confirm password is required" }
            }
            
            const user = await User.create(req.body);

            res.status(201).json({
                id: user.id,
                username: user.username,
                email: user.email,
            });

        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    static async login(req, res, next) {
        try {
            const { username } = req.body
            if (!username) {
                throw { name: 'badRequest', message: "Username is required" }
            }

            const user = await User.findOne({ 
                where: { 
                    username 
                },
                attributes: { exclude: ['createdAt', 'updatedAt', 'password'] }
            })
            
            if (!user) {
                throw { name: 'Unauthorize', message: "Invalid username" }
            }

            const access_token = signToken({ id: user.id })

            res.status(200).json({ access_token, user })
        } catch (err) {
            console.error(err);
            next(err);
        }
    }
}