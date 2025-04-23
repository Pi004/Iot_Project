const videoService = require("../Services/video_services");
const { rgb565ToRGB888, saveAsPNG } = require("../Services/helper.js");
const path = require("path");
/**
 * Handles WebSocket video frame uploads from ESP32-CAM.
 */
const handleFrameUpload = async (data) => {
    try {
        console.log("Incoming Frame Upload Request");
        const { frame, format, width, height, plateNumber } = data;
        if (!plateNumber || !frame) {
            return { success: false, message: "Missing plateNumber or frame data" }; 
        }
        const frameBuffer = Buffer.from(frame, "base64");
        if (format === "RGB565" && width && height) {
            const canvas = rgb565ToRGB888(buffer, width, height);
            const fileName = `frame_${plateNumber}_${Date.now()}.png`;
            const localPath = await saveAsPNG(canvas, fileName);

            const frameUrl = await videoService.saveFrame(fs.readFileSync(localPath), plateNumber);
            return { status: "Frame saved", url: frameUrl };
        } else {
            // fallback for already encoded images
            const frameUrl = await videoService.saveFrame(buffer, plateNumber);
            return { status: "Frame saved", url: frameUrl };
        }
    } catch (error) {
        console.error("Frame Upload Error:", error);
        return { error: "Failed to save frame" };
    }
};

/**
 * Converts stored frames into a video and uploads it to Cloudinary.
 * Used internally (not Express route).
 */
const convertToVideo = async (plateNumber) => {
    try {
        if (!plateNumber) {
            return { success: false, message: "plateNumber is required" };
        }

        const videoUrl = await videoService.convertToVideo(plateNumber);
        return { success: true, message: "Video conversion successful", videoUrl };
    } catch (error) {
        console.error("Video Conversion Error:", error);
        return { success: false, message: "Failed to convert video", error };
    }
};
/**
 * Uploads a local video file to Cloudinary under the specified plate number.
 * Triggered from backend after video is saved locally (e.g. from USB cam).
 */
const handleVideoUpload = async (data) => {
    try {
        const { filePath, plateNumber } = data;

        if (!filePath || !plateNumber) {
            return { success: false, message: "Missing filePath or plateNumber" };
        }

        const videoUrl = await videoService.uploadVideo(filePath, plateNumber);
        return { success: true, message: "Video uploaded successfully", videoUrl };
    } catch (error) {
        console.error("Video Upload Error:", error);
        return { success: false, message: "Video upload failed", error };
    }
};

module.exports = { handleFrameUpload, convertToVideo  , handleVideoUpload};
