const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    birthday: Date,
    role: String,
    tokens: [],
    orderIds: [{ type: ObjectId, ref: 'Order' }],
}, { timestamps: true });

UserSchema.methods.toJSON = function () {
    const user = this._doc;
    delete user.tokens;
    delete user.password;
    delete user.__v;
    return user;
}

const User = mongoose.model('User', UserSchema);

module.exports = User;
