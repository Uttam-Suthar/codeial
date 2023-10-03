const nodeMailer = require('../config/nodemailer')

// this is the another way to exporting method

exports.newComment = async function (comment) {
    try {
        let htmlString =await nodeMailer.renderTemplate({ comment: comment }, '/comments/new_comment.ejs')
        // console.log(htmlString, 'string')
        // console.log('inside newComment mailer', comment)
        let info = await nodeMailer.transporter.sendMail({
            from: 'ab@gmail.com',
            to: comment.user.email,
            subject: "New Comment Published!",
            // text: "Hello world?", // plain text body
            // html: "<h1>Yup! Your comment is now published?</h1>" // html body
            html: htmlString
        })
        console.log('Message sent', info)
        // console.log("Message sent: %s", info.messageId);
        return

    }
    catch (err) {
        console.log('Error in sending mail', err);
        return
    }



}