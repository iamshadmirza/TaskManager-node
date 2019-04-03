//CRUD Create Read Update Delete

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const connectionUrl = 'mongodb://127.0.0.1:27017';
const databaseName = 'taskmanager';

MongoClient.connect(connectionUrl, { useNewUrlParser: true }, (error, client) => {
    if (error) { return console.log(error); }
    console.log('Connected correctly');
    const db = client.db(databaseName);
    db.collection('users').insertOne({
        name: 'Mohd Shad Mirza',
        age: 23
    });
})