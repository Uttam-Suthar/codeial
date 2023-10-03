const passport = require('passport');
// const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user')

// authentication using passport
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback:true
},
    function (req,email, password, done) {
        User.findOne({ email: email }).then(function (user) {
            // find a user and stablish the idedentity
            // if(err){
            //     req.flash('error',err)
            //     return done(err)
            // }
            if (!user || user.password != password) {
                // console.log('Invalid username/password');
                req.flash('error', 'Invalid username/password')

                return done(null, false);
            }
            return done(null, user);
        }).catch(function (err) {

            // console.log('Error is finding user --> passport', err);
            req.flash('error', err)
            return done(err)
            

        })
    }
));

// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function (user, done) {
    done(null, user.id)
})

// deserializing the user from the key in the cookies
passport.deserializeUser(function (id, done) {
    User.findById(id).then(function (user) {
        return done(null, user);
    }).catch(function (err) {

        console.log('Error is finding user --> passport', err);
        return

    })

});

// check if the user is authenticated
passport.checkAuthentication = function (req, res, next) {
    // if the user is sign in then pass of the request to the next function (controller action)
    if (req.isAuthenticated()) {
        return next()
    }

    // if user is not sign in 
    return res.redirect('/users/sign-in')
}

passport.setAuthenticatedUser = function (req, res, next) {
    if (req.isAuthenticated()) {
        //req.user is contained the current sign in usr from the session cookies and we are just sending this to the for the views
        res.locals.user = req.user
    }
    return next()
}

module.exports = passport