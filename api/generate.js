const QRCode = require('qrcode');
const { authenticateToken } = require('./auth');

module.exports = async (req, res) => {
  authenticateToken(req, res, async () => {
    const { taskId } = req.body;
    const url = `https://${req.headers.host}/task/${taskId}`;
    const qrCode = await QRCode.toDataURL(url);
    res.json({ qrCode });
  });
};