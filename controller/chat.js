const Chat = require("../model/chat");
const bcrypt = require("bcrypt");
const { request } = require("express");
const jwt = require("jsonwebtoken");

// Create a new chat
const createChat = async (data, user) => {
    try {
        if (!user?.username) {
            const err = new Error("Chua dang nhap");
            err.statusCode = 401;
            throw err;
        }

        if (typeof data.name !== "string" || !data.name.trim()) {
            const err = new Error("Ten nhom khong hop le");
            err.statusCode = 400;
            throw err;
        }

        // Keep only the other members, ignoring whatever the client says about roles
        const others = Array.isArray(data.userList) ? data.userList : [];
        const seen = new Set([user.username]);
        const members = [{ username: user.username, role: "admin" }];

        for (const m of others) {
            const username = typeof m === "string" ? m : m?.username;
            if (!username || seen.has(username)) continue;
            seen.add(username);
            members.push({ username, role: "member" });
        }

        const chat = new Chat({
            name: data.name.trim(),
            userList: members,
            memberCount: members.length,
        });
        await chat.save();
        return chat;
    } catch (error) {
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

const getChatById = async(id, user) =>
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

        console.log(user);
        console.log(chat.userList);

        const isMember = chat.userList.some(
            (member) => member.username === user.username
        );

        if (!isMember){
            const err = new Error();
            err.statusCode = 403;
            err.message = "Nguoi dung khong thuoc doan chat";
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
        if (typeof content !== "string" || !content.trim()) 
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

const editMessage = async (id, user, data) => {
  try {
    const { content, index } = data;

    if (typeof content !== "string" || !content.trim()) {
      const err = new Error("Tin nhan khong hop le");
      err.statusCode = 400;
      throw err;
    }

    const chat = await Chat.findById(id);

    if (!chat || chat.status !== "active") {
      const err = new Error("Doan chat khong ton tai hoac da bi xoa");
      err.statusCode = 404;
      throw err;
    }

    

    if (
      !Number.isInteger(index) ||
      index < 0 ||
      index >= chat.messages.length
    ) {
      const err = new Error("Vi tri tin nhan khong hop le");
      err.statusCode = 400;
      throw err;
    }

    const message = chat.messages[index];

    if (message.deleted) {
      const err = new Error("Tin nhan da bi xoa");
      err.statusCode = 400;
      throw err;
    }

    if (message.sender !== user.username) {
      const err = new Error("Khong the sua tin nhan nguoi dung khac");
      err.statusCode = 403;
      throw err;
    }

    message.content = content.trim();
    message.edited = true;

    await chat.save();

    return message;
  } catch (error) {
    throw error;
  }
};


const deleteMessage = async (id, user, index) =>
{
    try {
        const chat = await Chat.findById(id);
        
        if (!chat){
            const err = new Error();
            err.statusCode = 404;
            err.message = "Doan chat khong ton tai";
            throw err;
            
        }
        
        

        if (
            !Number.isInteger(index) ||
            index < 0 ||
            index >= chat.messages.length    ) 
        {
            const err = new Error("Vi tri tin nhan khong hop le");
            err.statusCode = 400;
            throw err;
        }


        const isAdmin = chat.userList.some(
        (member) => member.role === "admin" && member.username === user.username,
        );

        const isModerator = chat.userList.some(
        (member) => member.role === "moderator" && member.username === user.username,
        );

        const isSender = chat.messages[index].sender === user.username;

        checkAuth = (isAdmin || isModerator || isSender);

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