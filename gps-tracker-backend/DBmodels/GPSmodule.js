const mongoose = require("mongoose");

const GPSSchema = new mongoose.Schema({
    plateNumber: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    speed: { type: Number, default: 0 },
    accident: { type: Boolean, default: false },
    drunk: { type: Boolean, default: false },
    sleep: { type: String, default: "Awake" },
    //videoStreamUrl: { type: String },  // Store stream URL
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("GPS", GPSSchema);
