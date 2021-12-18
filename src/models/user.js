const validator = require('validator')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Task = require('./task')

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required field'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required field'],
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Email is invalid')
                }
            },
        },
        password: {
            type: String,
            required: [true, 'Password is required field'],
            minlength: [
                6,
                'Minimum password length is 6 and {VALUE} doesnt match that',
            ],
            trim: true,
            validate(value) {
                if (value.toLowerCase().includes('password')) {
                    throw new Error('Password cant contain value password')
                }
            },
        },
        age: {
            type: Number,
            default: 0,
            validate(value) {
                if (value < 0) {
                    throw new Error('Age must be positive number')
                }
            },
        },
        tokens: [{ token: { type: String } }],
        avatar: {
            type: Buffer
        }
    },
    { timestamps: true, versionKey: false, }
)

UserSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner',
})

UserSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.TOKEN_KEY)
    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

UserSchema.methods.toJSON = function () {
    const user = this.toObject()

    delete user.password
    delete user.tokens
    delete user.avatar

    return user
}

UserSchema.statics.findByCredentials = async (email, password) => {
    try {
        const user = await User.findOne({ email })

        if (!user) {
            throw new Error('Unable to login')
        }
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            throw new Error('Unable to login')
        }

        return user
    } catch (error) {
        throw new Error(error.message)
    }

}

UserSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

UserSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})

const User = mongoose.model('User', UserSchema)

module.exports = User
