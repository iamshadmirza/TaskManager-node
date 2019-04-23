const express = require('express');
const router = new express.Router();
const User = require('../models/users');
const auth = require('../middleware/auth');

//create user
router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
});

//login user
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (error) {
        res.status(400).send();
    }
});

//logout user
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        });
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send();
    }
});

//logout all session
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send();
    }
});

//read user
router.get('/users/me', auth, async (req, res) => {
    res.status(200).send(req.user);
});

// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id;
//     try {
//         const user = await User.findById(_id);
//         if (!user) { return res.status(404).send(); }
//         res.send(user);
//     } catch (error) {
//         res.status(500).send(error);
//     }
// });

//update user
router.patch('/users/me', auth, async (req, res) => {
    const allowedUpdates = ['name', 'email', 'age', 'password'];
    const updates = Object.keys(req.body);
    const isValideOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValideOperation) {
        return res.status(400).send({ 'error': 'Invalid Updates!' });
    }
    try {
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();
        res.send(req.user);
    } catch (error) {
        res.status(400).send(error);
    }
});

//delete user
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        res.send(req.user);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;