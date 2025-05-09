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
                console.log("📩 Received data:", data);
                // Handle Python processing``
                
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
                        broadcastMessages({ type: "emergencyAlertSent", data: alert });
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
                    console.log("GPS" , location);
                    if (location && location.success) {
                        broadcastNewLocation(location.data); // Broadcast the new location to all clients
                    }
                    ws.send(JSON.stringify({ type: "gpsUpdated", update : location }));
                }
                else if(type === "DrowsinessAlert"){
                    const status = await gps_controller.SleepUpdate(data);
                    console.log("GPS" , status);
                    if (status && status.success) {
                        broadcastNewLocation(status.data); // Broadcast the new location to all clients
                    }
                    ws.send(JSON.stringify({ type: "drowsinessAlert", data : status }));

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
                else if(type == "camera_stream_url"){
                    let plate ;
                    if(data.plateNumber === "24:6F:28:28:7C:B8"){
                        plate = "WB 24 W 9582";
                    }
                    ws.plateNumber = plate; // Store plate number in WebSocket instance
                    const cleanUrl = data.stream_Url;
                    console.log("URL : -", cleanUrl);
                    //await video_controller.handleLiveStream(cleanUrl , plate);
                    ws.send(JSON.stringify({ type: "streamReceived" , plateNumber : plate , streamUrl : cleanUrl }));
                    broadcast({ type: "streamReceived", plateNumber : plate , streamUrl :cleanUrl });
                    //broadcast({ type: "streamReceived", plateNumber : plate , streamUrl : data.stream_Url });
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
function broadcastMessages(object) {
    const message = object;
    const payload = JSON.stringify(message);
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN && client.plateNumber === object.plateNumber) {
            client.send(payload);
            console.log(`📡 Sent URL to plateNumber ${object.plateNumber}`);
        }
    });
}
function broadcast(object) {
    const message = object;
    const payload = JSON.stringify(message);
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN ) {
            client.send(payload);
            console.log(`📡 Sent URL to all clients`);
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

module.exports = {initializeWebSocket , broadcastNewLocation , broadcastMessages , broadcast};