const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();

// MongoDB接続
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// ミドルウェア
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// APIルートのインポート
const authRoutes = require('./api/auth');
const generateRoutes = require('./api/generate');
const taskStartRoutes = require('./api/task-start');
const taskStopRoutes = require('./api/task-stop');

// APIルートの使用
app.use('/api/auth', authRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/task-start', taskStartRoutes);
app.use('/api/task-stop', taskStopRoutes);

// フロントエンドルート
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'generate.html'));
});

app.get('/task/:taskId', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'task.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;