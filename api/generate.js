require('dotenv').config();
const QRCode = require('qrcode');

module.exports = async (req, res) => {
  const { taskId } = req.body;
  const url = `https://${req.headers.host}/task/${taskId}`;
  const qrCode = await QRCode.toDataURL(url);
  res.json({ qrCode });
};