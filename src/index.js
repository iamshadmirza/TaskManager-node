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

app.post('/users', (req, res) => {
    const user = new User(req.body);
    user.save()
        .then(() => { res.status(201).send(user) })
        .catch((error) => res.status(400).send(error));
});

app.get('/users', (req, res) => {
    User.find({})
        .then((users) => {
            res.send(users);
        })
        .catch((error) => {
            res.status(500).send();
        })
});

app.get('/users/:id', (req, res) => {
    const _id = req.params.id;
    User.findById(_id)
        .then((user) => {
            if (!user) {
                return res.status(404).send();
            }
            res.send(user);
        })
        .catch((error) => res.status(500).send(error));
});

app.post('/tasks', (req, res) => {
    const task = new Tasks(req.body);
    task.save()
        .then(() => {
            res.status(201).send(task);
        })
        .catch(error => res.status(400).send(error));
})