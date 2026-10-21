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
        const chat = await Chat.find().exec();
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

        function matchedUsername(chat)
        { 
            let len = chat.userList.length;
            for (let i = 0; i < len; i++) 
            {
                if (username === chat.userList[i].username) return true;
            }
            return false;
        }

        let resultChat = chat.filter(matchedUsername);
        return resultChat;
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

const sendMessage = async (id, user, data) =>
{
    try {
        const { content, replyTo = null } = data;
        if (!content.trim()) 
        {
            const err = new Error();
            err.statusCode = 400;
            err.message = "Tin nhan khong hop le";
            throw err;
        }
        const chat = await Chat.findById(id);
        
        if (!chat){
            const err = new Error();
            err.statusCode = 404;
            err.message = "Doan chat khong ton tai";
            throw err;
            
        }
        const isMember = chat.userList.some(
            (member) => member.username === user.username
        );

        if (!isMember){
            const err = new Error();
            err.statusCode = 403;
            err.message = "Nguoi dung khong thuoc doan chat";
            throw err;
        }

        chat.messages.push({
            sender: user.username,
            content: content.trim(),
            replyTo,
        });

        await chat.save();
        const message = chat.messages[chat.messages.length - 1];
        return message;


    } catch (error) {
        throw error;
    }
}

const editMessage = async (id, user, data) =>
{
    try {
        const { content, index = null } = data;
        if (!content.trim()) 
        {
            const err = new Error();
            err.statusCode = 400;
            err.message = "Tin nhan khong hop le";
            throw err;
        }
        const chat = await Chat.findById(id);
        
        if (!chat){
            const err = new Error();
            err.statusCode = 404;
            err.mecssage = "Doan chat khong ton tai";
            throw err;
            
        }
        
        

        if (!chat.messages[index].sender === user.username)
        {
            const err = new Error();
            err.statusCode = 400;
            err.mecssage = "Khong the sua tin nhan nguoi dung khac";
            throw err;
        }
        
        

        const message = {
            content : content.trim(),
            edited : true,
        }

            chat.messages[index] = {
            ...message
        }



        await chat.save();
        
        return chat.messages[index];


    } catch (error) {
        throw error;
    }
}

const deleteMessage = async (id, user, index) =>
{
    try {
        const chat = await Chat.findById(id);
        
        if (!chat){
            const err = new Error();
            err.statusCode = 404;
            err.mecssage = "Doan chat khong ton tai";
            throw err;
            
        }
                
        const adminList = chat.userList;

        let checkAuth = false;
        adminList.forEach(member => {if (member.role === "admin" && member.username === user.username || (chat.messages[index].sender === user.username) ) {checkAuth = true;}});
        if(!checkAuth)
        {
            const err = new Error();
            err.statusCode = 403;
            err.message = "Bạn không có quyền xoa tin nhan này";
            throw err;
        }
        
        chat.messages[index].deleted = true;

        await chat.save();
        
        return chat.messages[index];


    } catch (error) {
        throw error;
    }
}




module.exports = {
    createChat,
    getChats,
    getChatById,
    deleteChat,
    editChat,
    sendMessage,
    editMessage,
    deleteMessage,
};