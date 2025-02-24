const express = require("express");
const user_router = express.Router();
const userController = require("../Controllers/user_controller.js");

console.log("User Routes Loaded");

user_router.post("/add-user" , userController.addUser);
user_router.get("/get-user/:plateNumber" , userController.getUserByPlate);

module.exports = user_router ;