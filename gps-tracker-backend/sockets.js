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

                if (type === "getLocationHistory") {
                    const locations = await gps_controller.getLocationHistory(data.plateNumber);
                    ws.send(JSON.stringify({ type: "locationHistory", locations }));
                } 
                else if (type === "getLastLocation") {
                    const lastLocation = await gps_controller.getLastLocation(data.plateNumber);
                    ws.send(JSON.stringify({ type: "lastLocation", lastLocation }));
                }
                else if (type === "registerUser") {
                    const user = await user_controller.addUser(data);
                    ws.send(JSON.stringify({ type: "userRegistered", user }));
                }
                else if (type === "getUser") {
                    const user = await user_controller.getUser(data.plateNumber, data.password);
                    ws.send(JSON.stringify({ type: "user", user }));
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
