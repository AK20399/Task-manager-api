const response = (res, message = '', data = {}, status = 200) => {
    return res.status(status).json({ message, data })
}

module.exports = {
    response
}