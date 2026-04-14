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
        mongoose.connect("mongodb+srv://notandy_db_user:eq7tSHXBbnrlLv8R@cluster0.t8pnhwi.mongodb.net/");
        console.log("Connect to MongoDB database successfully!");
    } 
    catch (error) 
    {
        console.log(error);
    }
}

module.exports = {connectDB};