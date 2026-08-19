const mongoose = require ('mongoose');

const userSchema = new mongoose.Schema
(
    {
        username:
        {
            type: String,
            required : true,
            unique : true
        },
        password:
        {
            type: String,
            required : true
        },
        email:
        {
            type: String,
            required : true
        },
        status:
        {
            type: String,
            enum : ['active', 'inactive', 'deleted'],
        },
        createdAt:
        {
            type: Date,
            default: Date.now
        }
        
        


    }
)

const User = mongoose.model('User', userSchema);

module.exports = User;

