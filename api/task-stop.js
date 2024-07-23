const mongoose = require('mongoose');
const Task = require('./task-model');
const { authenticateToken } = require('./auth');
require('dotenv').config();

module.exports = async (req, res) => {
  authenticateToken(req, res, async () => {
    const { taskId } = req.body;
    await Task.updateOne({ taskId }, { status: 'STOP', timestamp: new Date() });
    res.json({ message: 'Task stopped' });
  });
};