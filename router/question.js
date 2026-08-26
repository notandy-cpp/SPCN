const express = require("express");
const router = express.Router();
const Question = require("../model/question");
const { authMiddleware: auth, adminRole } = require("../middleware/auth");

const {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
} = require("../controller/question");

// Create a new question
router.post("/api/questions", adminRole, async (req, res) => {
  try {
    const data = {
      content: req.body.content,
      content: req.body.answer,
    };
    const question = await createQuestion(data);
    res.status(201).send({ message: "Tạo cau hoi thành công", data: question });
  } catch (error) {
    res.status(error.statusCode || 500).send({ message: error.message });
  }
});

// Get questions
router.get("/api/questions", auth, async (req, res) => {
  try {
    const questions = await getQuestions();
    res
      .status(200)
      .send({ message: "Lấy danh sách cau hoi thành công", data: questions });
  } catch (error) {
    res.status(error.statusCode || 500).send({ message: error.message });
  }
});


router.get("/api/questions/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const question = await getQuestionById(id);
    res.status(200).send({ message: "Lấy cau hoi thành công", data: question });
  } catch (error) {
    res.status(error.statusCode || 500).send({ message: error.message });
  }
});

// Update question
router.put("/api/questions/:id", adminRole, async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = {
      content: req.body.content,
      content: req.body.answer,
    };
    const question = await updateQuestion(id, updateData);
    res
      .status(200)
      .send({ message: "Cập nhật cau hoi thành công", data: question });
  } catch (error) {
    res.status(error.statusCode || 500).send({ message: error.message });
  }
});


// Delete question
router.delete("/api/questions/:id", adminRole, async (req, res) => {
  try {
    const id = req.params.id;
    const question = await deleteQuestion(id);
    res.status(200).send({ message: "Xóa cau hoi thành công", data: question });
  } catch (error) {
    res.status(error.statusCode || 500).send({ message: error.message });
  }
});

module.exports = router;