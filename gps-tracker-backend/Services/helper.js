const bcrypt = require("bcrypt");
const {createCanvas} = require("canvas");
// Hash Password
async function hashPassword(password) {
    const saltRounds = 10; // Number of salt rounds
    return await bcrypt.hash(password, saltRounds);
}

// Verify Password
async function verifyPassword(inputPassword, hashedPassword) {
    return await bcrypt.compare(inputPassword, hashedPassword);
}

/**
 * Convert RGB565 buffer to RGB888 image buffer (RGBA format for canvas).
 */
function rgb565ToRGB888(rgb565Buffer, width, height) {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");
    const imageData = ctx.createImageData(width, height);

    for (let i = 0; i < width * height; i++) {
        const byteIndex = i * 2;
        const value = rgb565Buffer.readUInt16BE(byteIndex);

        const r = ((value >> 11) & 0x1f) << 3;
        const g = ((value >> 5) & 0x3f) << 2;
        const b = (value & 0x1f) << 3;

        const index = i * 4;
        imageData.data[index + 0] = r;
        imageData.data[index + 1] = g;
        imageData.data[index + 2] = b;
        imageData.data[index + 3] = 255; // fully opaque
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
}

async function saveAsPNG(canvas, filename) {
    const fs = require("fs");
    const out = fs.createWriteStream(`./frames/${filename}`);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    return new Promise((resolve, reject) => {
        out.on("finish", () => {
            resolve(`./frames/${filename}`);
        });
        out.on("error", reject);
    });
}
module.exports = { hashPassword, verifyPassword , rgb565ToRGB888 , saveAsPNG};