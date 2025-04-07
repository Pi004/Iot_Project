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
const getLiveLocation = async(plateNumber) => {
    try {
        const liveLocation = await gps_services.getLiveLocation(plateNumber);
        if (!liveLocation) {
            return { success: false, message: "No data found" };
        }
        return { success: true, data: liveLocation };
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
const getLocationHistory = async(plateNumber) => {
    try {
        const locations = await gps_services.getLocationHistory(plateNumber);
        return { success: true, data: locations };
    } catch (error) {
        return { success: false, message: "Server Error", error };
    }
}
// POST: GPS Update 
const gpsUpdate = async (plateNumber, data) => {
    try {
        const gps_locate = await gps_services.getLocationHistory(plateNumber);
        console.log("gps_locate", gps_locate.length);
        if (gps_locate.length === 0) {
            const location = await gps_services.saveLocation(data);
            return { success: true, data: location };
        }
        else {
            const location = await gps_services.gpsUpdate(plateNumber, data);
            return { success: true, data: location };
        }
    } catch (error) {
        console.log("Error in gpsUpdate", error);
        return null;
    }
};

// DELETE: Location History
/*const deleteLocationHistory = async (req, res) => {
    try {
        const { platenumber } = req.body;
        const deletedLocations = await gps_services.deleteLocationHistory(platenumber);
        res.json({ success: true, data: deletedLocations });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error });
    }
};*/

const deleteLocationHistory = async(platenumber) => {
    try {
        const deletedLocations = await gps_services.deleteLocationHistory(platenumber);
        return { success: true, data: deletedLocations };
    } catch (error) {
        return { success: false, message: "Server Error", error };
    }
}
module.exports = {getLiveLocation  , getLocationHistory , gpsUpdate , deleteLocationHistory};