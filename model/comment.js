const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    post_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    upVotes: {
      type: Number,
      default: 0,
    },
    upVotedBy: [
      {
        type: String,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    editStatus: [
      {
        editedAt: {
          type: Date,
          default: Date.now,
        },
        content: {
          type: String,
        },
      },
    ],
  }
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;