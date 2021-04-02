// importing Mongoose module
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// creating product schema

let productSchema = new Schema({
    productId: new Schema.Types.ObjectId,
    userId: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'user'
    },
    productName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },

    productDate: {
        type: Date,
        required: true
    }

});

// Create model from the product schema
const product = mongoose.model("products", productSchema);
// exporting product module
module.exports = product;