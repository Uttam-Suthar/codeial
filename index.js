const express = require('express');
const env = require('./config/enviroment')
require('dotenv').config()
const logger = require('morgan')

const cookiesParser = require('cookie-parser')
const app = express();
// require('./config/view-helpers')(app)

const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy')

const MongoStore = require('connect-mongo')
const sassMiddleware = require('sass-middleware')
const flash = require('connect-flash');
const customMware = require('./config/middleware')

//setup tthe chatserver to be used with socket.io
const chatServer = require('http').Server(app)
const chatSockets = require("./config/chat_sockets").chatSockets(chatServer);
chatServer.listen(5000, function (error) {
    if (error) {
        console.log("Error in setting up Chat Server");
    } else {
        console.log("Chat Server is listening on port :5000");
    }
});

//For logging purppose
// const morgan = require("morgan");
// const path = require("path");
const rfs = require("rotating-file-stream");

const path = require('path')
if (env.name == "development") {

    app.use(sassMiddleware({
        // src: './assets/scss',
        // dest: './assets/css',
        src: path.join(__dirname, env.asset_path, "scss"),
        dest: path.join(__dirname, env.asset_path, "css"),
        debug: true,
        outputStyle: 'extended',
        prifix: '/css'
    }))

}

// app.use(express.urlencoded());
app.use(express.urlencoded({ extended: false }));
app.use(cookiesParser())

//static file access
// app.use(express.static('./assets'));
app.use(express.static(env.asset_path));

// //7)Linking static files
// app.use(express.static(path.join(__dirname, env.assets_path)));
// console.log(__dirname + "/" + env.assets_path);

app.use(expressLayouts)
// make the updare path uploaded path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'))


// setup the logger
// app.use(morgan(env.morgan.mode, env.morgan.options));
app.use(logger(env.morgan.mode, env.morgan.options))


// extracts style and script from sub page into the layout
app.set('layout extractStyles', true)
app.set('layout extractScripts', true)



// set up the views engine
app.set('view engine', 'ejs');
app.set('views', './views')

app.use(session({
    name: 'codeial',
    //todo  change the before development product mode
    // secret: 'blahsomthing',
    secret: env.session_cookie_key,

    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: MongoStore.create(
        {
            mongoUrl: 'mongodb://127.0.0.1:27017/codeial_development_passport', // Assuming 'db' is your Mongoose connection
            autoRemove: 'disabled', // Optional configuration
        },
        function (err) {
            console.log(err || 'connect-mongo db setup ok');
        }
    ),

}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser)

app.use(flash())
app.use(customMware.setFlash)

//use express routes
app.use('/', require('./routes'))

app.listen(port, function (err) {
    if (err) {
        console.log(`Error in running server: ${err}`)
    }

    console.log(`Server is running on port: ${port}`)
})

