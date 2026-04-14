const express = require('express');
const router = express.Router();
const { createUser, getUsers, getUserById, getUserByUsername, getUserByEmail, updateUser, deleteUser } = require('../controller/user');

router.post('/api/register', async (req, res) => {
    try {
        const user = await createUser(req.body);
        res.status(201).send({ message: "Tạo tài khoản thành công", data: user });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.get('/api/users', async (req, res) => {
    try {
        const users = await getUsers();
        res.status(200).send({ message: "Lấy danh sách người dùng thành công", data: users });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.get('/api/users/:id', async (req, res) => {
    try {
        const user = await getUserById(req.params.id);
        res.status(200).send({ message: "Lấy thông tin người dùng thành công", data: user });
    } catch (error) {
        res.status(404).send({ message: "Người dùng không tồn tại" });
    }
});

router.get('/api/users/username/:username', async (req, res) => {
    try {
        const user = await getUserByUsername(req.params.username);
        res.status(200).send({ message: "Lấy thông tin người dùng thành công", data: user });
    } catch (error) {
        res.status(404).send({ message: "Người dùng không tồn tại" });
    }
});

router.get('/api/users/email/:email', async (req, res) => {
    try {
        const user = await getUserByEmail(req.params.email);
        res.status(200).send({ message: "Lấy thông tin người dùng thành công", data: user });
    } catch (error) {
        res.status(404).send({ message: "Người dùng không tồn tại" });
    }
});

router.patch('/api/users/', async (req, res) => {
    try {
        const user = await getUserById(req.body.old._id);
        if (!user) {
            return res.status(404).send({ message: "Người dùng không tồn tại" });
        }
        const updatedUser = await updateUser(user, req.body.updateData);
        res.status(200).send({ message: "Cập nhật thông tin người dùng thành công", data: updatedUser });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.patch('/api/users/delete', async (req, res) => {
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


module.exports = router;