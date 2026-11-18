const Comment = require('../model/comment');
const User = require('../model/user');

const withUsername = async (comment) => {
  if (!comment) return comment;
  const c = comment.toObject ? comment.toObject() : comment;
  const user = await User.findById(c.user_id).select('username');
  c.username = user ? user.username : null;
  return c;
};

exports.createComment = async (data) => {
  const comment = await Comment.create(data);
  return withUsername(comment);
};

exports.getCommentsByPostId = async (post_id) => {
  const comments = await Comment.find({ post_id }).sort({ createdAt: 1 });
  return Promise.all(comments.map((c) => withUsername(c)));
};

exports.getCommentsByUserId = async (user_id) => {
  const comments = await Comment.find({ user_id }).sort({ createdAt: -1 });
  return Promise.all(comments.map((c) => withUsername(c)));
};

exports.getCommentById = async (id) => {
  const comment = await Comment.findById(id);
  return withUsername(comment);
};

exports.updateComment = async (id, updateData, user_id) => {
  const comment = await Comment.findById(id);
  if (!comment) {
    const err = new Error('Bình luận không tồn tại');
    err.statusCode = 404;
    throw err;
  }
  if (String(comment.user_id) !== String(user_id)) {
    const err = new Error('Bạn không có quyền sửa bình luận này');
    err.statusCode = 403;
    throw err;
  }
  if (updateData.content !== undefined && updateData.content !== comment.content) {
    comment.editStatus.push({
      editedAt: new Date(),
      content: comment.content,
    });
    comment.content = updateData.content;
  }
  await comment.save();
  return withUsername(comment);
};

exports.deleteComment = async (id, user) => {
  const comment = await Comment.findById(id);
  if (!comment) {
    const err = new Error('Bình luận không tồn tại');
    err.statusCode = 404;
    throw err;
  }
  const isOwner = String(comment.user_id) === String(user._id);
  const isAdmin = user.role === 'admin';
  if (!isOwner && !isAdmin) {
    const err = new Error('Bạn không có quyền xóa bình luận này');
    err.statusCode = 403;
    throw err;
  }
  await Comment.findByIdAndDelete(id);
  return { _id: id };
};