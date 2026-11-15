const mongoose = require ('mongoose');

const commentSchema = new mongoose.Schema
(
    {
        // post_id:
        // {
        //     type: String,
        //     require: true,
        // },
        user_id: 
        {
            type: String,
            require: true,
            unique: true,
        },
        content: 
        {
            type: String,
            require: true,
        },
        upVotes:
        {
            type: Number,
            default: 0,
        },
        createdAt: 
        {
            type: Date,
            default: Date.now,
        },
        editStatus:
        [
            {
                editedAt: 
                {
                    type: Date,
                    default: Date.now,
                },
                content: 
                {
                    type: String,
                },
            },
        ],
    }
)

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;

