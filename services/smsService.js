const AfricasTalking = require('africastalking');

const africastalking = AfricasTalking({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME,
});

const sms = africastalking.SMS;

async function sendSms(to, message) {
  console.log('🔑 AT_USERNAME:', process.env.AT_USERNAME);
  console.log('🔑 AT_API_KEY:', process.env.AT_API_KEY ? 'set' : 'missing');

  const result = await sms.send({
    to: [to],
    message: message,
  });

  console.log('📦 AT Result:', JSON.stringify(result));

  const recipient = result.SMSMessageData.Recipients[0];

  if (recipient.status === 'Success') {
    return recipient.messageId;
  } else {
    throw new Error(`SMS failed: ${recipient.status}`);
  }
}

module.exports = { sendSms };