const express = require('express');

require('dotenv').config({path: "./.env"});
const {connectDB} = require('./db/db');
const cookieParser = require('cookie-parser');
const rootRouter = require("./util/rootRouter");

const app = express();

const port = process.env.PORT;


const cors = require("cors");
// require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);




connectDB();
console.log(process.env.DATABASE_URL);

app.use(
  cors(
    {
      origin: "http://localhost:5173",
      credentials: true,
    }
  ),
);

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());

app.use(rootRouter);

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
app.get('/', (req, res) =>
{
    res.send('Hello World!');
});

app.listen(port, "0.0.0.0",  () =>
{
    console.log("App is running on port", port);
});


