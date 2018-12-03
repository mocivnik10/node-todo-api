const { ObjectID } = require('mongodb');
const _ = require('lodash');

const { UserRating } = require('./../models/rating');
const { User } = require('./../models/user');

exports.create_like = async (req, res) => {
  try {
    let user_id = req.user._id;
    let liked_user_id = req.params.id;
    let liked_user = await User.findById(liked_user_id);
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

    liked_user.ratingCount = liked_user.ratingCount + 1;
    await liked_user.save();
    let doc = await rating.save();
    res.send(doc);
  } catch (e) {
    res.status(400).send(e);
  }
};

exports.delete_like = async (req, res) => {
  try {
    let user_id = req.user._id;
    let liked_user_id = req.params.id;
    let liked_user = await User.findById(liked_user_id);
    let like = await UserRating.findOneAndRemove({
      _user: user_id,
      _liked_user: liked_user_id
    });
    if (!like) {
      res.status(404).send();
    }

    liked_user.ratingCount = liked_user.ratingCount - 1;
    await liked_user.save();
    res.send({ like });
  } catch (error) {
    res.status(400).send();
  }
};

exports.most_liked = async (req, res) => {
  try {
    let users = await User.find({})
      .where('ratingCount')
      .gt(0)
      .sort('-ratingCount');
    if (users.length === 0) {
      return res.status(404).send();
    }
    res.send({ users });
  } catch (e) {
    res.status(400).send(e);
  }
};
