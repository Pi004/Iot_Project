const UserService = require("../Services/user_services.js");
//POST : Add user details
const addUser = async (req, res) => {

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

// GET: Fetch user details using Plate Number
const getUser = async (req, res) => {
    try {
        const { plateNumber , password } = req.body;
        if (!plateNumber || !password) {
            return res.status(400).json({ message: "Missing field" });
        }
        const user = await UserService.getUserByPlateAndPassword(plateNumber , password);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addUser, getUser };
