const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
    },

    // this defind the object id of the like objects
    likeable: {
        type: mongoose.Schema.Types.ObjectId,
        require:true,
        refPath: 'onModel'
    },
    //this field is use for definding the type of like objects since this is dynamic refenc3
    onModel:{
        type:String,
        require:true,
        enum:['Post','Comment']
    }
}, {
    timestamps: true
})

const Like = mongoose.model('Like', likeSchema)

module.exports = Like;
