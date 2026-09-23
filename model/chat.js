const mongoose = require ('mongoose');

const chatSchema = new mongoose.Schema
(
    {
        name:{
            type: String,
            required: true
        },
        memberCount:
        {
            type: Number,
            default: 1
        },
        userList:
        [
            {
                username:{
                    type: String
                },
                role:{
                    type: String,
                    enum : ['admin', 'moderator', 'member']
                },
            },
        ],
        createdDate:
        {
            type: Date,
            default: Date.now
        },
        messages:
        [
            {
                sender:{
                    type: String
                },
                content:{
                    type: String
                },
                replyTo:{
                    type: String,
                    default: null
                },
                sentDate:{
                    type: Date,
                    default: Date.now
                },
                edited:{
                    type: Boolean,
                    default: false
                },
                deleted:{
                    type: Boolean,
                    default: false
                },
            },
        ],
        status:{
            type: String,
            enum: ["active", "deleted"],
            default: "active"
        }

    }
)

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;

