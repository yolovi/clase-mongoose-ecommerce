const User = require('../models/User.js');
const Order = require('../models/Order.js');
const jwt = require('jsonwebtoken');
require("dotenv").config()
const JWT_SIGNATURE = process.env.JWT_SECRET
// const { JWT_SIGNATURE } = require('../config/keys.js');

const authentication = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        console.log(token)
        console.log(JWT_SIGNATURE)
        const payload = jwt.verify(token, JWT_SIGNATURE);
        const user = await User.findOne({ _id: payload._id, tokens: token });
        if (!user) {
            return res.status(401).send({ message: 'No estas autorizado' });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error(error)
        return res.status(500).send({ error, message: 'Ha habido un problema con el token' })
    }
}

const isAdmin = async (req, res, next) => {
    const admins = ['admin', 'superadmin'];
    if (!admins.includes(req.user.role)) {
        return res.status(403).send({
            message: 'You do not have permission'
        });
    }
    next();
}

const isAuthorOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params._id);
        if (order.userId.toString() !== req.user._id.toString()) {
            return res.status(403).send({ message: 'Este pedido no es tuyo' });
        }
        next();
    } catch (error) {
        console.error(error)
        return res.status(500).send({ error, message: 'Ha habido un problema al comprobar la autoría del pedido' })
    }
}


module.exports = { authentication, isAdmin, isAuthorOrder }
