const express = require("express");
const gps_router = express.Router();
const gps_controller = require("../Controllers/gps_controller");

//gps_router.get("/last-location" , gps_controller.getLastLocation);
gps_router.get("/last-location", async (req, res) => {
    const plateNumber = req.body.plateNumber;
    const lastLocation = await gps_controller.getLastLocation(plateNumber);
    res.json(lastLocation);
});
//gps_router.get("/location-history" , gps_controller.getLocationHistory);
gps_router.get("/location-history", async (req, res) => {
    const plateNumber = req.body.plateNumber;
    const locations = await gps_controller.getLocationHistory(plateNumber);
    res.json(locations);
});

module.exports = gps_router;