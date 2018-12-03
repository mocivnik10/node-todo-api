const express = require('express');
const router = express.Router();

const users_controller = require('../controllers/usersController');
const { authenticate } = require('./../middleware/authenticate');

router.post('/users', users_controller.create_user);
router.post('/users/login', users_controller.login_user);
router.delete('/users/me/token', authenticate, users_controller.delete_user);
router.get('/users/me', authenticate, users_controller.get_me);
router.get('/users/:id', users_controller.get_user);
router.patch(
  '/users/me/update-password',
  authenticate,
  users_controller.change_password
);

module.exports = router;
