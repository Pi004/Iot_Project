const gps = require("../DBmodels/GPSmodule")
const saveLocation = async (data) => {
    const location = await gps.create(data);
    return location;
};

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

module.exports = { saveLocation , getLastLocation, getLocationHistory };
