const mongoose = require('mongoose');

// mongoose.connect(process.env.DATABASE_URL,
//     error =>{
//         if (error) {throw error;}
//         console.log("Connect to MongoDB database successfully!");
//     }
// );

const connectDB = async () =>
{
    try 
    {
        await mongoose.connect(process.env.DATABASE_URL)
        console.log("Connect to MongoDB database successfully!");
    } 
    catch (error) 
    {
        console.log(error);
    }
}

module.exports = {connectDB};