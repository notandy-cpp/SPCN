const express = require("express");
const router = express.Router();
const Post = require("../model/post");
const User = require("../model/user");
const { authMiddleware: auth } = require("../middleware/auth");

const {
  createPost,
  getPosts,
  getPostsByUserId,
  getPostById,
  updatePost,
  deletePost,
} = require("../controller/post");

// helper to attach username to a single post (mirrors controller helper)
const attachUsername = async (post) => {
  if (!post) return post;
  const p = post.toObject ? post.toObject() : post;
  const user = await User.findById(p.user_id).select("username");
  p.username = user ? user.username : null;
  return p;
};

// Create a new post
router.post("/api/posts", auth, async (req, res) => {
  try {
    const data = {
      user_id: req.user._id,
      title: req.body.title,
      content: req.body.content,
    };
    const post = await createPost(data);
    res.status(201).send({ message: "Tạo bài viết thành công", data: post });
  } catch (error) {
    res.status(error.statusCode || 500).send({ message: error.message });
  }
});

// Get posts
router.get("/api/posts", async (req, res) => {
  try {
    const posts = await getPosts();
    res.status(200).send({ message: "Lấy danh sách bài viết thành công", data: posts });
  } catch (error) {
    res.status(error.statusCode || 500).send({ message: error.message });
  }
});

router.get("/api/posts/user/:user_id", async (req, res) => {
  try {
    const posts = await getPostsByUserId(req.params.user_id);
    res.status(200).send({ message: "Lấy danh sách bài viết thành công", data: posts });
  } catch (error) {
    res.status(error.statusCode || 500).send({ message: error.message });
  }
});

router.get("/api/me/posts", auth, async (req, res) => {
  try {
    const posts = await getPostsByUserId(req.user._id);
    res.status(200).send({ message: "Lấy danh sách bài viết thành công", data: posts });
  } catch (error) {
    res.status(error.statusCode || 500).send({ message: error.message });
  }
});

router.get("/api/posts/:id", async (req, res) => {
  try {
    const post = await getPostById(req.params.id);
    res.status(200).send({ message: "Lấy bài viết thành công", data: post });
  } catch (error) {
    res.status(error.statusCode || 500).send({ message: error.message });
  }
});

// Update post
router.put("/api/posts/:id", auth, async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
      content: req.body.content,
    };
    const post = await updatePost(req.params.id, updateData, req.user);
    res.status(200).send({ message: "Cập nhật bài viết thành công", data: post });
  } catch (error) {
    res.status(error.statusCode || 500).send({ message: error.message });
  }
});

// Upvote post — returns the updated post WITH username
// Upvote post — one vote per user
router.put("/api/upvote/posts/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send({ message: "Bài viết không tồn tại" });
    }

    const userId = String(req.user._id);
    // Only count the vote if this user hasn't voted yet
    if (!(post.upVotedBy || []).includes(userId)) {
      post.upVotedBy.push(userId);
      post.upVotes = (post.upVotes || 0) + 1;
      await post.save();
    }

    const withUser = await attachUsername(post);
    res.status(200).send({ message: "Upvote bài viết thành công", data: withUser });
  } catch (error) {
    res.status(error.statusCode || 500).send({ message: error.message });
  }
});

// Delete post
router.delete("/api/posts/:id", auth, async (req, res) => {
  try {
    const post = await deletePost(req.params.id, req.user);
    res.status(200).send({ message: "Xóa bài viết thành công", data: post });
  } catch (error) {
    res.status(error.statusCode || 500).send({ message: error.message });
  }
});

module.exports = router;