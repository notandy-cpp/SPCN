const Chat = require("../model/chat");
const bcrypt = require("bcrypt");
const { request } = require("express");
const jwt = require("jsonwebtoken");

// Create a new chat
const createChat = async (data) => {
    try {
        const chat = new Chat(data);
        await chat.save();
        return chat;
    }
    catch (error) {
        throw error;
    }
};

// Get all chats
const getChats = async(data) =>
{
    try
    {
        const username = data.username;
        // await Chat.find({ userList: {username: /${username}/i }, null, { skip: 10 }).exec();
        const chat = await Chat.find({ userList: {username: {$regex: username, $options:'i'} } }).exec();
        // find all documents
// await MyModel.find({});

// // find all documents named john and at least 18
// await MyModel.find({ name: 'john', age: { $gte: 18 } }).exec();

// // executes, name LIKE john and only selecting the "name" and "friends" fields
// await MyModel.find({ name: /john/i }, 'name friends').exec();

// // passing options
// await MyModel.find({ name: /john/i }, null, { skip: 10 }).exec();
        if(!chat)
        {
            const err = new Error();
            err.statusCode = 404;
            err.message = "Khong co doan chat nao ton tai";
            throw err;
        }

        return chat;
    }
    catch (error)
    {
        throw error;
    }
}

const getChatById = async(id) =>
{
    try
    {
        const chat = await Chat.findById(id);
        if(!chat)
        {
            const err = new Error();
            err.statusCode = 404;
            err.message = "Doan chat khong ton tai";
            throw err;
        }
        return chat;
    }
    catch (error)
    {
        throw error;
    }
}

const deleteChat = async(id, user) =>
{
    try
    {
        const chat = await Chat.findById(id);
        if(!chat)
        {
            const err = new Error();
            err.statusCode = 404;
            err.message = "Doan chat khong ton tai";
            throw err;
        }

        const adminList = chat.userList;

        let checkAuth = false;
        adminList.forEach(member => {if (member.role === "admin" && member.username === user.username) {checkAuth = true;}});
        if(!checkAuth)
        {
            const err = new Error();
            err.statusCode = 403;
            err.message = "Bạn không có quyền chỉnh sửa doan chat này";
            throw err;
        }
        
        chat.status = "deleted";
        await chat.save();
        return chat;
    }
    catch (error)
    {
        throw error;
    }
}

const editChat = async(id, updateData) =>
{
    try
    {
        const chat = await Chat.findById(id);
        if(!chat)
        {
            const err = new Error();
            err.statusCode = 404;
            err.message = "Doan chat khong ton tai";
            throw err;
        }
        await chat.set(updateData);
        await chat.save();
        return chat;
    }
    catch (error)
    {
        throw error;
    }
}




module.exports = {
    createChat,
    getChats,
    getChatById,
    deleteChat,
    editChat
};