// const { JWT_SIGNATURE } = require("../config/keys");
require("dotenv").config()
const {API_URL, JWT_SECRET } = process.env
const User = require("../models/User")
const Product = require("../models/Product")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const transporter = require("../config/nodemailer");

const UserController = {
    async register(req, res, next) {
        try {
            if (!req.body.password) {
                return res.status(400).send("La contraseña es obligatoria");
            }
            const password = await bcrypt.hash(req.body.password, 10); //hashSync si no usas await, por ejemplo con .then
            const user = await User.create({ ...req.body, password, role: "user" });
            res.status(201).send({ message: "Usuario registrado con éxito", user })
        } catch (error) {
            console.error(error)
            // res.status(500).send({ message: 'Ha habido un problema al registrar el usuario' })
            next(error)
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
            const token = jwt.sign({ _id: user._id }, JWT_SECRET)
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
                })
                .populate("wishList");
            res.send(user);
        } catch (error) {
            console.error(error);
        }
    },
    async recoverPassword(req, res) {
        try {
            const recoverToken = jwt.sign({ email: req.params.email }, JWT_SECRET, {
                expiresIn: "48h",
            });
            const url = API_URL + "/users/resetPassword/" + recoverToken;
            await transporter.sendMail({
                to: req.params.email,
                subject: "Recuperar contraseña",
                html: `<h3> Recuperar contraseña </h3>
                <a href="${url}">Recuperar contraseña</a>
                El enlace expirará en 48 horas`,
            });
            res.send({
                message: "Un correo de recuperación se envio a tu dirección de correo",
            });
        } catch (error) {
            console.error(error);
        }
    },
    async resetPassword(req, res, next) {
        try {
            const recoverToken = req.params.recoverToken;
            const payload = jwt.verify(recoverToken, JWT_SECRET);
            const password = await bcrypt.hash(req.body.password, 10);
            await User.findOneAndUpdate(
                { email: payload.email },
                { password }
            );
            res.send({ message: "contraseña cambiada con éxito" });
        } catch (error) {
            next(error)
            // console.error(error);
        }
    },
    async like(req, res) {
        try {
            const product = await Product.findByIdAndUpdate(
                req.params._id,
                { $push: { likes: req.user._id } },
                { new: true }
            );
            await User.findByIdAndUpdate(
                req.user._id,
                { $push: { wishList: req.params._id } },
                // { $addToSet: { wishList: req.params._id } },

                { new: true }
            );
            res.send(product);
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "There was a problem with your like" });
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