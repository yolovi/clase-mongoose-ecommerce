const { JWT_SIGNATURE } = require("../config/keys");
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const UserController = {
    async register(req, res) {
        try {
            const password = await bcrypt.hash(req.body.password, 10); //hashSync si no usas await, por ejemplo con .then
            const user = await User.create({ ...req.body, password, role: "user" });
            res.status(201).send({ message: "Usuario registrado con éxito", user })
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: 'Ha habido un problema al registrar el usuario' })

        }
    },
    async login(req, res) {
        try {
            const user = await User.findOne({
                email: req.body.email
            })
            const isMatch = bcrypt.compareSync(req.body.password, user.password)
            if (!isMatch) {
                return res.status(400).send("correo o contraseña incorrectos")
            }
            const token = jwt.sign({ _id: user._id }, JWT_SIGNATURE)
            if (user.tokens.length > 4) user.tokens.shift();
            user.tokens.push(token);
            await user.save();
            res.send({ message: 'Bienvenid@ ' + user.name, token });
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: 'Ha habido un problema al hacer login' })
        }
    },
    async getInfo(req, res) {
        try {
            const user = await User.findById(req.user._id)
                .populate({
                    path: "orderIds",
                    populate: {
                        path: "productIds",
                    },
                });
            res.send(user);
        } catch (error) {
            console.error(error);
        }
    },

    async logout(req, res) {
        try {
            await User.findByIdAndUpdate(req.user._id, {
                $pull: { tokens: req.headers.authorization },
            });
            res.send({ message: "Desconectado con éxito" });
        } catch (error) {
            console.error(error);
            res.status(500).send({
                message: "Hubo un problema al intentar desconectar al usuario",
            });
        }
    }
};

module.exports = UserController