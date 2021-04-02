// importing Mongoose module
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

// creating user schema
let userSchema = new Schema({
    userId: Schema.Types.ObjectId,
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        max: [100]
    },
    password: {
        type: String,
        required: true
    }

}, {
    collection: "users"
});

// Create model from the order schema
const userAccount = mongoose.model("users", userSchema);

// exporting user module
module.exports = user;