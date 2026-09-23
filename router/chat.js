const express = require("express");
const router = express.Router();
const Chat = require("../model/chat");
const { authMiddleware: auth, adminRole } = require("../middleware/auth");

const {
    createChat,
    getChats,
    getChatById,
    deleteChat,
    editChat
} = require("../controller/chat");

// Create a new chat
router.post("/api/chats", auth, async (req, res) => {
  try {
    const chat = await createChat(req.body);
    res.status(201).send({ message: "Tạo chat thanh cong", data: chat});
  } catch (error) {
    res.status(error.statusCode || 500).send({ message: error.message });
  }
});

// Get chats
router.get("/api/chats", auth, async (req, res) => {
  try {
    const chats = await getChats(req.user);
    res
      .status(200)
      .send({ message: "Lấy danh sách chat thành công", data: chats });
  } catch (error) {
    res.status(error.statusCode || 500).send({ message: error.message });
  }
});

router.get("/api/chats/:chat_id", async (req, res) => {
  try {
    const chat_id = req.params.chat_id;
    const chat = await getChatById(chat_id);
    res
      .status(200)
      .send({ message: "Tai doan chat thành công", data: chat });
  } catch (error) {
    res.status(error.statusCode || 500).send({ message: error.message });
  }
});


// Edit chat
router.put("/api/chats/:chat_id", auth, async (req, res) => {
  try {
    const id = req.params.chat_id;
    const updateData = req.body;
    const chat = await editChat(id, updateData);
    res
      .status(200)
      .send({ message: "Cập nhật doan chat thành công", data: chat });
  } catch (error) {
    res.status(error.statusCode || 500).send({ message: error.message });
  }
});


// Delete chat
router.delete("/api/chats/:chat_id", auth, async (req, res) => {
  try {
    const user = req.user;
    const id = req.params.chat_id;
    const chat = await deleteChat(id, user);
    res.status(200).send({ message: "Xóa doan chat thành công", data: chat});
  } catch (error) {
    res.status(error.statusCode || 500).send({ message: error.message });
  }
});

module.exports = router;