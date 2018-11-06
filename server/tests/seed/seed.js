const {ObjectID} = require('mongodb')
const jwt = require('jsonwebtoken')

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user')

const userOneId = new ObjectID()
const userTwoId = new ObjectID()

const users = [{
  _id: userOneId,
  email: 'iztok@example.com',
  password: '1234pass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
  }]
}, {
  _id: userTwoId,
  email: 'mocivnik@example.com',
  password: '1234pass'
}]

const todos = [
  {text: 'First text todo'},
  {text: 'Second text todo', _id: new ObjectID('5bb74bacfa20f9aa5d56130f')}
]

const populateTodos = (done) => {
  Todo.deleteMany({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
}

const populateUsers = (done) => {
  User.deleteMany({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo])
  }).then(() => done())
}

module.exports = {
  todos,
  populateTodos,
  users,
  populateUsers
}