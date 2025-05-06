const { comparePassword } = require('../helpers/bcrypt');
const { signToken } = require('../helpers/jwt');
const { User } = require('../models')

module.exports = class UserController {
    static async register(req, res, next) {
        try {
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
            const { email, password } = req.body
            if (!email) {
                next({ name: 'HttpError', status: 400, message: "Email is required" })
            }
            if (!password) {
                next({ name: 'HttpError', status: 400, message: "Password is required" })
            }
            const user = await User.findOne({ where: { email } })
            if (!user) {
                next({ name: 'HttpError', status: 401, message: "Invalid email/password" })
            }
            const isValidPassword = comparePassword(password, user.password)
            if (!isValidPassword) {
                next({ name: 'HttpError', status: 401, message: "Invalid email/password" })
            }
            const access_token = signToken({ id: user.id })
            res.status(200).json({ access_token })
        } catch (err) {
            console.error(err);
            next(err);
        }
    }
}