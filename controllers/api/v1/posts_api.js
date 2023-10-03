const Post = require('../../../models/post')
const Comment = require('../../../models/comment')

module.exports.index=async function(req,res){

    let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        })

    return res.json({
        message:'List of posts',
        // post:[]
        post:posts
    })
}

module.exports.destroy = async function (req, res) {
    try {
        let post = await Post.findById(req.params.id)
        //.id means it convert the object id in the string
        if (post.user == req.user.id) {
            post.deleteOne()
            await Comment.deleteMany({ post: req.params.id })


            // if (req.xhr) {
            //     return res.status(200).json({
            //         data: {
            //             post_id: req.params.id
            //         },
            //         message: "Post deleted"
            //     });
            // }

            // req.flash('success', 'Post and associated comments deleted')

            // return res.redirect('back')
            return res.json(200,{
                message:"Post and associated comments deleted"
            })


        }
        else {
            // req.flash('error', 'You can not delete this post')

            // return res.redirect('back')
            return res.json(401,{
                message:'You cannot delete this post'
            })

        }
    }
    catch (err) {
        console.log('Error is deleteing a post', err);
     

        // return res.redirect('back')
        return res.json(500,{

            message:"Internal Server Error"
        })

    }

}