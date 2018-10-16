// const MongoClient = require('mongodb').MongoClient;
// const MongoClient = require('mongodb');
const {MongoClient, ObjectID} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true}, (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp')

  // deleteMany
  // db.collection('Todos').deleteMany({text: "Eat lunch"}).then((result) => {
  //   console.log(result)
  // });


  // deleteOne
  // db.collection('Todos').deleteOne({text: "eat lunch"}).then((result) => {
  //     console.log(result)
  // });

  // findOneAndDelete
  // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
  //   console.log(result)
  // })


  db.collection('Users').findOneAndDelete({_id: new ObjectID('5bb74bacfa20f9aa5d56130f')}).then((result) => {
    console.log(result)
  })
  client.close();
})