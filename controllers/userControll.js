const { comparePassword } = require('../helpers/bcrypt');
const { signToken } = require('../helpers/jwt');
const { User } = require('../models')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
                throw { name: 'Unauthorized', message: "Invalid username" }
            }

            const access_token = signToken({ id: user.id })

            res.status(200).json({ access_token, user })
        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    static async loginGoogle(req, res, next) {
        try {
            const { googleToken } = req.body;

            const ticket = await client.verifyIdToken({
                idToken: googleToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();

            let user = await User.findOne({ where: { email: payload.email } });

            if (!user) {
                user = await User.create({
                    username: payload.name,
                    email: payload.email,
                    avatarUrl: payload.picture
                });
            }

            const access_token = signToken({ id: user.id });
            return res.status(200).json({
                access_token,
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    avatarUrl: user.avatarUrl,
                }
            });

        } catch (err) {
            console.error(err);
            next(err);
        }
    }
}