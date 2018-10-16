// const MongoClient = require('mongodb').MongoClient;
// const MongoClient = require('mongodb');
const {MongoClient, ObjectID} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true}, (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp')

  db.collection('Todos').find({_id: new ObjectID('5bc5c4534a8d9df3de0df20b')}).toArray().then((docs) => {
    console.log('Todos')
    console.log(JSON.stringify(docs, undefined, 2))
  }, (err) => {
    console.log('Unable to fetch todos', err)
  })

  db.collection('Todos').find().count().then((count) => {
    console.log(`Todos count: ${count}`)
    console.log('----------------------------------------------')
  }, (err) => {
    console.log('Unable to fetch todos', err)
  })
  
  db.collection('Users').find({name: 'Iztok'}).toArray().then((docs) => {
    console.log('Users')
    console.log(JSON.stringify(docs, undefined, 2))
  }, (err) => {
    console.log('Unable to fetch users', err)
  })
  
  client.close();
})