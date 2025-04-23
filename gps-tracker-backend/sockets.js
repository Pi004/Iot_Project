const WebSocket = require("ws");
const { spawn } = require('child_process');
const gps_controller = require("./Controllers/gps_controller.js");
const user_controller = require("./Controllers/user_controller.js");
const video_controller = require("./Controllers/video_controller.js");
const sms_controller = require("./Controllers/sms_controller.js");

let wss;

function initializeWebSocket(server) {
    wss = new WebSocket.Server({ server });

    wss.on("connection", (ws) => {
        console.log("✅ Client connected");

        // Send a welcome message
        ws.send(JSON.stringify({ message: "Welcome to WebSocket Server" }));
        
        // Handle incoming messages
        ws.on("message", async (message) => {
            console.log(message.keys());
            try {
                const {type , data} = JSON.parse(message); // Parse incoming message
                console.log("📩 Received request:", type);
                // Handle Python processing
                if (type === "ProcessFramePython") {
                    processWithPython(data);
                    return;
                }
                if (type === "LocationHistory") {
                    const locations = await gps_controller.getLocationHistory(data.plateNumber);
                    ws.send(JSON.stringify({ type: "locationHistory", getloc : locations }));
                }
                else if (type === "SendEmergencyAlert") {
                    try {
                        const alert = await sms_controller.sendEmergencyAlert(
                            data.primaryNumber, 
                            data.secondaryNumber, 
                            data.message
                        );
                        ws.send(JSON.stringify({ type: "emergencyAlertSent", data: alert }));
                    } catch (error) {
                        ws.send(JSON.stringify({ type: "emergencyAlertError", error: error.message }));
                    }
                }
                else if (type === "LiveLocation") {
                    ws.plateNumber = data.plateNumber; // Store plate number in WebSocket instance
                    const liveLocation = await gps_controller.getLiveLocation(data.plateNumber);
                    ws.send(JSON.stringify({ type: "liveLocation", getLive : liveLocation }));
                }
                else if (type === "GPSUpdate") {
                    const location = await gps_controller.gpsUpdate(data.plateNumber, data);
                    console.log("Location" , location);
                    if (location && location.success) {
                        broadcastNewLocation(location.data); // Broadcast the new location to all clients
                    }
                    ws.send(JSON.stringify({ type: "gpsUpdated", update : location }));
                }
                else if (type === "DeleteLocationHistory") {
                    const deletedLocations = await gps_controller.deleteLocationHistory(data.plateNumber);
                    ws.send(JSON.stringify({ type: "locationHistoryDeleted", delete : deletedLocations }));
                }
                else if (type === "SignUpUser") {
                    const user = await user_controller.addUser(data);
                    ws.send(JSON.stringify({ type: "userRegistered", User:user }));
                }
                else if (type === "LoginUser") {
                    const user = await user_controller.getUser(data.plateNumber, data.password);
                    ws.send(JSON.stringify({ type: "user", User:user }));
                }
                else if (type === "FrameUpload") {
                    const frameUpload = await video_controller.handleFrameUpload(data);
                    ws.send(JSON.stringify({ type: "frameUploaded", frame : frameUpload }));

                    broadcastMessages(frameUpload.url);
                }
                else if(type === "VideoUpload"){
                    const videoUpload = await video_controller.handleVideoUpload(data);
                    ws.send(JSON.stringify({ type: "videoUploaded", video : videoUpload }));
                }
                else if (type === "ConvertToVideo") {
                    const video = await video_controller.convertToVideo(data.plateNumber);
                    ws.send(JSON.stringify({ type: "videoConverted", video : video }));
                }
                else {
                    ws.send(JSON.stringify({ error: "Invalid request type" }));
                }
            } catch (error) {
                console.error("❌ Error processing request:", error);
                ws.send(JSON.stringify({ error: "Invalid request format" }));
            }
        });

        // Handle client disconnection
        ws.on("close", () => {
            console.log("❌ Client disconnected");
        });

        // Handle errors
        ws.on("error", (err) => {
            console.error("⚠️ WebSocket Error:", err.message);
        });
    });
    console.log("🟢 WebSocket server initialized");
}
function broadcastMessages(frameUrl) {
    const message = {
        type: "frameUploaded",
        frame: {
            status: "Frame saved",
            url : frameUrl
        }
    };

    const payload = JSON.stringify(message);
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
            console.log("📡 Sent frame to connected client");
        }
    });
}
function broadcastNewLocation(location) {
    const message = {
        type: "liveLocation",
        getLive: {
            success: true,
            data: location
        }
    };

    const payload = JSON.stringify(message);

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN && client.plateNumber === location.plateNumber) {
            client.send(payload);
            console.log(`📡 Sent GPS update to plateNumber ${location.plateNumber}`);
        }
    });
}
// Spawn Python process for each frame
function processWithPython(data) {
    const py = spawn("python3", ["process_frame.py"]);

    py.stdin.write(data);
    py.stdin.end();

    py.stdout.on("data", (output) => {
        console.log("🐍 Python output:", output.toString().trim());
    });

    py.stderr.on("data", (err) => {
        console.error("🐍 Python error:", err.toString());
    });
}
module.exports = {initializeWebSocket , broadcastNewLocation , broadcastMessages , processWithPython};
