const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const env= require('./enviroment')


// tell passport to use a new strategy for google login
passport.use(new googleStrategy({
    // clientID: '106264648317-08pl2pel3o04s1p6cblvuigc54jprjdf.apps.googleusercontent.com', // e.g. asdfghjkkadhajsghjk.apps.googleusercontent.com
    // clientSecret: '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', // e.g. _ASDFA%KFJWIASDFASD#FAD-
    // callbackURL: "http://localhost:8000/users/auth/google/callback",

    clientID:  env.google_client_id,
    clientSecret:env.google_client_secret,
    callbackURL: env.google_call_back_url
},

    async function (accessToken, refreshToken, profile, done) {
        try {
            // find a user
            let user = await User.findOne({ email: profile.emails[0].value }).exec()

            console.log(accessToken, refreshToken);
            console.log(profile);

            if (user) {
                // if found, set this user as req.user
                return done(null, user);
            } else {
                // if not found, create the user and set it as req.user

                try {
                    let user = await User.create({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        password: crypto.randomBytes(20).toString('hex')
                    })

                    return done(null, user);

                }
                catch (err) {
                    console.log('error in creating user google strategy-passport', err);
                    return done(err, null);

                }

            }
        }
        catch (err) {
            console.log('error in google strategy-passport', err);
            return done(err, null);

        }

    }

));


module.exports = passport;
