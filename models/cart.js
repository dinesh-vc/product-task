// importing Mongoose module
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// creating user schema
let cartSchema = new Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
    },
    productName: {
        type: String
    },

    quantity: {
        type: Number
    },

    price: {
        type: Number,
        required: true
    }



}, {
    timestamps: true,
}, {
    collection: "carts"
});

// Create model from the order schema
const carts = mongoose.model("carts", cartSchema);

// Exporting Order Module
module.exports = carts;