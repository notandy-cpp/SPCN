const express = require('express');
const rootRouter = express.Router();

const userRouter = require('../router/user');
const postRouter = require('../router/post');
const commentRouter = require('../router/comment');
const questionRouter = require('../router/question');
const chatRouter = require('../router/chat');

rootRouter.use(userRouter);
rootRouter.use(postRouter);
rootRouter.use(commentRouter);
rootRouter.use(questionRouter);
rootRouter.use(chatRouter);

module.exports = rootRouter;