const UserService = require("../Services/user_services.js");
//POST : Add user details
/*const addUser = async (req, res) => {

    try {
        const { username, primaryNumber, secondaryNumber, address, plateNumber,password } = req.body;
        if (!username || !primaryNumber || !plateNumber || !address || !password) {
            return res.status(400).json({ message: "Required fields are missing" });
        }
        const newUser = await UserService.addUser({ username, primaryNumber, secondaryNumber, address, plateNumber , password });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
*/
const addUser = async(UserData) => {
    try {
        const { username, primaryNumber, secondaryNumber, address, plateNumber,password,apn } = UserData;
        if (!username || !primaryNumber || !plateNumber || !address || !password || !apn) {
            return { success: false, message: "Required fields are missing", data: null };
        }
        const newUser = await UserService.addUser({ username, primaryNumber, secondaryNumber, address, plateNumber , password , apn});
        return { 
            success: true, 
            message: "User added successfully", 
            data: {
                username: newUser.username,
                contact: {
                    primary: newUser.primaryNumber,
                    secondary: newUser.secondaryNumber,
                },
                location: newUser.address,
                vehicle: {
                    plateNumber: newUser.plateNumber,
                },
                apn: newUser.apn,
            } 
        };
    } catch (error) {
        return { success: false, message: error.message, data: null };
    }
}
// GET: Fetch user details using Plate Number
/*const getUser = async (req, res) => {
    try {
        //const { plateNumber , password } = req;

        if (!req.body.plateNumber || !req.body.password) {
            return res.status(400).json({ message: "Missing field" });
        }
        const user = await UserService.getUserByPlateAndPassword(req.body.plateNumber , req.body.password);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
        return res;
    } catch (error) {
        console.log("Problem in user_controller.js" , error);
        //res.status(500).json({ message: error.message });
    }
};
*/
const getUser = async (plateNumber , password) => {
    try{
        const user = await UserService.getUserByPlateAndPassword(plateNumber , password);
  
        if (!user) {
        return { success: false, message: "User not found", data: null };
        }
    
        return {
        success: true,
        message: "User retrieved successfully",
        data: {
            username: user.username,
            contact: {
            primary: user.primaryNumber,
            secondary: user.secondaryNumber,
            },
            location: user.address,
            vehicle: {
            plateNumber: user.plateNumber,
            },
            apn: user.apn,
        },
        };
    }
    catch(error){
        console.log("Problem in user_controller.js" , error);
        return { success: false, message: error.message, data: null };
    }
  };  

module.exports = { addUser, getUser };
