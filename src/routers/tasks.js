const express = require('express');
const router = new express.Router();
const Task = require('../models/tasks');
const auth = require('../middleware/auth');

//create task
router.post('/tasks', auth, async (req, res) => {
    //const task = new Tasks(req.body);
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });
    try {
        await task.save()
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

//read tasks?completed=true
//read tasks?limit=10&skip=2
router.get('/tasks', auth, async (req, res) => {
    try {
        // const tasks = await Task.find({ owner: req.user._id });
        // res.send(tasks);

        //alternate way
        const match = {};
        if (req.query.completed) {
            match.completed = req.query.completed === 'true'
        }
        await req.user.populate('tasks', {
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
            }
        }).execPopulate();
        res.send(req.user.tasks);
    } catch (error) {
        res.status(500).send();
    }
});

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findOne({ _id, owner: req.user._id });
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (error) {
        res.status(500).send(error)
    }
});

//update tasks
router.patch('/tasks/:id', auth, async (req, res) => {
    const allowedUpdates = ['description', 'completed'];
    const updates = Object.keys(req.body);
    const isValideOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValideOperation) {
        return res.status(400).send({ 'error': 'Invalid Updates!' });
    }
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

        if (!task) {
            return res.status(404).send();
        }
        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();
        res.send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

//delete tasks
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;