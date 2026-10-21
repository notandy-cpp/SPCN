const express = require("express");
const router = express.Router();
const Chat = require("../model/chat");
const { authMiddleware: auth, adminRole } = require("../middleware/auth");

const {
    createChat,
    getChats,
    getChatById,
    deleteChat,
    editChat,
    sendMessage,
    editMessage,
    deleteMessage,
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

router.post("/api/messages/:chat_id", auth, async (req, res) => {
  try {
    const id = req.params.chat_id;
    const sent_message = await sendMessage(id, req.user, req.body);
    res.status(201).send({ message: "Gui tin nhan thanh cong", data: sent_message});
  } catch (error) {
    res.status(error.statusCode || 500).send({ message: error.message });
  }
});

router.put("/api/messages/:chat_id ", auth, async (req, res) => {
  try {
    const id = req.params.chat_id;
    const index = req.body.index;
    const target_message = await editMessage(id, req.user, req.body);
    res.status(201).send({ message: "Sua tin nhan thanh cong", data: target_message});
  } catch (error) {
    res.status(error.statusCode || 500).send({ message: error.message });
  }
});

router.delete("/api/messages/:chat_id ", auth, async (req, res) => {
  try {
    const id = req.params.chat_id;
    const index = req.body.index;
    const target_message = await deleteMessage(id, req.user, index);
    res.status(201).send({ message: "Xoa tin nhan thanh cong", data: target_message});
  } catch (error) {
    res.status(error.statusCode || 500).send({ message: error.message });
  }
});






module.exports = router;

