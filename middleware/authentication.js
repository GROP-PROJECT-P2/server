const { verifyToken } = require("../helpers/jwt")
const { User } = require("../models")

const authentication = async (req, res, next) => {
    try {
        const { authorization } = req.headers

        if (!authorization) {
            throw { name: "Unauthorized", message: "Invalid token" }
        }

        const token = authorization.split(" ")[1]
        
        if (!token) {
            throw { name: "Unauthorized", message: "Invalid token" }
        }
        
        const isToken = verifyToken(token)

        if (!isToken) {
            throw { name: "Unauthorized", message: "Invalid token" }
        }

        const user = await User.findByPk(isToken.id, {
            attributes: { exclude: ["password"] },
        })
        
        if (!user) {
            throw { name: "Unauthorized", message: "Invalid token" }
        }

        req.user = user;

        // console.log(req.user, "ini req user di auth")
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = authentication