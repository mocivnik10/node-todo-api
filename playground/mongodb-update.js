// const MongoClient = require('mongodb').MongoClient;
// const MongoClient = require('mongodb');
const {MongoClient, ObjectID} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true}, (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp')

  // db.collection('Todos').findOneAndUpdate(
  //   {_id: new ObjectID('5bc5c9394a8d9df3de0df2f6')},
  //   {$set: {completed: true}},
  //   {returnOriginal: false}
  // ).then((result) => {
  //   console.log(result)
  // })

  db.collection('Users').findOneAndUpdate(
    {_id: new ObjectID('5bb74ba1584f98aa51c32912')},
    {$set: {name: 'Michaelangelooo'}, $inc: {age: 1}},
    {returnOriginal: false}
  ).then((result) => {
    console.log(result)
  })

  client.close();
})