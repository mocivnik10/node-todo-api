require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const { mongoose } = require('./db/mongoose');

const app = express();
const port = process.env.port;
app.use(bodyParser.json());

const todoRouter = require('./routes/todo');
const usersRouter = require('./routes/user');
const ratingsRouter = require('./routes/ratings');
app.use('/api/v1', todoRouter);
app.use('/api/v1', usersRouter);
app.use('/api/v1', ratingsRouter);

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {
  app
};
