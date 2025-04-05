const cloudinary = require("../Config/cloudinary.js");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs");

/**
 * Uploads a single frame to Cloudinary under the specified plate number.
 * @param {Buffer} data - The image frame data (Base64 decoded)
 * @param {String} plateNumber - The unique plate number of the vehicle
 * @returns {Promise<String>} - The URL of the uploaded frame
 */
async function saveFrame(data, plateNumber) {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: `esp32_cam_frames/${plateNumber}`, resource_type: "image" },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary Upload Error:", error);
                    reject(error);
                } else {
                    console.log(`Frame uploaded for ${plateNumber}:`, result.secure_url);
                    resolve(result.secure_url);
                }
            }
        );
        uploadStream.end(data);
    });
}

/**
 * Converts frames from Cloudinary into a video for a specific plate number.
 * @param {String} plateNumber - The unique plate number of the vehicle
 * @returns {Promise<String>} - The Cloudinary URL of the generated video
 */
async function convertToVideo(plateNumber) {
    return new Promise((resolve, reject) => {
        const tempVideoPath = path.join(__dirname, `../videos/${plateNumber}.mp4`);

        ffmpeg()
            .input(`https://res.cloudinary.com/dpzzxl9rh/image/list/esp32_cam_frames/${plateNumber}.json`)
            .inputFPS(10)
            .output(tempVideoPath)
            .on("end", async () => {
                try {
                    const result = await cloudinary.uploader.upload(tempVideoPath, {
                        resource_type: "video",
                        folder: `esp32_cam_videos/${plateNumber}`,
                    });

                    console.log(`Video uploaded for ${plateNumber}:`, result.secure_url);

                    // Delete temporary local video file
                    fs.unlinkSync(tempVideoPath);
                    
                    resolve(result.secure_url);
                } catch (error) {
                    console.error("Cloudinary Video Upload Error:", error);
                    reject(error);
                }
            })
            .on("error", reject)
            .run();
    });
}

module.exports = { saveFrame, convertToVideo };
