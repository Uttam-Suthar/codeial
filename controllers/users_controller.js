const User = require('../models/user')

const fs = require('fs')
const path = require('path')


module.exports.profile = function (req, res) {

    // return res.end('<h1>User Profile!</h1>')
    User.findById(req.params.id).then(function (user) {
        return res.render('user_profile', {
            title: 'User Profile',
            profile_user: user
        })

    }).catch(err => {
        console.log("Error in finding user profile name: ", err);
        return res.status(500).send("Internal Server Error");
    });

}

//update the user profile
// module.exports.update= function(req,res){
//     if(req.user.id == req.params.id){
//         User.findByIdAndUpdate(req.params.id,req.body,function(err,user){
//             return res.redirect('back')
//         })
//     }
//     else{
//         return res.status(401).send('aunthorized')
//     }
// }

module.exports.update = async function (req, res) {
    // if (req.user.id == req.params.id) {
    //     User.findByIdAndUpdate(req.params.id, req.body).then(function (user) {
    //         return res.redirect('back')
    //     })
    //         .catch(err => {
    //             console.log("Error in updateing user name and email ", err);
    //             return res.status(500).send("Internal Server Error");
    //         });
    // }
    // else {
    //     req.flash('error', 'Unauthorized!');
    //     return res.status(401).send('aunthorized')
    // }

    try {
        let user = await User.findById(req.params.id);
        User.uploadedAvatar(req, res, function (err) {
            if (err) { console.log('****Multer Error', err) }
            console.log(req.file)

            user.name = req.body.name
            user.email = req.body.email

            if (req.file) {
                if (user.avatar) {
                    fs.unlinkSync(path.join(__dirname, '..', user.avatar))
                }

                // this is saving the path of the uploaded file into the avatar field in the user
                user.avatar = User.avatarPath + '/' + req.file.filename
            }
            user.save();
            return res.redirect('back')

        })
    }
    catch (err) {
        req.flash('error', err)
        return res.redirect('back')

    }

    if (req.user.id == req.params.id) {

    }
    else {
        req.flash('error', 'Unaunthorized')
        return res.status(401).send('Unaunthorized')
    }

}

// render the sign up page
module.exports.signUp = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile')

    }
    return res.render('user_sign_up', {
        title: 'codeial | Sign Up'
    })
}

// render the sign in page
module.exports.signIn = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile')

    }
    return res.render('user_sign_in', {
        title: 'codeial | Sign In'
    })
}

//get the sign up data
module.exports.create = async function (req, res) {
    // to do later

    if (req.body.password != req.body.confirm_password) {
        req.flash('error', 'Passwords do not match');
        return res.redirect('back')
    }
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {

            const user = await User.create(req.body);
            return res.redirect('/users/sign-in')

        }
        else {
            req.flash('success', 'You have signed up, login to continue!');
            return res.redirect('back')
        }


    }
    catch (err) {
        req.flash('error', err)
        console.error('Error is creating user while singing up:', err);
        // Handle the error as needed
        return res.status(500).send('Error is find the user is singing up');
    }

}

//get the sign in data and create a session for user    
module.exports.createSession = function (req, res) {

    req.flash('success', 'Logged in Successfully')
    return res.redirect('/')

}

module.exports.destroySession = function (req, res) {
    // req.flash('success', 'You have logged out!')

    // req.logout();

    req.logout(function (err) {
        if (err) {

            return next(err);
        }
        req.flash('success', 'You have logged out!')

        return res.redirect('/');
    });




}




// user sign out
// module.exports.signOut = function (req, res) {
//     res.clearCookie('user_id');
//     return res.redirect('/users/sign-in'); // Redirect to the sign-in page or any other page as per your application's flow.
// }
