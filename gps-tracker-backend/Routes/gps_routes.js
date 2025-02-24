const express = require("express");
const gps_router = express.Router();
const gps_controller = require("../Controllers/gps_controller");

gps_router.get("/last-location/:plateNumber" , gps_controller.getLastLocation);
gps_router.get("/location-history/:plateNumber" , gps_controller.getLocationHistory);

module.exports = gps_router;