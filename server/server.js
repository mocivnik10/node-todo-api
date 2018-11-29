require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');
const { UserRating } = require('./models/rating');
const { authenticate } = require('./middleware/authenticate');

const app = express();
const port = '3000';
// const port = process.env.PORT;
// console.log('PORT: ', process.env)

app.use(bodyParser.json());

app.post('/todos', authenticate, async (req, res) => {
  let todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  try {
    let doc = await todo.save();
    res.send(doc);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get('/todos', authenticate, async (req, res) => {
  try {
    let todos = await Todo.find({ _creator: req.user._id });
    res.send({ todos });
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get('/todos/:id', authenticate, async (req, res) => {
  let id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  try {
    let todo = await Todo.findOne({ _id: id, _creator: req.user._id });
    if (!todo) {
      return res.status(404).send();
    }
    res.send({ todo });
  } catch (e) {
    return res.status(400).send(e);
  }
});

app.delete('/todos/:id', authenticate, async (req, res) => {
  let id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  try {
    let todo = await Todo.findOneAndRemove({ _id: id, _creator: req.user._id });
    if (!todo) {
      return res.status(404).send();
    }
    res.send({ todo });
  } catch (e) {
    return res.status(400).send(e);
  }
});

app.patch('/todos/:id', authenticate, async (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  try {
    let todo = await Todo.findOneAndUpdate(
      { _id: id, _creator: req.user._id },
      { $set: body },
      { new: true }
    );
    if (!todo) {
      return res.status(404).send();
    }
    res.send({ todo });
  } catch (e) {
    res.status(400).send();
  }
});

app.post('/users', async (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);
  let user = new User(body);

  try {
    await user.save();
    let token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.post('/users/login', async (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);

  try {
    let user = await User.findByCredentials(body.email, body.password);
    let token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.delete('/users/me/token', authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.get('/users/:id', async (req, res) => {
  let id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  try {
    let user = await User.findById(id);
    if (!user) {
      return res.status(404).send();
    }
    res.send({ user });
  } catch (e) {
    return res.status(400).send(e);
  }
});

app.put('/users/me/update-password', authenticate, async (req, res) => {
  let id = req.user._id;
  let body = _.pick(req.body, ['password', 'confirmationpass']);
  try {
    let user = await User.findById(id);
    if (!user || body.password !== body.confirmationpass) {
      return res.status(404).send();
    }

    user.password = body.password;
    await user.save();
    let token = await user.generateAuthToken();
    res.header('x-auth', token).send({ user });
  } catch (e) {
    res.status(400).send(e);
  }
});

app.post('/users/:id/like', authenticate, async (req, res) => {
  try {
    let user_id = req.user._id;
    let liked_user_id = req.params.id;
    let like = await UserRating.findOne({
      _user: user_id,
      _liked_user: liked_user_id
    });
    if (like) {
      return res.status(400).send();
    } else if (!ObjectID.isValid(liked_user_id)) {
      return res.status(404).send();
    }

    let rating = new UserRating({
      _user: user_id,
      _liked_user: liked_user_id
    });

    let doc = await rating.save();
    res.send(doc);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {
  app
};
