const { ObjectID } = require('mongodb');
const _ = require('lodash');

const { User } = require('./../models/user');

exports.create_user = async (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);
  let user = new User(body);

  try {
    await user.save();
    let token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
};

exports.login_user = async (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);

  try {
    let user = await User.findByCredentials(body.email, body.password);
    let token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
};

exports.delete_user = async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch (e) {
    res.status(400).send(e);
  }
};

exports.get_me = async (req, res) => {
  res.send(req.user);
};

exports.get_user = async (req, res) => {
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
};

exports.change_password = async (req, res) => {
  let id = req.user._id;
  let body = _.pick(req.body, ['password', 'confirmationpass']);
  try {
    let user = await User.findById(id);
    if (!user || body.password !== body.confirmationpass) {
      return res.status(404).send();
    }

    user.password = body.password;
    await user.save();
    res.send({ user });
  } catch (e) {
    res.status(400).send(e);
  }
};
