const User = require("../DBmodels/User_module.js")
const addUser = async(userData) => {
    try {
        const user = await User.create(userData);
        return user;

    } catch (error) {
        console.log("Problem in user_services.js");
    }
};
const getUser = async(plateNumber) =>{
    try {
        const user = await User.findOne({plateNumber});
        return user;   
    } catch (error) {
        console.log("Problem in user_services.js" , error)
    }
}
module.exports = { addUser, getUser };
