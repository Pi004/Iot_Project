const gps = require("../DBmodels/GPSmodule")

const saveLocation = async (data) => {
    const location = await gps.create(
        /*platenumber = data.plateNumber,
        latitude = data.latitude,
        longitude = data.longitude,
        speed = data.speed,
        accident = data.accident,
        drunk = data.drunk,
        sleep = data.sleep,
        //videoStreamUrl = data.videoStreamUrl,
        */
       data
    );
    return location;
};

const gpsUpdate = async (plateNumber, data) => {
    try {
        const location = await gps.findOneAndUpdate({plateNumber}, data, {new: true});
        return location;
    }catch(error){
        console.log("Error in gpsUpdate", error);
        return null;
    }
}
const getLastLocation = async (plateNumber) => {
    try {
        const location = await gps.find({plateNumber}).sort({timestamp: -1}).limit(1);
        return location[0];   
    } catch (error) {
        console.log("Error in getLastLocation", error);
        return null;
    }
};

async function getLocationHistory(plateNumber) {
    try{
        const arr = await gps.find({ plateNumber });
        return arr;
    }catch(e){
        console.log("Error in getLocationHistory", e);
        return [];
    }
}
async function deleteLocationHistory(plateNumber) {
    try{
        const arr = await gps.deleteMany({ plateNumber });
        return arr;
    }catch(e){
        console.log("Error in deleteLocationHistory", e);
        return null;
    }
}

module.exports = { saveLocation , gpsUpdate, getLastLocation, getLocationHistory , deleteLocationHistory};
