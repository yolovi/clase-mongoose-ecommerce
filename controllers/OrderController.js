const Order = require('../models/Order.js');

const OrderController = {
    async create(req, res) {
        try {
            const order = await Order.create({
                ...req.body,
                status: "pending", //pending, confirmed, processing…)
                deliveryDate: new Date().setDate(new Date().getDate() + 2),
                userId: req.user._id,
            });
            res.status(201).send(order);
        } catch (error) {
            console.error(error);
        }
    },
    async update(req, res) {
        try {
            const order = await Order.findByIdAndUpdate(
                req.params._id, //id del pedido que vamos a actualizar
                { ...req.body, userId: req.user._id },
                {
                    new: true,
                }
            );
            res.send({ message: "order successfully updated", order });
        } catch (error) {
            console.error(error);
        }
    },

}

module.exports = OrderController;
