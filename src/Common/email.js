/* eslint-disable */
// const sendGrid = require('@sendgrid/mail')
// sendGrid.setApiKey(process.env.SEND_GRID_API_KEY)
const nodemailer = require('nodemailer')
let testAccount
let transporter
(async function () {
    testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });
}())

const sendWelcomeEmail = async (name, email) => {
    try {
        let info = await transporter.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>',
            to: email,
            subject: "Thanks for joining in",
            text: `Welcome to the app ${name}.`,
        });
        console.log("URL:", nodemailer.getTestMessageUrl(info))
    } catch (error) {
        console.log("error:", error)
    }
}

const sendCancellationEmail = async (name, email) => {
    try {
        let info = await transporter.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>',
            to: email,
            subject: "WHY WHY WHY",
            text: `You ${name}. WHY DID YOU CANCEL OUR SERVICE. WHY WHY WHY?????? `,
        });
        console.log("URL:", nodemailer.getTestMessageUrl(info))
    } catch (error) {
        console.log("error:", error)
    }
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}