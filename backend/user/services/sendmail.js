const nodemailer = require('nodemailer')

//const createTransport = require('nodemailer')

require("dotenv").config()
const email_config = {
    host: 'smtp.gmail.com',

    port: 587,

    secure: false,

    requireTLS: true,

    auth: {

        user: 'process.env.EMAIL_USER',

        pass: 'process.env.EMAIL_PWD'
    }
}
//transporter

const transporter = nodemailer.createTransport(email_config)

async function sendMail(useremail){

    const message_options = {
        to:useremail,
        from: "mwakidavis89@gmail.com",
        subject: "welcome to the social app",
        text: "your account at the social applications has been created successfully \n please enjoy the app",
      
    }
    try {
        let results = await transporter.sendMail(message_options)
    
        console.log(results)
    
    } catch (error) {
        
    }
}

module.exports = sendMail

