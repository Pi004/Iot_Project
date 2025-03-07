const express = require("express");
const user_router = express.Router();
const userController = require("../Controllers/user_controller.js");

console.log("User Routes Loaded");

//user_router.post("/add-user" , userController.addUser);
//user_router.get("/get-user" , userController.getUser);
user_router.post("/add-user", async (req, res) => {
    //const { username, primaryNumber, secondaryNumber, address, plateNumber, password } = req.body;
    const response = await userController.addUser(req.body);
    res.json(response); // Only sending response here
  });
user_router.get("/get-user", async (req, res) => {
    const plateNumber = req.body.plateNumber;
    const password = req.body.password;
    const response = await userController.getUser(plateNumber , password);
    res.json(response); // Only sending response here
  });
module.exports = user_router ;