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
    const chat = await createChat(req.body, req.user);
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

router.get("/api/chats/:chat_id", auth, async (req, res) => {
  try {
    const chat_id = req.params.chat_id;
    const user = req.user;
    const chat = await getChatById(chat_id, user);
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
    const sentMessage = await sendMessage(id, req.user, req.body);

    const io = req.app.get("io");

    if (io) {
      io.to(`chat:${id}`).emit("new_message", {
        chatId: id,
        message: sentMessage,
      });
    }

    return res.status(201).json({
      message: "Gui tin nhan thanh cong",
      data: sentMessage,
    });
  } catch (error) {
    res.status(error.statusCode || 500).send({ message: error.message });
  }
});

router.put("/api/messages/:chat_id", auth, async (req, res) => {
  try {
    const id = req.params.chat_id;
    const updatedMessage = await editMessage(id, req.user, req.body);

    const io = req.app.get("io");

    if (io) {
      io.to(`chat:${id}`).emit("message_updated", {
        chatId: id,
        message: updatedMessage,
      });
    }

    return res.status(200).json({
      message: "Sua tin nhan thanh cong",
      data: updatedMessage,
    });
  } catch (error) {
    res.status(error.statusCode || 500).send({ message: error.message });
  }
});

router.delete("/api/messages/:chat_id", auth, async (req, res) => {
  try {
    const id = req.params.chat_id;
    const index = req.body.index;
    const deletedMessage = await deleteMessage(id, req.user, index);

    console.log(deletedMessage);

    const io = req.app.get("io");



    if (io) {
      io.to(`chat:${id}`).emit("message_deleted", {
        chatId: id,
        message: deletedMessage,
      });
    }

    return res.status(200).json({
      message: "Xoa tin nhan thanh cong",
      data: deletedMessage,
    });
  } catch (error) {
    res.status(error.statusCode || 500).send({ message: error.message });
  }
});






module.exports = router;

