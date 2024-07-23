const mongoose = require('mongoose');
const Task = require('./task-model');
const { authenticateToken } = require('./auth');
require('dotenv').config();

module.exports = async (req, res) => {
  authenticateToken(req, res, async () => {
    const { taskId } = req.body;
    const task = new Task({ taskId, status: 'START', timestamp: new Date() });
    await task.save();
    res.json({ message: 'Task started' });
  });
};