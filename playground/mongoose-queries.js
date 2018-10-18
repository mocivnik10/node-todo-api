const {ObjectID} = require('mongodb')
const {mongoose} = require('./../server/db/moongose')
const {Todo} = require('./../server/models/todo')
const {User} = require('./../server/models/user')

var id = '5bc86f81db73d81430d21d3d';
var uid = '5bc6de04bfc7cb4b7b6bfd3c';

if (!ObjectID.isValid(uid)) {
  console.log('Id not valid')
}

// Todo.findById({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos)
// })

// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('todo', todo)
// })

// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     return console.log('Id not found')
//   }
//   console.log('todo by id: ', todo)
// }).catch((e) => console.log(e))

User.findById(uid).then((user) => {
  if (!user) {
    return console.log('User not found')
  }
  console.log('User: ', user)
}).catch((e) => console.log(e))