
//Adapter


import nodemailer from "nodemailer";

export const emailAdapter = {

    // send email with defined transport object
    async sendEmail(email: string, message: string, subject: string) {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "kevin6121991@gmail.com", // generated ethereal user
                pass: process.env.GMAILPASSWORD, // generated ethereal password
            },
        });
        return await transporter.sendMail({
            from: '"Anton" <antonlazukin6121991@gmail.com>', // sender address
            to: email, // list of receivers divided with
            subject: subject, // Subject
            // text: message,
            html: message,
        });
    },
}