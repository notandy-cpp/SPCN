const jwt = require('jsonwebtoken');
const User = require('../model/user');

const checkToken = async(token) => {
    try {
        const data = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findOne({ _id: data._id });
        return user;
    } catch (error) {
        throw error;
    }
}

// Xác thực người dùng role user
const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Không có quyền truy cập' });
    try {
        const user = await checkToken(token);
        if (!user) return res.status(401).json({ message: 'Không có quyền truy cập' });
        if (user.status !== 'active') return res.status(403).json({ message: 'Không có quyền truy cập' });
        req.user = { _id: user._id, username: user.username,name: user.name, email: user.email };
        next();
    } catch (error) {
        throw error;
    }
}

// Middleware xác thực người dùng role admin
const adminRole = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Không có quyền truy cập' });
    try {
        const user = await checkToken(token);
        if (!user) return res.status(401).json({ message: 'Không có quyền truy cập' });
        if (user.role !== 'admin') return res.status(403).json({ message: 'Không có quyền truy cập' });
        req.user = { _id: user._id, username: user.username,name: user.name, email: user.email };
        next();
    } catch (error) {
        throw error;
    }

}

module.exports = { authMiddleware, adminRole };