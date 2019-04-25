const express = require('express');
const router = new express.Router();
const Tasks = require('../models/tasks');
const auth = require('../middleware/auth');

//create task
router.post('/tasks', auth, async (req, res) => {
    //const task = new Tasks(req.body);
    const task = new Tasks({
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

//read task
router.get('/tasks', auth, async (req, res) => {
    try {
        // const tasks = await Tasks.find({ owner: req.user._id });
        // res.send(tasks);

        //alternate way
        await req.user.populate('tasks').execPopulate();
        res.send(req.user.tasks);
    } catch (error) {
        res.status(500).send();
    }
});

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Tasks.findOne({ _id, owner: req.user._id });
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
        const task = await Tasks.findOne({ _id: req.params.id, owner: req.user._id });

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
        const task = await Tasks.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;