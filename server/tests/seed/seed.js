const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');
const { UserRating } = require('./../../models/rating');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [
  {
    _id: userOneId,
    email: 'andrew@example.com',
    password: 'userOnePass',
    tokens: [
      {
        access: 'auth',
        token: jwt.sign({ _id: userOneId, access: 'auth' }, 'abc123').toString()
      }
    ],
    ratingCount: 0
  },
  {
    _id: userTwoId,
    email: 'jen@example.com',
    password: 'userTwoPass',
    tokens: [
      {
        access: 'auth',
        token: jwt.sign({ _id: userTwoId, access: 'auth' }, 'abc123').toString()
      }
    ],
    ratingCount: 1
  }
];

const todos = [
  {
    _id: new ObjectID(),
    text: 'First test todo',
    _creator: userOneId
  },
  {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333,
    _creator: userTwoId
  }
];

const userRatings = [
  {
    _id: new ObjectID(),
    _user: userOneId,
    _liked_user: userTwoId
  }
];

const populateTodos = async () => {
  await Todo.remove();
  await Todo.insertMany(todos);
};

const populateUsers = async () => {
  await User.remove({});
  let userOne = new User(users[0]).save();
  let userTwo = new User(users[1]).save();
  return Promise.all([userOne, userTwo]);
};

const populateRatings = async () => {
  await UserRating.remove({});
  let rating = new UserRating(userRatings[0]).save();
  return Promise.all([rating]);
};

module.exports = {
  todos,
  populateTodos,
  users,
  populateUsers,
  userRatings,
  populateRatings
};
