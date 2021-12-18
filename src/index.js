const express = require('express')
const { connectToMongodb } = require('./db/mongoose')
const logger = require('./logger/index')
const Console = require('./logger/Console')
const { response } = require('./Common/response')

const app = express()

// Customize server
app.use(logger.logToFile)
app.use(logger.logger)
app.use(express.json())

// Routes
app.use('/tasks', require('./routes/tasks'))
app.use('/users', require('./routes/users'))

// Error handling
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
    response(res, error.message, {}, 400)
})

// Start server
connectToMongodb().then(() => {
    app.listen(process.env.PORT, () => {
        Console.log(`Server started on port ${process.env.PORT}`)
    })
}).catch((error) => {
    Console.log("Failed to start mongodb:", error.message)
})

// START   -------------------------------------------------------------- Populate task and users
// POPULATE TASK AND USERS
// const UserModel = require('./models/user')
// const TaskModel = require('./models/task')

// const main = async () => {
//     const task = await TaskModel.findById("61b50e1f9aed2f87f9919bc8")
//     await task.populate('owner')
//     console.log("owner:", task.owner)

//     const user = await UserModel.findById("61b517ab858e1b53382b63c0")
//     await user.populate('tasks')
//     console.log("Tasks:", user.tasks)
// }
// main()
// END     -------------------------------------------------------------- Populate task and users