const videoService = require("../Services/video_services");

/**
 * Handles WebSocket video frame uploads from ESP32-CAM.
 */
const handleFrameUpload = async (data) => {
    try {
        if (!data.plateNumber || !data.frame) {
            //ws.send(JSON.stringify({ error: "Missing plateNumber or frame data" }));
            return { success: false, message: "Missing plateNumber or frame data" }; 
        }

        const frameBuffer = Buffer.from(data.frame, "base64");
        const frameUrl = await videoService.saveFrame(frameBuffer, data.plateNumber);

       return { status: "Frame saved", url : frameUrl };
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

module.exports = { handleFrameUpload, convertToVideo };
