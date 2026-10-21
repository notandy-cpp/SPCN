const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const User = require("../model/user");

const socketAuth = async (socket, next) => {
  try {
    const cookieHeader = socket.handshake.headers.cookie;

    if (!cookieHeader) {
      return next(new Error("Không có quyền truy cập"));
    }

    const cookies = cookie.parse(cookieHeader);
    const token = cookies.token;

    if (!token) {
      return next(new Error("Token không tồn tại"));
    }

    const data = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(data._id);

    if (!user) {
      return next(new Error("Người dùng không tồn tại"));
    }

    if (user.status !== "active") {
      return next(new Error("Tài khoản không hoạt động"));
    }

    socket.user = {
      _id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
    };

    return next();
  } catch (error) {
    return next(new Error("Token không hợp lệ hoặc đã hết hạn"));
  }
};

module.exports = socketAuth;