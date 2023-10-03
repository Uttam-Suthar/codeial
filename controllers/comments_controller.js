const Comment = require('../models/comment')
const Post = require('../models/post')
const commentsMailer = require('../mailers/comments_mailer')
// const commentEmailWorker = require('../workers/comment_email_worker')
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker')
const Like = require('../models/like');
// const comment = new Comment()

// async apply
module.exports.create = async function (req, res) {
    try {
        let post = await Post.findById(req.body.post)
        if (post) {
            let comment = await Comment.create({
                content: req.body.content,
                // post:post._id
                post: req.body.post,
                user: req.user._id
            })
            post.comments.push(comment);
            post.save();

            comment = await comment.populate('user', 'name email');
            commentsMailer.newComment(comment)
            let job = queue.create('emails', comment).save(function (err) {
                if (err) {
                    console.log('Error in creating a queue', err)
                    return
                }
                console.log('job enqueued',job.id)
            })

            if (req.xhr) {
                // Similar for comments to fetch the user's id!
                // comment = await comment.populate('user', 'name');

                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Post created!"
                });
            }


            req.flash('success', 'Comment published!');

            return res.redirect('/')

        }
        else {
            req.flash('error', err);
            return res.status(404).send("Post not found");
        }
    }
    catch (err) {
        req.flash('error', 'Unauthorized!');
        console.log("Error in adding on post comment: ", err);
        return res.status(500).send("Internal Server Error");
    }

}

// or then catch

// module.exports.create = function (req, res) {
//     Post.findById(req.body.post).then(function (post) {
//         if (post) {
//             Comment.create({
//                 content: req.body.content,
//                 // post:post._id
//                 post: req.body.post,
//                 user: req.user._id
//             }).then(function (comment) {
//                 //handle err
//                 post.comments.push(comment);
//                 post.save();
//                 //or
//                 // post.save(function (err) {
//                 //     if (err) {
//                 //         // Handle the error
//                 //         return res.status(500).send(err);
//                 //     }

//                 //     return res.redirect('/');
//                 // });
//                 return res.redirect('/')

//             }).catch(function (err) {
//                 console.log("Error in adding on post comment: ", err);
//                 return res.status(500).send("Internal Server Error");
//             })
//         } else {
//             return res.status(404).send("Post not found");
//         }
//     }).catch(err => {
//         console.log("Error in finding post: ", err);
//         return res.status(500).send("Internal Server Error");
//     });
// }

// module.exports.destroy= function(req,res){
//     Comment.findById(req.params.id,function(err,comment){
//         if(comment.user==req.user.id){
//             let postId=comment.post;
//             comment.remove();
//             Post.findByIdAndUpdate(postId,{$pull:{comments:req.params.id}},function(err,post){
//                 return redirect('back')
//             })
//         }
//         else{
//             return res.redirect('back')

//         }
//     })
// }

// module.exports.destroy = function (req, res) {
//     Comment.findById(req.params.id).then(function (comment) {
//         if (comment.user == req.user.id) {
//             let postId = comment.post;
//             comment.deleteOne();
//             Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } }).then(function (post) {
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

module.exports.destroy = async function (req, res) {
    try {
        let comment = await Comment.findById(req.params.id)
        if (comment.user == req.user.id) {
            let postId = comment.post;
            comment.deleteOne();
            let post = await Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } })

            // CHANGE :: destroy the associated likes for this comment
            await Like.deleteMany({ likeable: comment._id, onModel: 'Comment' });

            // send the comment id which was deleted back to the views
            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }


            req.flash('success', 'Comment deleted!');

            return res.redirect('back')
        }
        else {
            req.flash('error', 'Unauthorized');
            return res.redirect('back')

        }
    }
    catch (err) {
        req.flash('error', err);
        console.log('Error', err)
        return
    }


}