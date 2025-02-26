const express = require("express");
const gps_router = express.Router();
const gps_controller = require("../Controllers/gps_controller");

gps_router.get("/last-location" , gps_controller.getLastLocation);
gps_router.get("/location-history" , gps_controller.getLocationHistory);

module.exports = gps_router;