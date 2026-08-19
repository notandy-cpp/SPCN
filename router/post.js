const express = require("express");
const router = express.Router();
const Comment = require("../model/comment");
const { authMiddleware: auth, adminRole } = require("../middleware/auth");

const {
  createComment,
  getCommentsByPostId,
  getCommentsByUserId,
  getCommentById,
  updateComment,
  deleteComment,
} = require("../controller/comment");

// Create a new comment
router.post("/comment", auth, async (req, res) => {
  try {
    const user_id = req.user._id;
    req.body.user_id = user_id;
    const comment = await createComment(req.body);
    res
      .status(201)
      .json({ message: "Tạo bình luận thành công", data: comment });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

// Get comments
router.get("/comment/post/:post_id", async (req, res) => {
  try {
    const post_id = req.params.post_id;
    const comments = await getCommentsByPostId(post_id);
    res.status(200).json({
      message: "Lấy danh sách bình luận thành công",
      data: { comments, post_id: post_id },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.get("/comment/user/:user_id", async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const comments = await getCommentsByUserId(user_id);
    res.status(200).json({
      message: "Lấy danh sách bình luận thành công",
      data: { comments, user_id: user_id },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

// Update comment
router.put("/comment/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    await updateComment(id, req.body, req.user);
    res.status(200).json({ message: "Cập nhật bình luận thành công" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

// Delete comment
router.delete("/comment/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    await deleteComment(id, req.user);
    res.status(200).json({ message: "Xóa bình luận thành công" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

module.exports = router;