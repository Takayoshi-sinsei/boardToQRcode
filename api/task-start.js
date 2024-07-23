require('dotenv').config();
const mongoose = require('mongoose');
const Task = require('./task-model');

module.exports = async (req, res) => {
  const { taskId } = req.body;
  const task = new Task({ taskId, status: 'START', timestamp: new Date() });
  await task.save();
  res.json({ message: 'Task started' });
};