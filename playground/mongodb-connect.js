// const MongoClient = require('mongodb').MongoClient;
// const MongoClient = require('mongodb');
const {MongoClient, ObjectID} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true}, (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp')

  // db.collection('Todos').insertOne({
  //   text: 'something to do',
  //   completed: false
  // }, (err, results) => {
  //   if (err) {
  //     return console.log('Unable to insert todo:', err);
  //   }
  //   console.log(JSON.stringify(results.ops, undefined, 2));
  // })

  // db.collection('Users').insertOne({
  //   name: 'Iztok',
  //   age: 26,
  //   location: 'Celje'
  // }, (err, results) => {
  //   if (err) {
  //     return console.log('Unable to insert user', err)
  //   }
  //   console.log(JSON.stringify(results.ops, undefined, 2));
  // })

  client.close();
})