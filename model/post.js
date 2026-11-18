const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
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
        title: {
          type: String,
        },
      },
    ],
    comments: [
      {
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
      },
    ],
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
  }
);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;