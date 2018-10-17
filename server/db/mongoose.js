const moongose = require('mongoose');

moongose.Promise = global.Promise;
moongose.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true});

module.exports = {
  mongoose
}