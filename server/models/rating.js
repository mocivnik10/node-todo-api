const mongoose = require('mongoose');

const UserRating = mongoose.model('UserRating', {
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  _liked_user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

module.exports = { UserRating };
