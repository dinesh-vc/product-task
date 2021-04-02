// importing Mongoose module
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// creating product schema

let productSchema = new Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    productName: {
        type: String,
        required: true
    },

    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },

    productDate: {
        type: Date,
        required: true,
        default: Date.now
    }

}, {
    collection: "products"
});

// Create model from the product schema
const product = mongoose.model("products", productSchema);
// exporting product module
module.exports = product;