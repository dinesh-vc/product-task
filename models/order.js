// importing Mongoose module
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// creating user schema
let orderSchema = new Schema({
    orderId: new Schema.Types.ObjectId,
    userId: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'user'
    },
    productId: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'product'
    },
    orderDate: {
        type: Date,
        required: true
    },
    delivaryDate: {
        type: Date,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },

    delivaryAddress: {
        type: String,
        max: [100]
    }

});

// Create model from the order schema
const order = mongoose.model("orders", orderSchema);

// Exporting Order Module
module.exports = order;