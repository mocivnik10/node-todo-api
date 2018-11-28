const { User } = require('./../models/user');

let authenticate = async (req, res, next) => {
  let token = req.header('x-auth');

  try {
    let user = await User.findByToken(token);
    if (!user) {
      throw new Error(404);
    }
    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    res.status(404).send(e);
  }
};

module.exports = {
  authenticate
};
