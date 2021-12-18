const express = require('express')
// eslint-disable-next-line new-cap
const router = express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')
const { response } = require('../Common/response')

router.use(auth)

// Get all tasks and create Tasks
router
    .route('/')
    .get(async (req, res) => {
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 2
        const pageNo = req.query.pageNo ? (parseInt(req.query.pageNo) - 1) * pageSize : 0
        try {
            // First Method
            // req.user.tasks = await Task.find({}).limit(pageSize).skip(pageNo)

            // Second Method
            const match = {}
            const sort = {}
            if (req.query.completed) {
                match.completed = req.query.completed === 'true' || req.query.completed === 'TRUE'
            }
            if (req.query.sortBy) {
                const [fieldName, sortBy] = req.query.sortBy.split('_')
                sort[fieldName] = sortBy === 'desc' ? -1 : 1
            }
            await req.user.populate({
                path: 'tasks', match, options: {
                    limit: pageSize,
                    skip: pageNo,
                    sort
                }
            })
            return response(res, `All tasks for user ${req.user.name}`, req.user.tasks)
        } catch (e) {
            return response(res, "Failed to get all tasks", { error: e.message }, 400)
        }

    })
    .post(async (req, res) => {
        try {
            const task = new Task({ ...req.body, owner: req.user._id })
            await task.save()
            return response(res, 'Task created successfully', task, 201)
        } catch (e) {
            return response(res, "Failed to create task", { error: e }, 400)
        }
    })

// Get specific task
router.get('/:id', async (req, res) => {
    try {
        const _id = req.params.id
        const task = await Task.findOne({ _id, owner: req.user._id })
        if (!task) {
            return response(res, 'Failed to fetch task', {}, 400)
        }
        return response(res, 'Fetched task successfully', task)
    } catch (e) {
        return response(res, 'Failed to fetch task', { error: e }, 400)
    }
})

// update specific task
router.patch('/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return response(res, "Failed to update task", { error: 'Invalid updates' }, 400)
    }
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

        updates.forEach((update) => {
            task[update] = req.body[update]
        })
        await task.save()

        if (!task) {
            return response(res, "Couldnt find task", {}, 404)
        }
        return response(res, "Updated task successfully", task)
    } catch (e) {
        return response(res, "Failed to update task", { error: e }, 400)

    }
})

router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!task) {
            return response(res, "Couldnt find task", {}, 404)
        }
        return response(res, "Deleted task successfully", task)
    } catch (e) {
        return response(res, "Failed to delete task", { error: e }, 400)
    }
})

module.exports = router
