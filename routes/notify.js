const express = require('express');
const router  = express.Router();
const { sendSms } = require('../services/smsService');

router.post('/sms', async (req, res) => {
  const { phone, message } = req.body;

  if (!phone || !message) {
    return res.status(400).json({ error: 'phone and message are required' });
  }

  try {
    const sid = await sendSms(phone, message);
    res.json({ success: true, sid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;