const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const Chat = require("./model/chat");

require("dotenv").config({ path: "./.env" });

const { connectDB } = require("./db/db");
const cookieParser = require("cookie-parser");
const rootRouter = require("./util/rootRouter");
const socketAuth = require("./middleware/socketAuth");

const app = express();
const port = process.env.PORT || 3000;

const cors = require("cors");

connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(rootRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Tạo HTTP server từ chính Express app hiện tại
const server = http.createServer(app);

// Gắn Socket.IO vào HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// Xác thực JWT cookie trước khi cho kết nối
io.use(socketAuth);

// Cho phép route/controller lấy Socket.IO instance
app.set("io", io);

// Xử lý kết nối đã xác thực
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.user.username);

  socket.on("join_chat", async (chatId, callback) => {
    try {
      if (typeof chatId !== "string") {
        return callback?.({
          success: false,
          message: "Chat ID không hợp lệ",
        });
      }

      const chat = await Chat.findById(chatId);

      if (!chat || chat.status !== "active") {
        return callback?.({
          success: false,
          message: "Chat không tồn tại hoặc đã bị xóa",
        });
      }

      const isMember = chat.userList.some(
        (member) => member.username === socket.user.username,
      );

      if (!isMember) {
        return callback?.({
          success: false,
          message: "Bạn không phải thành viên của chat này",
        });
      }

      socket.join(`chat:${chatId}`);

      callback?.({ success: true });
    } catch (error) {
      console.error("join_chat error:", error);

      callback?.({
        success: false,
        message: "Không thể tham gia chat",
      });
    }
  });

  socket.on("leave_chat", (chatId) => {
    if (typeof chatId === "string") {
      socket.leave(`chat:${chatId}`);
    }
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
  });
});

server.listen(port, () => {
  console.log("App is running on port", port);
});