const Post = require('../model/post')


const createPost = async(data) =>
{
    try
    {
        const post = new Post(data);
        await post.save();
        return post;
    }
    catch (error)
    {
        throw error;
    }
}

const getPosts = async() =>
{
    try
    {
        const posts = await Post.find();
        return posts;

    }
    catch (error)
    {
        throw error;
    }
}


const getPostByUserID = async(user_id) =>
{
    try
    {
        const user = await User.findById(user_id);
        if(!user)
        {
            const err = new Error();
            err.statusCode = 404;
            err.message = "Bai viet khong ton tai";
            throw err;
        }
        const posts = await Post.find({user_id: user_id});
        return posts;
    }
    catch (error)
    {
        throw error;
    }
}

const getPostByID = async(id) =>
{
    try
    {
        const post = await User.findById(id);
        if(!post)
        {
            const err = new Error();
            err.statusCode = 404;
            err.message = "Bai viet khong ton tai";
            throw err;
        }
        return post;
    }
    catch (error)
    {
        throw error;
    }
}


const updatePost = async(id, updateData, user) =>
{
    try
    {
        const post = await Post.findById(id);
        if(!post)
        {
            const err = new Error();
            err.statusCode = 404;
            err.message = "Bai viet khong ton tai";
            throw err;
        }
        if (user.role !== "admin" && post.user_id !== user._id) 
        {
            const err = new Error();
            err.statusCode = 403;
            err.message = "Bạn không có quyền chỉnh sửa bài viết này";
            throw err;
        }

        const editStatus = 
        {
            editedAt : new Date(),
            content : post.content,
            title : post.title,    
        }
        await post.set(updateData);
        await post.save();
        return post;
    }
    catch (error)
    {
        throw error;
    }
}


const deletePost = async(id) =>
{
    try
    {
        const post = await Post.findById(id);
        if(!post)
        {
            const err = new Error();
            err.statusCode = 404;
            err.message = "Bai viet khong ton tai";
            throw err;
        }
        if (user.role !== "admin" && post.user_id !== user._id) 
        {
            const err = new Error();
            err.statusCode = 403;
            err.message = "Bạn không có quyền chỉnh sửa bài viết này";
            throw err;
        }
        post.status = "deleted";
        await post.save();
        return post;
    }
    catch (error)
    {
        throw error;
    }
}

module.exports = {
  createPost,
  getPosts,
  getPostByUserID,
  getPostByID,
  updatePost,
  deletePost,
};