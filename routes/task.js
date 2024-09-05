const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const User = require('../models/User');

// Create a new task for a user
router.post('/:user_id/tasks', async (req, res) => {
  try {
    const user = await User.findById(req.params.user_id);
    if (!user) return res.status(404).send('User not found');

    const task = new Task({ ...req.body, user: user._id });
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

// List all tasks for a user
router.get('/:user_id/tasks', async (req, res) => {
  const tasks = await Task.find({ user: req.params.user_id });
  res.send(tasks);
});

// Update a task
router.put('/:user_id/tasks/:task_id', async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.task_id, req.body, { new: true, runValidators: true });
  if (!task) return res.status(404).send('Task not found');
  res.send(task);
});

// Delete a task
router.delete('/:user_id/tasks/:task_id', async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.task_id);
  if (!task) return res.status(404).send('Task not found');
  res.send('Task deleted');
});

module.exports = router;
