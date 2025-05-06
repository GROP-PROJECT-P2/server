const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    if (err.name === 'HttpError') {
        res.status(err.status).json({ message: err.message })
    } else if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
        res.status(400).json({ message: err.errors[0].message });
    } else {
        res.status(500).json({
            message: 'Internal Server Error',
            error: err.message,
        });
    }
}

module.exports = errorHandler;