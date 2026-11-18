const express = require("express");
const router = express.Router();
const { authMiddleware: auth } = require("../middleware/auth");

const {
  createComment,
  getCommentsByPostId,
  getCommentsByUserId,
  getCommentById,
  updateComment,
  deleteComment,
} = require("../controller/comment");

// Create a new comment
router.post("/api/comment", auth, async (req, res) => {
  try {
    const data = {
      post_id: req.body.post_id,
      user_id: req.user._id,
      content: req.body.content,
    };
    if (!data.post_id) {
      return res.status(400).json({ message: "Thiếu post_id" });
    }
    const comment = await createComment(data);
    res.status(201).json({ message: "Tạo bình luận thành công", data: comment });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

// Get comments by post
router.get("/api/comment/post/:post_id", async (req, res) => {
  try {
    const comments = await getCommentsByPostId(req.params.post_id);
    res.status(200).json({
      message: "Lấy danh sách bình luận thành công",
      data: { comments, post_id: req.params.post_id },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.get("/api/comment/user/:user_id", async (req, res) => {
  try {
    const comments = await getCommentsByUserId(req.params.user_id);
    res.status(200).json({
      message: "Lấy danh sách bình luận thành công",
      data: { comments, user_id: req.params.user_id },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.get("/api/comment/:id", async (req, res) => {
  try {
    const comment = await getCommentById(req.params.id);
    res.status(200).json({ message: "Lấy bình luận thành công", data: comment });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

// Update comment
router.put("/api/comment/:id", auth, async (req, res) => {
  try {
    const comment = await updateComment(
      req.params.id,
      req.body,
      req.user._id.toString()
    );
    res.status(200).json({ message: "Cập nhật bình luận thành công", data: comment });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

// Delete comment
router.delete("/api/comment/:id", auth, async (req, res) => {
  try {
    await deleteComment(req.params.id, req.user);
    res.status(200).json({ message: "Xóa bình luận thành công" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

module.exports = router;