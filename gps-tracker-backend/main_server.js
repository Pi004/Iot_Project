require("dotenv").config();
const express = require("express");
const http = require("http");
const initializeWebSocket = require("./sockets.js");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const gps_route = require("./Routes/gps_routes.js");
const user_route = require("./Routes/user_routes.js");

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

// Import Routes
app.use("/api/gps", gps_route);
app.use("/api/users", user_route);

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://Piyush:REeAgR3hJMyxAhFS@iot.6bqdx.mongodb.net/?retryWrites=true&w=majority&appName=iot";

// Connect to MongoDB

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));
// Initialize WebSocket
initializeWebSocket(server);

server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);