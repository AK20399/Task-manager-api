/* eslint-disable new-cap */
const express = require('express')
const sharp = require('sharp')
const auth = require('../middleware/auth')
const avatarUpload = require('../middleware/avatarUpload')
const User = require('../models/user')
const { response } = require('../Common/response')
const { sendWelcomeEmail, sendCancellationEmail } = require('../Common/email')

const router = express.Router()

// SIGN UP USER
router.post('/signup', async (req, res) => {
    try {
        const user = new User(req.body)
        const isUserExists = await User.findOne({ email: req.body.email })
        if (isUserExists) {
            return res.status(404).send("User already exists")
        }
        await user.save()
        await sendWelcomeEmail(user.name, user.email)
        const token = await user.generateAuthToken()
        return response(res, 'Sign up successful', { user, token }, 201)
    } catch (e) {
        return response(res, 'Error while signup', { error: e }, 400)
    }
})

// LOGIN USER
router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        return response(res, 'Login successful', { user, token })
    } catch (e) {
        return response(res, 'Login failed', { error: e.toString() }, 400)
    }
})

// LOGOUT USER
router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)
        await req.user.save()
        return response(res, `${req.user.name} with email ${req.user.email} logged out successfully`)
    } catch (e) {
        return response(res, 'Error occured while logging out', { error: e }, 400)
    }
})

// LOGOUT AND REMOVE ALL TOKENS
router.post('/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        return response(res, `All tokens for ${req.user.name} with email ${req.user.email} removed successfully`)
    } catch (e) {
        return response(res, 'Error occured while logging all out', { error: e }, 400)
    }
})

// CURRENT USER INFO
router.get('/', auth, async (req, res) =>
    response(res, 'Current user info', { data: req.user })
)

// Update current user
router.patch('/', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return response(res, 'Invalid updates', {}, 400)
    }

    try {
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })
        await req.user.save()
        return response(res, 'Updated user successfully', { data: req.user })
    } catch (e) {
        return response(res, 'Error occured while updating user', { error: e.toString() }, 400)
    }
})

// delete Current User
router.delete('/', auth, async (req, res) => {
    try {
        await req.user.remove()
        sendCancellationEmail(req.user.name, req.user.email)
        return response(res, `${req.user.name} deleted successfully`)
    } catch (e) {
        return response(res, 'Error occured while deleting user', { error: e }, 400)
    }
})

// Get avatar
router.get('/avatar/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error('Didn\'t find user or avatar of user')
        }
        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    } catch (e) {
        return response(res, 'Error occured', { error: e.message }, 400)
    }
})

// Add avatar and delete
router.route('/avatar').post(auth, avatarUpload, async (req, res) => {
    try {
        const imageBuffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
        req.user.avatar = imageBuffer
        await req.user.save()
        return response(res, 'Profile picture updated')
    } catch (e) {
        return response(res, 'Failed to update profile picture', { error: e.message }, 400)
    }
}).delete(auth, async (req, res) => {
    try {
        if (req.user.avatar) {
            req.user.avatar = undefined
            await req.user.save()
            return response(res, 'Deleted profile picture')
        }
        return response(res, 'No profile picture found to delete')
    } catch (e) {
        return response(res, 'Failed to update profile picture', { error: e.message }, 400)
    }
})

module.exports = router
