const gps = require("../DBmodels/GPSmodule")
const saveLocation = async (data) => {
    const location = await gps.create(
        platenumber = data.platenumber,
        latitude = data.latitude,
        longitude = data.longitude,
        speed = data.speed,
        accident = data.accident,
        drunk = data.drunk,
        sleep = data.sleep,
        videoStreamUrl = data.videoStreamUrl,
    );
    return location;
};

const gpsUpdate = async (platenumber, data) => {
    try {
        const location = await gps.findOneAndUpdate({platenumber}, data, {new: true});
        return location;
    }catch(error){
        console.log("Error in gpsUpdate", error);
        return null;
    }
}
const getLastLocation = async (platenumber) => {
    try {
        const gps = await gps.find({platenumber}).sort({timestamp: -1});
        return gps;   
    } catch (error) {
        console.log("Error in getLastLocation", error);
        return null;
    }
};

async function getLocationHistory(platenumber, limit = 50) {
    try{
        const arr = await gps.find({ platenumber }).sort({ timestamp: -1 }).limit(limit);
        return arr;
    }catch(e){
        console.log("Error in getLocationHistory", e);
        return [];
    }
}

module.exports = { saveLocation , gpsUpdate, getLastLocation, getLocationHistory };
