const Post = require('../models/post')
const User = require('../models/user')
// module.exports.home = function (req, res) {
//     // console.log(req.cookies)
//     //change the cookies value
//     // res.cookie('user_id',25)
//     // return res.end('<h1>Express is up for codeial!')
//     // Post.find({}).then(function (posts) {

//     //     return res.render('home', {
//     //         title: 'Codeial | Home',
//     //         posts: posts
//     //     })
//     // }).catch(function (err) {
//     //     console.log('error in displaying post', err);

//     // })
//     // populate the user for each post
//     // Post.find({}).populate('user').exec().then(function (posts) {

//     //     return res.render('home', {
//     //         title: 'Codeial | Home',
//     //         posts: posts
//     //     })
//     // }).catch(function (err) {
//     //     console.log('error in displaying post', err);

//     // })

//     Post.find({})
//         .populate('user')
//         .populate({
//             path: 'comments',
//             populate: {
//                 path: 'user'
//             }

//         })
//         .exec().then(function (posts) {
//             User.find({}).then(function (users) {
//                 return res.render('home', {
//                     title: 'Codeial | Home',
//                     posts: posts,
//                     all_users: users
//                 })

//             }).catch(err => {
//                 console.log("Error in finding user: ", err);
//                 return res.status(500).send("Internal Server Error");
//             });

//         }).catch(function (err) {
//             console.log('error in displaying post', err);

//         })


//     // return res.render('home',{
//     //     title:'Home'
//     // })
// }

// or async

module.exports.home = async function (req, res) {
    try {
        // populate the user of each post

        let posts = await Post.find({})
            .sort('-createdAt')
            .populate('user')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user'
                },
                populate: {
                    path: 'likes'
                }
            }).populate('comments')
            .populate('likes');

        let users = await User.find({})
        return res.render('home', {
            title: 'Codeial | Home',
            posts: posts,
            all_users: users
        })
    }
    catch (err) {
        console.log('error in displaying post', err);
        return res.status(500).send("Internal Server Error");

    }

}

// module.exports.actionName= function(req,res){}

// using then
// Post.find({}).populate('comment').exex().then(function())

// async
// let posts=Post.find({}).populate('comment').exex()

// posts.then()

