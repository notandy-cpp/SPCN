const express = require("express");
const router = express.Router();
const { authMiddleware: auth, adminRole } = require("../middleware/auth");

const userController = require("../controller/user");
const postController = require("../controller/post");
const commentController = require("../controller/comment");

// User management routes
router.get("/api/admin/users/", adminRole, async (req, res) => {
  try {
    const users = await userController.getUsers();
    res
      .status(200)
      .json({ message: "Lấy danh sách người dùng thành công", data: users });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.get("/api/admin/user/:id", adminRole, async (req, res) => {
  try {
    const user = await userController.getUserById(req.params.id);
    res
      .status(200)
      .json({ message: "Lấy thông tin người dùng thành công", data: user });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.post("/api/admin/user", adminRole, async (req, res) => {
  try {
    const user = await userController.createUser(req.body);
    res.status(201).json({ message: "Tạo người dùng thành công", data: user });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.put("/api/admin/user/:id", adminRole, async (req, res) => {
  try {
    const checkExist = await userController.checkUsernameEmailExist(
      req.body.username,
      req.body.email,
    );
    if (checkExist === 0) {
      const data = {
        username: req.body.username || req.user.username,
        name: req.body.name || req.user.name,
        email: req.body.email || req.user.email,
      };
      await userController.updateUser(req.params.id, data);
      res
        .status(200)
        .json({ message: "Cập nhật thông tin cá nhân thành công", data: user });
    } else if (checkExist === 1) {
      return res.status(400).json({ message: "Username đã tồn tại" });
    } else {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.delete("/api/admin/user/:id", adminRole, async (req, res) => {
  try {
    const user = await userController.deleteUser(req.params.id);
    res.status(200).json({ message: "Xóa người dùng thành công", data: user });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

// Post management routes
router.put("/api/admin/post/:id", adminRole, async (req, res) => {
  try {
    const post = await postController.getPostById(req.params.id);
    const user = req.user;
    const id = req.params.id;
    const updateData = {
      title: req.body.title,
      content: req.body.content,
    };
    await postController.updatePost(id, updateData, user);
    res
      .status(200)
      .json({ message: "Cập nhật bài viết thành công", data: post });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.delete("/api/admin/post/:id", adminRole, async (req, res) => {
  try {
    const user = req.user;
    const id = req.params.id;
    const post = await postController.deletePost(id);
    res.status(200).json({ message: "Xóa bài viết thành công", data: post });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

// Comment management routes
router.put("/api/comment/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const user_id = req.user._id.toString();
    const comment = await commentController.updateComment(
      id,
      req.body,
      user_id,
    );
    res
      .status(200)
      .json({ message: "Cập nhật bình luận thành công", data: comment });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.delete("/api/admin/comment/:id", adminRole, async (req, res) => {
  try {
    const id = req.params.id;
    const user = {
      _id: req.user._id.toString(),
      role: req.user.role,
    };
    await commentController.deleteComment(id, user);
    res.status(200).json({ message: "Xóa bình luận thành công" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

module.exports = router;