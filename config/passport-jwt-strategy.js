const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const env= require('./enviroment')

const User = require('../models/user')

let opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    // secretOrKey: 'Codeial'
    secretOrKey: env.jwt_secret

}

passport.use(new JWTStrategy(opts, function (jwtPayLoad, done) {
    // User.findById(jwtPayLoad._id,function(user,err){
    //     if(err){
    //         console.log('Error in finding user from JWT');
    //         return
    //     }
    //     else{
    //         return done(null,user)
    //     }
    //     if(user){
    //         return done(null,false)
    //     }
    // })
    User.findById(jwtPayLoad._id).then(function (user) {
        if (user) {
            return done(null, user)
        }
        else {
            return done(null, false)
        }

    }).catch(function (err) {
        console.log('Error in finding user from JWT', err);
        return done(err)
    })
}))

module.exports = passport