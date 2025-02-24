const { Server } = require("socket.io");
const gpscontroller = require("./Controllers/gps_controller");
const usercontroller = require("./Controllers/user_controller");

function initializeWebSocket(server) {
    const io = new Server(server, {
        cors: { origin: "*" }
    });

    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);

        // Handle location history request
        socket.on("getLocationHistory", async (plateNumber) => {
            console.log("Fetching location history for:", plateNumber);
            try {
                const locations = await gpscontroller.getLocationHistory(plateNumber);
                socket.emit("locationHistory", locations);
            } catch (error) {
                socket.emit("error", { message: "Failed to fetch locations" });
            }
        });

        // Handle last location request
        socket.on("getLastLocation", async (plateNumber) => {
            console.log("Fetching last location for:", plateNumber);
            try {
                const locations = await gpscontroller.getLastLocation(plateNumber);
                socket.emit("lastLocation", locations);
            } catch (error) {
                socket.emit("error", { message: "Failed to fetch last location" });
            }
        });
        
        // Handle user registration
        socket.on("registerUser", async (userData) => {
            console.log("Registering user:", userData);
            try {
                const user = await usercontroller.addUser(userData);
                socket.emit("userRegistered", user);
            } catch (error) {
                socket.emit("error", { message: "Failed to register user" });
            }
        });

        // Handle user lookup
        socket.on("getUserByPlate", async (plateNumber) => {
            console.log("Fetching user by plate number:", plateNumber);
            try {
                const user = await usercontroller.getUserByPlate(plateNumber);
                socket.emit("userByPlate", user);
            } catch (error) {
                socket.emit("error", { message: "Failed to fetch user" });
            }
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });

    return io;
}

module.exports = initializeWebSocket;