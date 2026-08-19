// require('dotenv').config({path: "./.env"});
const express = require('express');
// const userRouter = require('./router/user');
// const {connectDB} = require('./db/db');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;

// require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);


// connectDB();

app.use(express.json);
app.use(express.urlencoded({extended : true}));
app.use(cookieParser);
// app.use(userRouter);


app.get('/', (req, res) =>
{
    res.send('Hello World!');
});

app.listen(port,  () =>
{
    console.log("App is running on port", port);
});


