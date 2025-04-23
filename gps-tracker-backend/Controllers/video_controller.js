const videoService = require("../Services/video_services");
const path = require("path");
/**
 * Handles WebSocket video frame uploads from ESP32-CAM.
 */
const handleFrameUpload = async (data) => {
    try {
        console.log("Incoming Frame Upload Request");
        const { frame , plateNumber } = data;
        if (!plateNumber || !frame) {
            return { success: false, message: "Missing plateNumber or frame data" }; 
        }
        const base64Data = frame.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");

        const frameUrl = await videoService.saveFrame(buffer, plateNumber);
        //const frameUrl = await videoService.saveFrame(frame, plateNumber);
        return { status: "Frame saved", url: frameUrl };
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
/**
 * Handles incoming live stream URLs from clients (e.g., ESP32-CAM).
 * Stores or processes the live stream link associated with a plateNumber.
 */
const handleLiveStream = async (streamUrl , plateNumber) => {
    try {
        if (!streamUrl || !plateNumber) {
            console.warn("Missing streamUrl or plateNumber");
            return { success: false, message: "Missing streamUrl or plateNumber" };
        }

        // Optional: save to a DB or in-memory store
        await videoService.recordStreamAndUpload(streamUrl, plateNumber);

        // You can also broadcast it to frontend clients if needed
        // io.emit("new_live_stream", { plateNumber, streamUrl });

        console.log(`Received live stream from ${plateNumber}: ${streamUrl}`);
        return { success: true, message: "Live stream URL registered", streamUrl };
    } catch (error) {
        console.error("Live Stream URL Error:", error);
        return { success: false, message: "Failed to handle live stream URL", error };
    }
};

module.exports = { handleFrameUpload, convertToVideo  , handleVideoUpload , handleLiveStream};
