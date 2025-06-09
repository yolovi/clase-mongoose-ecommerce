const mongoose = require('mongoose');
const ObjectId = mongoose.SchemaTypes.ObjectId;

const OrderSchema = new mongoose.Schema({
    status: String,
    userId: {
        type: ObjectId,
        ref: 'User'
    },
    productIds: [{ type: ObjectId, ref: "Product" }],
    deliveryDate: Date
}, { timestamps: true });

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
