const Comment = require("../model/comment");
const Post = require("../model/post");
const User = require("../model/user");

// Create a new comment
const createComment = async (data) => {
  try {
    const comment = new Comment(data);
    await comment.save();
    return comment;
  } catch (error) {
    throw error;
  }
};

// Get comments
const getCommentsByPostId = async (post_id) => {
  try {
    const comments = await Comment.find({ post_id });
    return comments;
  } catch (error) {
    throw error;
  }
};

const getCommentsByUserId = async (user_id) => {
  try {
    const comments = await Comment.find({ user_id });
    return comments;
  } catch (error) {
    throw error;
  }
};

const getCommentById = async (id) => {
  try {
    const comment = await Comment.findById(id);
    if (!comment) {
      const err = new Error();
      err.statusCode = 404;
      err.message = "Bình luận không tồn tại";
      throw err;
    }
    return comment;
  } catch (error) {
    throw error;
  }
};

// Update comment
const updateComment = async (id, updateData, user_id) => {
  try {
    const comment = await getCommentById(id);
    if (comment.user_id !== user_id) {
      const err = new Error();
      err.statusCode = 403;
      err.message = "Bạn không có quyền chỉnh sửa bình luận này";
      throw err;
    }
    updateData.editStatus = {
      editedAt: new Date(),
      content: comment.content,
    };
    await comment.set(updateData);
    await comment.save();
    return comment;
  } catch (error) {
    throw error;
  }
};

// Delete comment
const deleteComment = async (id, user) => {
  try {
    const comment = await getCommentById(id);
    if (comment.user_id != user._id && user.role != "admin") {
      const err = new Error();
      err.statusCode = 403;
      err.message = "Bạn không có quyền xóa bình luận này";
      throw err;
    }
    comment.status = "deleted";
    await comment.save();
    return comment;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createComment,
  getCommentsByPostId,
  getCommentsByUserId,
  getCommentById,
  updateComment,
  deleteComment,
};