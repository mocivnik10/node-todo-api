const express = require('express');
const router = express.Router();

const ratings_controller = require('./../controllers/ratingsController');
const { authenticate } = require('./../middleware/authenticate');

router.post('/users/:id/like', authenticate, ratings_controller.create_like);
router.delete(
  '/users/:id/unlike',
  authenticate,
  ratings_controller.delete_like
);
router.get('/most-liked', ratings_controller.most_liked);

module.exports = router;
