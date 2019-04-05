const express = require('express');

const app = express();
require('./db/mongoose');
const User = require('./models/users');

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