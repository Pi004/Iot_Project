const WebSocket = require("ws");
const gps_controller = require("./Controllers/gps_controller.js");
const user_controller = require("./Controllers/user_controller.js");

function initializeWebSocket(server) {
    const wss = new WebSocket.Server({ server });

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

                if (type === "LocationHistory") {
                    const locations = await gps_controller.getLocationHistory(data.plateNumber);
                    ws.send(JSON.stringify({ type: "locationHistory", getloc : locations }));
                }
                /*else if (type === "SendEmergencyAlert") {
                    const alert = await sms_controller.sendEmergencyAlert(data.primaryNumber, data.secondaryNumber, data.message);
                    ws.send(JSON.stringify({ type: "emergencyAlertSent", }));
                }*/
                else if (type === "LastLocation") {
                    const lastLocation = await gps_controller.getLastLocation(data.plateNumber);
                    ws.send(JSON.stringify({ type: "lastLocation", getLast : lastLocation }));
                }
                else if (type === "SignUpUser") {
                    const user = await user_controller.addUser(data);
                    ws.send(JSON.stringify({ type: "userRegistered", user }));
                }
                else if (type === "LoginUser") {
                    const user = await user_controller.getUser(data.plateNumber, data.password);
                    ws.send(JSON.stringify({ type: "user", User:user }));
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

module.exports = initializeWebSocket;
