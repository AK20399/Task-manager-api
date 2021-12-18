const fs = require('fs')
const path = require('path')
const morgan = require('morgan')

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, '../logs/access.log'),
    {
        flags: 'a',
    }
)

module.exports = {
    logToFile: morgan(':status :method :url :response-time ms', { stream: accessLogStream }),
    logger: morgan(':status :method :url :response-time ms'),
}
