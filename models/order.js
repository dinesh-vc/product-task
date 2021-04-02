// importing Mongoose module
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// creating user schema
let orderSchema = new Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
    },

    orderDate: {
        type: Date,
        required: true,
        default: Date.now
    },

    totalPrice: {
        type: Number,
        required: true
    }



}, {
    collection: "orders"
});

// Create model from the order schema
const order = mongoose.model("orders", orderSchema);

// Exporting Order Module
module.exports = order;