const express = require('express');
const userRouter = require('./router/user');
const {connectDB} = require('./db/db');
const app = express();
const port = process.env.PORT || 3001;
require('dotenv').config();
// require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);


connectDB();

app.use(express.json);
app.use(express.urlencoded({extended : true}));

app.use(userRouter);

app.get('/', (req, res) =>
{
    res.send('Hello World!');
});

app.listen(port, "0.0.0.0", () =>
{
    console.log("App is running on port", port);
});


