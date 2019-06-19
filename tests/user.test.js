const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/users');
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

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

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/driver.png')
        .expect(200);
    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Minhaj'
        })
        .expect(200);
    const user = await User.findById(userOneId);
    expect(user.name).toEqual('Minhaj');
});

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'India'
        })
        .expect(400);
});