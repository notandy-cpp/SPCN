const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../model/user");
const { authMiddleware: auth, adminRole } = require("../middleware/auth");
const {
  createUser,
  getUsers,
  getUserById,
  getUserByUsername,
  getUserByEmail,
  updateUser,
  deleteUser,
  loginUser,
  checkUsernameEmailExist,
} = require("../controller/user");

// Authentication
router.post("/api/register", async (req, res) => {
  try {
    console.log(req.body);
    req.body.role = "admin";
    const user = await createUser(req.body);
    res.status(201).send({ message: "Tạo tài khoản thành công", data: user });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.post("/api/login", async (req, res) => {
  try {
    const user = await loginUser(req.body.username, req.body.password);
    const payload = {
      _id: user._id,
      username: user.username,
      email: user.email,
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    res.cookie("token", token, { httpOnly: true });
    res.status(200).send({
      message: "Đăng nhập thành công",
      user: { _id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(error.statusCode || 500).send({ error: error.message });
  }
});

router.post("/api/logout", auth, (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).send({ message: "Đăng xuất thành công" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/api/profile", auth, (req, res) => {
  try {
    res
      .status(200)
      .send({ message: "Lấy thông tin cá nhân thành công", data: req.user });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// router.patch("/api/profile", auth, async (req, res) => {
//   try {
//     const checkExist = await checkUsernameEmailExist(
//       req.body.username,
//       req.body.email,
//     );
//     if (!checkExist) {
//       const data = {
//         username: req.body.username || req.user.username,
//         name: req.body.name || req.user.name,
//         email: req.body.email || req.user.email,
//       };
//       await updateUser(req.user, data);
//       res
//         .status(200)
//         .send({ message: "Cập nhật thông tin cá nhân thành công" });
//     } else return res.status(400).send({ message: "Username đã tồn tại" });
//   } catch (error) {
//     res.status(500).send({ error: error.message });
//   }
// });

router.patch("/api/profile", auth, async (req, res) => {
  try {
    const checkExist = await checkUsernameEmailExist(
      req.body.username,
      req.body.email,
    );
    if (checkExist === 0) {
      const data = {
        username: req.body.username || req.user.username,
        name: req.body.name || req.user.name,
        email: req.body.email || req.user.email,
      };
      await updateUser(req.user, data);
      res
        .status(200)
        .send({ message: "Cập nhật thông tin cá nhân thành công" });
    } else if (checkExist === 1) {
      return res.status(400).send({ message: "Username đã tồn tại" });
    } else {
      return res.status(400).send({ message: "Email đã tồn tại" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


// Admin routes
router.get("/api/users", adminRole, async (req, res) => {
  try {
    const users = await getUsers();
    res
      .status(200)
      .send({ message: "Lấy danh sách người dùng thành công", data: users });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.patch("/api/users/", adminRole, async (req, res) => {
  try {
    const user = await getUserById(req.body.old._id);
    if (!user) {
      return res.status(404).send({ message: "Người dùng không tồn tại" });
    }
    const updatedUser = await updateUser(user, req.body.updateData);
    res.status(200).send({
      message: "Cập nhật thông tin người dùng thành công",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.patch("/api/users/delete", adminRole, async (req, res) => {
  try {
    const user = await getUserById(req.body._id);
    if (!user) {
      return res.status(404).send({ message: "Người dùng không tồn tại" });
    }
    await deleteUser(user);
    res.status(200).send({ message: "Xóa người dùng thành công" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/api/users/:id", async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    res
      .status(200)
      .send({ message: "Lấy thông tin người dùng thành công", data: user });
  } catch (error) {
    res.status(404).send({ message: "Người dùng không tồn tại" });
  }
});

//Get user data

router.get("/api/users/username/:username", async (req, res) => {
  try {
    const user = await getUserByUsername(req.params.username);
    res
      .status(200)
      .send({ message: "Lấy thông tin người dùng thành công", data: user });
  } catch (error) {
    res.status(404).send({ message: "Người dùng không tồn tại" });
  }
});

router.get("/api/users/email/:email", async (req, res) => {
  try {
    const user = await getUserByEmail(req.params.email);
    res
      .status(200)
      .send({ message: "Lấy thông tin người dùng thành công", data: user });
  } catch (error) {
    res.status(404).send({ message: "Người dùng không tồn tại" });
  }
});

module.exports = router;