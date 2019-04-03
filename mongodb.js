//CRUD Create Read Update Delete

const { MongoClient, ObjectID } = require('mongodb');

const connectionUrl = 'mongodb://127.0.0.1:27017';
const databaseName = 'taskmanager';

const id = new ObjectID();
console.log('id', id);
console.log('timestamp', id.getTimestamp());

MongoClient.connect(connectionUrl, { useNewUrlParser: true }, (error, client) => {
    if (error) { return console.log(error); }
    console.log('Connected correctly');
    const db = client.db(databaseName);
    db.collection('users').insertOne({
        _id: id,
        name: 'Aditya Kapoor',
        age: 24
    }, (error, result) => {
        if (error) {
            return console.log(error);
        }
        console.log(result.ops);
    });

    // db.collection('users').insertMany([
    //     {
    //         name: 'Minhaj Ahmad Khan',
    //         age: 25,
    //     },
    //     {
    //         name: 'Urooj Ahmad',
    //         age: 23
    //     }
    // ], (error, result) => {
    //     if (error) {
    //         return console.log(error);
    //     }
    //     console.log(result.ops);
    // });

    // db.collection('tasks').insertMany([
    //     {
    //         description: 'Start Learning MongoDB',
    //         completed: true,
    //     },
    //     {
    //         description: 'Master MongoDB',
    //         completed: false
    //     }
    // ], (error, result) => {
    //     if (error) {
    //         return console.log(error);
    //     }
    //     console.log(result.ops);
    // });
})