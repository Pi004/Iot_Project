const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    primaryNumber: { type: String, required: true },
    secondaryNumber: { type: String } ,
    address: { type: String, required: true },
    plateNumber: { type: String, required: true },
    password: { type: String, required: true },
    apn : {type: String, required: true},
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
