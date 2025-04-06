const User = require("../DBmodels/User_module.js")
const Helper = require("./helper.js");
// Add user
const addUser = async(userData) => {
    try {
        const hashedPassword = await Helper.hashPassword(userData.password);
        const hashedWifipassword = await Helper.hashPassword(userData.wifipassword);
        const user = await User.create(
            {
                username: userData.username,
                primaryNumber: userData.primaryNumber,
                secondaryNumber: userData.secondaryNumber,
                address: userData.address,
                plateNumber: userData.plateNumber,
                password: hashedPassword,
                wifissid: userData.wifissid,
                wifipassword: hashedWifipassword,
            }
        );
        return user;

    } catch (error) {
        console.log("Problem in user_services.js" , error);
    }
};
// Get User by plate number and password
const getUserByPlateAndPassword = async(plateNumber, password) =>{
    try {
        const user = await User.findOne({plateNumber});
        const match = Helper.verifyPassword(password, user.password);
        if(match){
            return user;
        }
        else{
            return null;
        }
    }
    catch (error) {
        console.log("Problem in user_services.js" , error)
    }
}

module.exports = { addUser, getUserByPlateAndPassword};
