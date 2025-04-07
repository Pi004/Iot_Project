const smsService = require('../Services/sms_service');

exports.sendEmergencyAlert = async (primaryNumber, secondaryNumber, message) => {
    try {
        const responses = [];

        if (primaryNumber) {
            const res1 = await smsService.sendSMS(primaryNumber, message);
            responses.push(res1);
        }

        if (secondaryNumber) {
            const res2 = await smsService.sendSMS(secondaryNumber, message);
            responses.push(res2);
        }

        return { success: true, responses };
    } catch (error) {
        console.error("Error sending emergency alert:", error);
        return { success: false, error: error.message };
    }
};