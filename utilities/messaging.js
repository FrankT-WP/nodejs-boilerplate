import nodemailer from "nodemailer"
import { from } from "rxjs";

const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com', // Office 365 server
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: {
       ciphers:'SSLv3'
    },
    auth: {
        user: '',
        pass: ''
    }
});

export const sendMessage = (mailOptions) => {
    return from(new Promise((resolve, reject) => {
        transporter.sendMail({ ...mailOptions, from: ''}, (err, info) => {
            console.log(err, info)
            if(err) {
                reject(err)
            } else {
                resolve(info)
            }
        })
    }))
}