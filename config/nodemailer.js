const nodemailer = require('nodemailer')
const ejs = require('ejs')
const path = require('path')
const env= require('./enviroment')

// const transporter = nodemailer.createTransport({
//     // service: 'gmail',
//     // host: "smtp.gmail.com",
//     // port: 587,
//     // secure: false,
//     // auth: {
//     //     user: "alchemy.cn1B",
//     //     pass: "codingninjas",
//     // }
//     // or
//     host: 'smtp.ethereal.email',
//     port: 587,
//     auth: {
//         user: 'princess.goldner@ethereal.email',
//         pass: 'hEc6GXmj5McZqjUfhX'
//     }
// });

const transporter = nodemailer.createTransport(env.smtp)


let renderTemplate = async function (data, relativePath) {
    // let mailHTML;
    // ejs.renderFile(
    //     path.join(__dirname, '../views/mailers', relativePath),
    //     data,
    //     function(err,template){
    //         if(err){
    //             console.log('Error in rendering template')
    //             return
    //         }
    //         mailHTML=template;
    //     }
    // )
    // return mailHTML
    try {
        let mailHTML;
        let template = await ejs.renderFile(
            path.join(__dirname, '../views/mailers', relativePath),
            data
        )
        // console.log(template, 'template')
        mailHTML = template;
        return mailHTML

    }
    catch (err) {
        console.log('Error in rendering template', err)
        return
    }



}

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}