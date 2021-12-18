const mongoose = require('mongoose')

module.exports = {
    connectToMongodb: () =>
        mongoose.connect(`${process.env.MONGO_URL}`, {
            useNewUrlParser: true,
            autoIndex: true,
        })
}
