const cloudinary = require("../Config/cloudinary.js");
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath('C:/ffmpeg-7.0.2-full_build/bin/ffmpeg.exe'); // Replace with your real path
//const { spawn } = require("child_process");
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
/**
 * Uploads a video to Cloudinary under a plate-specific folder.
 * @param {string} filePath - The path to the local video file
 * @param {string} plateNumber - The vehicle plate number
 * @returns {Promise<string>} - Cloudinary URL of uploaded video
 */
async function uploadVideo(filePath, plateNumber) {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: "video",
            folder: `esp32_cam_videos/${plateNumber}`,
        });

        console.log(`✅ Video uploaded for ${plateNumber}: ${result.secure_url}`);
        return result.secure_url;
    } catch (err) {
        console.error("❌ Cloudinary Video Upload Error:", err);
        throw err;
    }
}
const recordStreamAndUpload = (streamUrl, plateNumber, duration = 30) => {
    return new Promise((resolve, reject) => {
        const fileName = `${plateNumber}-${Date.now()}.mp4`;
        const outputPath = path.join(__dirname, "../temp", fileName);

        console.log(`Recording stream from ${streamUrl}...`);

        // FFmpeg pipeline
        ffmpeg(streamUrl)
            .inputOptions('-re') // read input at native frame rate
            .duration(duration)
            .videoCodec('libx264') // better compatibility than 'copy'
            .format('mp4')
            .noAudio()
            .on("start", (cmd) => {
                console.log("🔧 FFmpeg started:", cmd);
            })
            .on("end", () => {
                console.log("✅ Recording complete. Uploading to Cloudinary...");

                cloudinary.uploader.upload(outputPath, {
                    resource_type: "video",
                    folder: `vehicle-streams/${plateNumber}`,
                }, (err, result) => {
                    fs.unlink(outputPath, () => {}); // cleanup

                    if (err) {
                        console.error("❌ Cloudinary upload failed:", err);
                        return reject({ success: false, message: "Upload failed", error: err });
                    }

                    console.log("☁️ Upload complete:", result.secure_url);
                    resolve({ success: true, cloudinaryUrl: result.secure_url });
                });
            })
            .on("error", (err, stdout, stderr) => {
                console.error("🔥 FFmpeg error:", err.message || err);
                reject({
                    success: false,
                    message: "FFmpeg failed to record stream. Check if the URL is valid and accessible.",
                    error: err
                });
            })
            .save(outputPath);
    });
};
module.exports = { saveFrame, convertToVideo , uploadVideo , recordStreamAndUpload};