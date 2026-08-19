const express = require('express');
const rootRouter = express.Router();

const userRouter = require('../router/user');
const postRouter = require('../router/post');

rootRouter.use(userRouter);
rootRouter.use(postRouter);

module.exports = rootRouter;