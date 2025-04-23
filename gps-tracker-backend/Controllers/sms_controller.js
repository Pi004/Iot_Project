const smsService = require('../Services/sms_service');

/**
 * Sends emergency alert SMS to primary and (optionally) secondary numbers.
 * @param {string} primaryNumber - The main recipient's phone number.
 * @param {string} secondaryNumber - The fallback/backup number.
 * @param {string} message - The alert message to send.
 * @returns {Promise<Object>} - Status and response data.
 */
exports.sendEmergencyAlert = async (primaryNumber, secondaryNumber, message) => {
    try {
        const responses = [];

        if (primaryNumber && isValidNumber(primaryNumber)) {
            const res1 = await smsService.sendSMS(primaryNumber, message);
            responses.push(res1);
        }

        if (secondaryNumber && isValidNumber(secondaryNumber)) {
            const res2 = await smsService.sendSMS(secondaryNumber, message);
            responses.push(res2);
        }

        return { success: true, responses };
    } catch (error) {
        console.error("❌ Error sending emergency alert:", error);
        return { success: false, error: error.message };
    }
};

/**
 * Basic phone number validation (placeholder).
 * Replace this with proper validation logic or external library.
 * @param {string} number
 * @returns {boolean}
 */
function isValidNumber(number) {
    return typeof number === 'string' && /^\+?\d{10,15}$/.test(number);
}
