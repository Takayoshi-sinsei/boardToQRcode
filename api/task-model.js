const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskId: String,
  status: String,
  timestamp: Date
});

module.exports = mongoose.models.Task || mongoose.model('Task', taskSchema);