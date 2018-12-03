const express = require('express');
const router = express.Router();

const todo_controller = require('../controllers/todoController');
const { authenticate } = require('./../middleware/authenticate');

router.post('/todos', authenticate, todo_controller.create_todo);
router.get('/todos', authenticate, todo_controller.get_todos);
router.get('/todos/:id', authenticate, todo_controller.get_todo_by_id);
router.delete('/todos/:id', authenticate, todo_controller.delete_todo);
router.patch('/todos/:id', authenticate, todo_controller.update_todo);

module.exports = router;
