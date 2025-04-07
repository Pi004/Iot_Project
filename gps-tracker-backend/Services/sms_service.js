const twilio = require('twilio');

// Use your actual Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

exports.sendSMS = async (to, body) => {
    try {
        const message = await client.messages.create({
            body,
            from: fromNumber,
            to
        });

        console.log(`✅ SMS sent to ${to}: ${message.sid}`);
        return { success: true, sid: message.sid };
    } catch (err) {
        console.error(`❌ Failed to send SMS to ${to}:`, err.message);
        throw err;
    }
};
