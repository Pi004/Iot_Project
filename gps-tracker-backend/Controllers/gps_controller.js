const gps_services = require("../Services/gps_services");

// GET: Last Known Location
/*const getLastLocation = async (req, res) => {
    try {
        const { platenumber } = req.body;
        const lastLocation = await gps_services.getLastLocation(platenumber);
        if (!lastLocation) {
            return res.status(404).json({ success: false, message: "No data found" });
        }
        res.json({ success: true, data: lastLocation });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error });
    }
};*/
const getLastLocation = async(platenumber) => {
    try {
        const lastLocation = await gps_services.getLastLocation(platenumber);
        if (!lastLocation) {
            return { success: false, message: "No data found" };
        }
        return { success: true, data: lastLocation };
    } catch (error) {
        return { success: false, message: "Server Error", error };
    }
}

// GET: Location History
/*const getLocationHistory = async (req, res) => {
    try {
        const { platenumber } = req.body;
        const locations = await gps_services.getLocationHistory(platenumber);
        res.json({ success: true, data: locations });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error });
    }
};*/
const getLocationHistory = async(platenumber) => {
    try {
        const locations = await gps_services.getLocationHistory(platenumber);
        return { success: true, data: locations };
    } catch (error) {
        return { success: false, message: "Server Error", error };
    }
}
// POST: GPS Update 
const gpsUpdate = async (platenumber, data) => {
    try {
        const gps_locate = await gps_services.getLocationHistory(platenumber);
        if (gps_locate.length === 0) {
            const location = await gps_services.saveLocation(data);
            return { success: true, data: location };
        }
        else {
            const location = await gps_services.gpsUpdate(platenumber, data);
            return { success: true, data: location };
        }
    } catch (error) {
        console.log("Error in gpsUpdate", error);
        return null;
    }
};
module.exports = {getLastLocation  , getLocationHistory , gpsUpdate };