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
    //CREATE
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

    db.collection('users').insertMany([
        {
            name: 'Minhaj Ahmad Khan',
            age: 25,
        },
        {
            name: 'Urooj Ahmad',
            age: 23
        }
    ], (error, result) => {
        if (error) {
            return console.log(error);
        }
        console.log(result.ops);
    });

    db.collection('tasks').insertMany([
        {
            description: 'Start Learning MongoDB',
            completed: true,
        },
        {
            description: 'Master MongoDB',
            completed: false
        }
    ], (error, result) => {
        if (error) {
            return console.log(error);
        }
        console.log(result.ops);
    });

    //READ
    db.collection('users').findOne({ name: 'Mohd Shad Mirza' }, (error, user) => {
        if (error) {
            console.log(error);
        }
        console.log(user);
    });
    db.collection('users').findOne({ _id: new ObjectID("5ca411d7effa2205f09667b6") }, (error, user) => {
        if (error) {
            console.log(error);
        }
        console.log(user);
    });
    db.collection('users').find({ age: 23 }).toArray((error, users) => {
        console.log(users);
    });
    db.collection('users').find({ age: 23 }).count((error, count) => {
        console.log(count);
    });

    //UPDATE
    db.collection('users').updateOne({
        _id: new ObjectID("5ca411d7effa2205f09667b5")
    }, {
            $set: {
                name: 'Shweta'
            }
        }).then((result) => {
            console.log('result update', result);
        }).catch((error) => {
            console.log(error);
        });

    db.collection('users').updateOne({
        _id: new ObjectID("5ca411d7effa2205f09667b5")
    }, {
            $inc: {
                age: 10 //increment
            }
        }).then((result) => {
            console.log('result update', result);
        }).catch((error) => {
            console.log(error);
        });

    db.collection('tasks').updateMany({
        completed: false
    }, {
            $set: {
                completed: true
            }
        }).then((result) => {
            console.log('result update', result);
        }).catch(error => console.log(error));

    //DELETE
    db.collection('users').deleteMany({ age: 23 })
        .then(result => console.log(result))
        .catch(error => console.log(error));

    db.collection('tasks').deleteOne({ description: 'Learning Crud' })
        .then(result => console.log(result))
        .catch(error => console.log(error));
});