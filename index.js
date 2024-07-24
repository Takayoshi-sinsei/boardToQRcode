const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'BOARD_API_URL', 'BOARD_API_KEY', 'BOARD_API_TOKEN'];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Error: Environment variable ${envVar} is not set.`);
    process.exit(1);
  }
}

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
const authRoutes = require('./api/auth').router;
const generateRoutes = require('./api/generate');
const taskStartRoutes = require('./api/task-start');
const taskStopRoutes = require('./api/task-stop');
const boardRoutes = require('./api/board');

// APIルートの使用
app.use('/api/auth', authRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/task-start', taskStartRoutes);
app.use('/api/task-stop', taskStopRoutes);
app.use('/api/board', boardRoutes);

// フロントエンドルート
app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/generate', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'generate.html'));
});

app.get('/task/:taskId', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'task.html'));
});

// エラーハンドリングミドルウェア
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;