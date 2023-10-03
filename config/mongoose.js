const mongoose = require('mongoose')
const env= require('./enviroment')
// mongoose.connect('mongodb://localhost/codeial_development')

// mongoose.connect('mongodb://127.0.0.1:27017/codeial_development_passport');
// mongoose.connect(`mongodb://127.0.0.1:27017/${env.db}`);
// mongoose.connect('mongodb+srv://sutharuttam33:GhgOsrkaH9VImQr9@cluster0.jvw4uop.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp');
mongoose.connect(process.env.MONGODB_URI);

// GhgOsrkaH9VImQr9

// mongodb + srv://sutharuttam33:<password>@cluster0.jvw4uop.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp
//require the connection to check if it is succefully connection 
const db = mongoose.connection;

//error
db.on('error', console.error.bind(console, 'error connection to mongoDB'));

// up and running print message
db.once('open', function () {
    console.log('Succefully connected to database :: mongoDB');
})

module.exports = db;