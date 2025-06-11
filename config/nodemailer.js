const nodemailer = require('nodemailer');
require("dotenv").config()

const { USER, PASS } = process.env

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,//puerto de gmail
    secure: true,
    auth: {
        user: USER,
        pass: PASS
    }
});
module.exports = transporter;
