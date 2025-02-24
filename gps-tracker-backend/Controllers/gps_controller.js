const gps_services = require("../Services/gps_services");

// GET: Last Known Location
const getLastLocation = async (req, res) => {
    try {
        const { platenumber } = req.params;
        const lastLocation = await gps_services.getLastLocation(platenumber);
        if (!lastLocation) {
            return res.status(404).json({ success: false, message: "No data found" });
        }
        res.json({ success: true, data: lastLocation });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error });
    }
};

// GET: Location History
const getLocationHistory = async (req, res) => {
    try {
        const { platenumber } = req.params;
        const locations = await gps_services.getLocationHistory(platenumber);
        res.json({ success: true, data: locations });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error });
    }
};

module.exports = {getLastLocation  , getLocationHistory};