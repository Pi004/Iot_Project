const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    plateNumber: { type: String, required: true , unique: true },
    primaryNumber: { type: String, required: true },
    secondaryNumber: { type: String } ,
    address: { type: String, required: true },
    username: { type: String, required: true},
    password: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
