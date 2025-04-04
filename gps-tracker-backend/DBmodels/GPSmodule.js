const mongoose = require("mongoose");

const GPSSchema = new mongoose.Schema({
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    speed: { type: Number, default: 0 },
    platenumber: { type: String, required: true },
    accident: { type: Boolean, default: false },
    drunk: { type: Boolean, default: false },
    sleep: { type: Boolean, default: false },
    videoStreamUrl: { type: String },  // Store stream URL
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("GPS", GPSSchema);
