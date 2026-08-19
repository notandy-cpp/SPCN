const mongoose = require ('mongoose');

const postSchema = new mongoose.Schema
(
    {
        user_id: {
            type: String,
            require: true,
            unique: true,
        },
        title: {
            type: String,
            require: true,
        },
        content: {
            type: String,
            require: true,
        },
        createdAt: {
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
                title: 
                {
                    type: String,
                },
            },
        ],

        comments:
        [
            {
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
        ],
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
    }
)

const Post = mongoose.model('Post', postSchema);

module.exports = Post;

