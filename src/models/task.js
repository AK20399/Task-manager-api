const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            required: true,
            trim: true,
            minlength: [6, 'Description must have atleast 6 characters'],
        },
        completed: {
            type: Boolean,
            default: false,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    },
    { timestamps: true, versionKey: false }
)

const TaskModel = mongoose.model('Task', TaskSchema)

module.exports = TaskModel
