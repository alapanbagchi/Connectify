import nodemailer from 'nodemailer'

const sendEmail = async (to: string, subject: string, html?: string) => {
    let transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 587,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    let mailOptions: any = ''

    mailOptions = {
        from: {address: 'admin@alapanbagchi.com', name: 'Connectify'}, to, subject, html
    };
    transport.sendMail(mailOptions, function (err: any, info: any) {
        if (err) {
            console.log(err)
            return false
        } else {
            console.log(info)
            return true
        }
    });
}

export {
    sendEmail
}