const mongoose = require('mongoose')

module.exports = {
    connectToMongodb: () =>
        mongoose.connect(`${process.env.MONGO_URL}task-manager-api`, {
            useNewUrlParser: true,
            autoIndex: true,
        })
}
