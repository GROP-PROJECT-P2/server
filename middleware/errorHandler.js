const errorHandler = (err, req, res, next) => {
    console.error(err);

    if (err.name === 'badRequest') {
        return res.status(400).json({ message: err.message })
    }

    if (err.name === 'Unauthorized') {
        return res.status(401).json({ message: err.message })
    }

    if (err.name === 'Forbidden') {
        return res.status(403).json({ message: err.message })
    }

    if (err.name === 'notFound') {
        return res.status(404).json({ message: err.message })
    }
    
    if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({ message: err.errors[0].message });
    }

    res.status(500).json({
        message: 'Internal Server Error',
        error: err.message,
    });
}

module.exports = errorHandler;