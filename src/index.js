const express = require('express');
const app = express();
require('./db/mongoose');

const User = require('./models/users');
const Tasks = require('./models/tasks');

const port = process.env.PORT || 3000;
app.use(express.json());

app.listen(port, () => {
    console.log('Server is up on port ', port);
});

//create user
app.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

//read users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.status(201).send(users);
    } catch (error) {
        res.status(500).send();
    }
});

app.get('/users/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const user = await User.findById(_id);
        if (!user) { return res.status(404).send(); }
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

//read task
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Tasks.find({});
        res.send(tasks);
    } catch (error) {
        res.status(500).send();
    }
});

app.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await User.findById(_id);
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (error) {
        res.status(500).send(error)
    }
});

//create task
app.post('/tasks', async (req, res) => {
    const task = new Tasks(req.body);
    try {
        await task.save()
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});