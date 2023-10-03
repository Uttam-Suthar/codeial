const Post = require('../models/post')
const Comment = require('../models/comment')
const Like = require('../models/like');

// module.exports.create = function (req, res) {
//     Post.create({
//         content: req.body.content,
//         user: req.user._id
//     }).then(function (post) {
//         // if (err){
//         //     console.log('Error is creating a post');
//         //     return
//         // }
//         return res.redirect('back')
//     }).catch(function (err) {
//         console.log('Error is creating a post', err);
//     })
// }

// or asyn

module.exports.create = async function (req, res) {
    try {
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        })

        if (req.xhr) {
            // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
            post = await post.populate('user', 'name');

            return res.status(200).json({
                data: {
                    post: post,

                },
                message: 'Post created!'
            })
        }

        req.flash('success', 'Post published')
        return res.redirect('back')

    }
    catch (err) {
        // console.log('Error is creating a post', err);
        req.flash('error', err)
        return res.redirect('back')

    }

}

// module.exports.destroy = function (req, res) {
//     Post.findById(req.params.id).then(function (post) {
//         //.id means it convert the object id in the string
//         if (post.user == req.user.id) {
//             post.deleteOne()
//             Comment.deleteMany({ post: req.params.id }).then(function () {
//                 return res.redirect('back')
//             })
//             // .catch(err => {
//             //     console.error(err); })// Handle the error
//         }
//         else {
//             return res.redirect('back')

//         }
//     })
// }

// or async

module.exports.destroy = async function (req, res) {
    try {
        let post = await Post.findById(req.params.id)
        //.id means it convert the object id in the string
        if (post.user == req.user.id) {

            // CHANGE :: delete the associated likes for the post and all its comments' likes too
            await Like.deleteMany({ likeable: post, onModel: 'Post' });
            await Like.deleteMany({ _id: { $in: post.comments } });

            post.deleteOne()
            await Comment.deleteMany({ post: req.params.id })


            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }

            req.flash('success', 'Post and associated comments deleted')

            return res.redirect('back')


        }
        else {
            req.flash('error', 'You can not delete this post')

            return res.redirect('back')

        }
    }
    catch (err) {
        // console.log('Error is deleteing a post', err);
        req.flash('error', err)

        return res.redirect('back')

    }

}