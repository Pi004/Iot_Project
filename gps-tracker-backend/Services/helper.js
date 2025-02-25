const bcrypt = require("bcrypt");

// Hash Password
async function hashPassword(password) {
    const saltRounds = 10; // Number of salt rounds
    return await bcrypt.hash(password, saltRounds);
}

// Verify Password
async function verifyPassword(inputPassword, hashedPassword) {
    return await bcrypt.compare(inputPassword, hashedPassword);
}

module.exports = { hashPassword, verifyPassword };