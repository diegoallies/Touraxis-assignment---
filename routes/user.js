const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Create a new user
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (err) {
    console.error('Error creating user:', err.message);
    res.status(400).send(err);
  }
});

// List all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    console.error('Error listing users:', err.message);
    res.status(500).send('Error listing users');
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('User not found');
    res.send(user);
  } catch (err) {
    console.error('Error getting user:', err.message);
    res.status(500).send('Error getting user');
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) return res.status(404).send('User not found');
    res.send(user);
  } catch (err) {
    console.error('Error updating user:', err.message);
    res.status(400).send('Error updating user');
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).send('User not found');
    res.send('User deleted');
  } catch (err) {
    console.error('Error deleting user:', err.message);
    res.status(500).send('Error deleting user');
  }
});

module.exports = router;
