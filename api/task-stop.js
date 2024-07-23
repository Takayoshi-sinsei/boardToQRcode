require('dotenv').config();
const mongoose = require('mongoose');
const Task = require('./task-model');

module.exports = async (req, res) => {
  const { taskId } = req.body;
  await Task.updateOne({ taskId }, { status: 'STOP', timestamp: new Date() });
  res.json({ message: 'Task stopped' });
};