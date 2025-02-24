const UserService = require("../Services/user_services.js");
//POST : Add user details
const addUser = async (req, res) => {

    try {
        const { username, primaryNumber, secondaryNumber, address, plateNumber } = req.body;
        if (!username || !primaryNumber || !plateNumber || !address) {
            return res.status(400).json({ message: "Required fields are missing" });
        }
        const newUser = await UserService.addUser({ username, primaryNumber, secondaryNumber, address, plateNumber });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET: Fetch user details using Plate Number
const getUserByPlate = async (req, res) => {
    try {
        const { plateNumber } = req.params;
        if (!plateNumber) {
            return res.status(400).json({ message: "Plate number is required" });
        }
        const user = await UserService.getUser(plateNumber);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addUser, getUserByPlate };
