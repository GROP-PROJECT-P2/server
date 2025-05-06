const { verifyToken } = require("../helpers/jwt")

const authentication = (req, res, next) => {
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

        console.log(isToken.id)
        
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = authentication