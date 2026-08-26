const mongoose = require ('mongoose');

const questionSchema = new mongoose.Schema
(
    {
        content: 
        {
            type: String,
            require: true,
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
        answer:
        [
            {
                content: 
                {
                    type: String,
                },
                score:
                {
                    type: Number,
                    default: 0,
                },
            },
        ],
    }
)

const User = mongoose.model('User', questionSchema);

module.exports = Question;

