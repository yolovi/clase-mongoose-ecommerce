const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  reviews: [{
    userId: { type: ObjectId, ref: 'User' },
    comment: String
  }]
}, { timestamps: true });

ProductSchema.index({
  name: "text",
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
