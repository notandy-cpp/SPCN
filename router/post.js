const express = require("express");
const router = express.Router();
const Post = require("../model/post");
const { authMiddleware: auth, adminRole } = require("../middleware/auth");

const {
  createPost,
  getPosts,
  getPostsByUserId,
  getPostById,
  updatePost,
  deletePost,
} = require("../controller/post");

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
    res
      .status(200)
      .send({ message: "Lấy danh sách bài viết thành công", data: posts });
  } catch (error) {
    res.status(error.statusCode || 500).send({ message: error.message });
  }
});

router.get("/api/posts/user/:user_id", async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const posts = await getPostsByUserId(user_id);
    res
      .status(200)
      .send({ message: "Lấy danh sách bài viết thành công", data: posts });
  } catch (error) {
    res.status(error.statusCode || 500).send({ message: error.message });
  }
});

router.get("/api/me/posts", auth, async (req, res) => {
  try {
    const user_id = req.user._id;
    const posts = await getPostsByUserId(user_id);
    res
      .status(200)
      .send({ message: "Lấy danh sách bài viết thành công", data: posts });
  } catch (error) {
    res.status(error.statusCode || 500).send({ message: error.message });
  }
});

router.get("/api/posts/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const post = await getPostById(id);
    res.status(200).send({ message: "Lấy bài viết thành công", data: post });
  } catch (error) {
    res.status(error.statusCode || 500).send({ message: error.message });
  }
});

// Update post
router.put("/api/posts/:id", auth, async (req, res) => {
  try {
    const user = req.user;
    const id = req.params.id;
    const updateData = {
      title: req.body.title,
      content: req.body.content,
    };
    const post = await updatePost(id, updateData, user);
    res
      .status(200)
      .send({ message: "Cập nhật bài viết thành công", data: post });
  } catch (error) {
    res.status(error.statusCode || 500).send({ message: error.message });
  }
});

router.put("/api/upvote/posts/:id", auth, async (req, res) => {
  try {
    const updateData = {
      $inc: { upVotes: 1 },
    };
    const post = await Post.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    res.status(200).send({ message: "Upvote bài viết thành công", data: post });
  } catch (error) {
    res.status(error.statusCode || 500).send({ message: error.message });
  }
});

// Delete post
router.delete("/api/posts/:id", auth, async (req, res) => {
  try {
    const user = req.user;
    const id = req.params.id;
    const post = await deletePost(id, user);
    res.status(200).send({ message: "Xóa bài viết thành công", data: post });
  } catch (error) {
    res.status(error.statusCode || 500).send({ message: error.message });
  }
});

module.exports = router;