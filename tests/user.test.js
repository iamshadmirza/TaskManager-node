const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/users');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: 'Urooj',
    email: 'urooj@test.com',
    age: 23,
    password: 'BabyMartinSch00l',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

beforeEach(async () => {
    await User.deleteMany();
    await new User(userOne).save();
});

test('Should signup a new user', async () => {
    let response = await request(app).post('/users').send({
        name: 'Shad',
        email: 'shad@test.com',
        password: 'TestP@ssw0rd101'
    }).expect(201);
    //assert that database has changed correctly
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();
    //assert that response has the matching fields
    expect(response.body).toMatchObject({
        user: {
            name: 'Shad',
            email: 'shad@test.com'
        },
        token: user.tokens[0].token
    });
    expect(user.password).not.toBe('MyPass777');
});

test('Should login existing user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200);
});

test('Should not login non existing user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'This is wrong password'
    }).expect(400);
});

test('Should get profile of user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
});

test('Should not get profile of unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401);
});

test('Should delete profile of user', async () => {
    let response = await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
    const user = await User.findById(userOneId);
    expect(user).toBeNull();
});

test('Should not delete profile of unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401);
});