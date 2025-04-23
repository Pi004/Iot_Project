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
        const location = await gps.findOneAndUpdate(
            { plateNumber: plateNumber },
            {
                $set: {
                    latitude: data.latitude,
                    longitude: data.longitude,
                    speed : data.speed,
                    accident: data.accident,
                    drunk: data.drunk,
                    timestamp: Date.now()
                }
            },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        );
        return location;
    } catch (error) {
        console.log("Error in gpsUpdate", error);
        return null;
    }
};
const SleepUpdate = async (plateNumber, Sleepstatus) => {
    try {
        const location = await gps.findOneAndUpdate(
            { plateNumber: plateNumber },
            {
                $set: {
                    sleep : Sleepstatus,
                    timestamp: Date.now()
                }
            },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        );
        return location;
    } catch (error) {
        console.log("Error in gpsUpdate", error);
        return null;
    }
};
const getLiveLocation = async (plateNumber) => {
    try {
        const location = await gps.find({plateNumber}).sort({timestamp: -1}).limit(1);
        return location[0];   
    } catch (error) {
        console.log("Error in getLiveLocation", error);
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

module.exports = { saveLocation , gpsUpdate, getLiveLocation, getLocationHistory , deleteLocationHistory , SleepUpdate};
