const fs = require('fs')
const rfs = require('rotating-file-stream')
const path = require('path')

const logDirectory = path.join(__dirname, '../production_logs')
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory
})

const development = {
    name: 'devlopment',
    asset_path: './assets',
    session_cookie_key: 'blahsomthing',
    db: 'codeial_development_passport',
    smtp: {
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'princess.goldner@ethereal.email',
            pass: 'hEc6GXmj5McZqjUfhX'
        }
    },

    google_client_id: '106264648317-08pl2pel3o04s1p6cblvuigc54jprjdf.apps.googleusercontent.com', // e.g. asdfghjkkadhajsghjk.apps.googleusercontent.com
    google_client_secret: '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', // e.g. _ASDFA%KFJWIASDFASD#FAD-
    google_call_back_url: "http://localhost:8000/users/auth/google/callback",
    jwt_secret: 'Codeial',
    morgan: {
        mode: 'dev',
        options: { stream: accessLogStream }
    }
}

const production = {
    name: 'production',
    asset_path: process.env.CODEIAL_ASSET_PATH,
    // session_cookie_key: 'mBYAGAIfP5IjNVdYmktQgxvtuQ2eVczX',    // from rendomkeygen
    session_cookie_key: process.env.CODEIAL_SESSION_COOKIE_KEY,    // from rendomkeygen

    // db: 'codeial_development_passport',
    db: process.env.CODEIAL_DB,
    smtp: {
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            // user: 'princess.goldner@ethereal.email',
            // pass: 'hEc6GXmj5McZqjUfhX'
            user: process.env.CODEIAL_GMAIL_USERNAME,
            pass: process.env.CODEIAL_GMAIL_PASSWORD
        }
    },

    // google_client_id: '106264648317-08pl2pel3o04s1p6cblvuigc54jprjdf.apps.googleusercontent.com', // e.g. asdfghjkkadhajsghjk.apps.googleusercontent.com
    // google_client_secret: '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', // e.g. _ASDFA%KFJWIASDFASD#FAD-
    // google_call_back_url: "http://codeial.com/users/auth/google/callback",
    google_client_id: process.env.CODEIAL_GOOGLE_CLIENT_ID, // e.g. asdfghjkkadhajsghjk.apps.googleusercontent.com
    google_client_secret: process.env.CODEIAL_GOOGLE_SECRET, // e.g. _ASDFA%KFJWIASDFASD#FAD-
    google_call_back_url: process.env.CODEIAL_GOOGLE_CALLBACK_URL,
    // jwt_secret: '6Gjb5AihGSBwQcWx4UzCdffvSoOLOEfJ',       //from rendom gen ksy
    jwt_secret: process.env.CODEIAL_JWT_SECRET,       //from rendom gen ksy
    morgan: {
        mode: 'combained',
        options: { stream: accessLogStream }
    }

}

// module.exports = devleopment
module.exports = eval(process.env.CODEIAL_ENVIROMENT) == undefined ? development : eval(process.env.CODEIAL_ENVIROMENT)