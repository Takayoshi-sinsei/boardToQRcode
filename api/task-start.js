const express = require('express');
const router = express.Router();
const Task = require('./task-model');
const { authenticateToken } = require('./auth');

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { taskId } = req.body;
    const task = new Task({ taskId, status: 'START', timestamp: new Date() });
    await task.save();
    res.json({ message: 'Task started' });
  } catch (error) {
    console.error('Error starting task:', error);
    res.status(500).json({ message: 'Error starting task', error: error.message });
  }
});

module.exports = router;