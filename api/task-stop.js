const express = require('express');
const router = express.Router();
const Task = require('./task-model');
const { authenticateToken } = require('./auth');

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { taskId } = req.body;
    await Task.updateOne({ taskId }, { status: 'STOP', timestamp: new Date() });
    res.json({ message: 'Task stopped' });
  } catch (error) {
    console.error('Error stopping task:', error);
    res.status(500).json({ message: 'Error stopping task', error: error.message });
  }
});

module.exports = router;