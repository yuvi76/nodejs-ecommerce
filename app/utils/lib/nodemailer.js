const nodemailer = require('nodemailer')
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.sendgrid.net',
    port: process.env.SMTP_PORT || 465,
    auth: {
        user: process.env.SMTP_USERNAME || 'example@gmail.com', // SMTP email
        pass: process.env.SMTP_PASSWORD || 'example@123' // Your password
    },
    secure: true
})

const services = {};

services.send = function (templateName, data, mailOption) {
    const emailTemplatePath = path.join(__dirname, 'dir', 'email_templates');
    let template = fs.readFileSync(emailTemplatePath + '/' + templateName, {
        encoding: 'utf-8'
    })
    let emailBody = ejs.render(template, data)
    mailOption.html = emailBody
    return transporter.sendMail(mailOption)
}

services.sendMail = function (mailOption) {
    return transporter.sendMail(mailOption)
}

module.exports = services;
