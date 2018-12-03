const { ObjectID } = require('mongodb');
const _ = require('lodash');

const { Todo } = require('./../models/todo');

exports.create_todo = async (req, res) => {
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
};

exports.get_todos = async (req, res) => {
  try {
    let todos = await Todo.find({ _creator: req.user._id });
    res.send({ todos });
  } catch (e) {
    res.status(400).send(e);
  }
};
exports.get_todo_by_id = async (req, res) => {
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
};

exports.delete_todo = async (req, res) => {
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
};

exports.update_todo = async (req, res) => {
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
};
