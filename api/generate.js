const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const { authenticateToken } = require('./auth');

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { taskId } = req.body;
    const url = `https://${req.headers.host}/task/${taskId}`;
    const qrCode = await QRCode.toDataURL(url);
    res.json({ qrCode });
  } catch (error) {
    res.status(500).json({ message: 'Error generating QR code' });
  }
});

module.exports = router;