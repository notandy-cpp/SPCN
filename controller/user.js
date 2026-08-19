const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Create a new user
const createUser = async (userData) => {
  try {
    const user = new User(userData);
    const available = await checkUsernameEmailExist(
      userData.username,
      userData.email,
    );
    if (!available) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(userData.email)) {
        const err = new Error("Email không hợp lệ");
        err.statusCode = 400;
        throw err;
      }
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      user.password = hashedPassword;
      await user.save();
      return user;
    } else if (available === 1) {
      const err = new Error("Username đã tồn tại");
      err.statusCode = 409;
      throw err;
    } else {
      const err = new Error("Email đã tồn tại");
      err.statusCode = 409;
      throw err;
    }
  } catch (error) {
    throw error;
  }
};

// Get users
const getUsers = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    throw error;
  }
};

// Get user by ID
const getUserById = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      const err = new Error("Người dùng không tồn tại");
      err.statusCode = 404;
      throw err;
    }
    return user;
  } catch (error) {
    throw error;
  }
};

// Get user by username
const getUserByUsername = async (username) => {
  try {
    const user = await User.findOne({ username });
    if (!user) {
      const err = new Error("Người dùng không tồn tại");
      err.statusCode = 404;
      throw err;
    }
    return user;
  } catch (error) {
    throw error;
  }
};

// Get user by email
const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      const err = new Error("Người dùng không tồn tại");
      err.statusCode = 404;
      throw err;
    }
    return user;
  } catch (error) {
    throw error;
  }
};

// Update user
const updateUser = async (user, updateData) => {
  try {
    user.set(updateData);
    await user.save();
    return user;
  } catch (error) {
    throw error;
  }
};

// Delete user (soft delete)
const deleteUser = async (user) => {
  try {
    user.status = "deleted";
    await user.save();
    return user;
  } catch (error) {
    throw error;
  }
};

const loginUser = async (username, password) => {
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      const err = new Error("Người dùng không tồn tại");
      err.statusCode = 404;
      throw err;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const err = new Error("Mật khẩu không chính xác");
      err.statusCode = 401;
      throw err;
    }
    return user;
  } catch (error) {
    throw error;
  }
};

const checkUsernameEmailExist = async (username, email) => {
  try {
    const usernameCheck = await User.findOne({ username });
    const emailCheck = await User.findOne({ email });
    if (usernameCheck) {
      return 1; // Username hoặc email đã tồn tại
    }
    if (emailCheck) {
      return 2; // Email đã tồn tại
    }
    return 0; // Username và email đều chưa tồn tại
  } catch (error) {
    throw error;
  }
};
module.exports = {
  createUser,
  getUsers,
  getUserById,
  getUserByUsername,
  getUserByEmail,
  updateUser,
  deleteUser,
  loginUser,
  checkUsernameEmailExist,
};