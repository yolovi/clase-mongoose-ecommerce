const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Por favor rellena tu nombre"]
    },
    email: {
        match: [/.+\@.+\..+/, "Este correo no es válido"],
        type: String,
        required: [true, "Por favor rellena correo"]
    },
    password: {
        type: String,
        required: [true, "Por favor rellena tu contraseña"]
    },
    birthday: Date,
    role: String,
    // role: { type: String, default: "user" },
    tokens: [],
    orderIds: [{ type: ObjectId, ref: 'Order' }],
    wishList: [{ type: ObjectId, ref: 'Product' }],
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
