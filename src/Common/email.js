/* eslint-disable */
// const sendGrid = require('@sendgrid/mail')
// sendGrid.setApiKey(process.env.SEND_GRID_API_KEY)

const sendWelcomeEmail = (name, email) => {
    // sendGrid.send({
    //     to: email,
    //     from: 'aakash.darji@kevit.io',
    //     subject: "Thanks for joining in",
    //     text: `Welcome to the app ${name}.`,
    // })
    return 'a'
}

const sendCancellationEmail = (name, email) => {
    // sendGrid.send({
    //     to: email,
    //     from: 'aakash.darji@kevit.io',
    //     subject: "WHY WHY WHY",
    //     text: `You ${name}. WHY DID YOU CANCEL OUR SERVICE. WHY WHY WHY?????? `,
    // })
    return 'a'
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}