const Post = require('../model/post');
const User = require('../model/user');

// Helper: attach username to a single post
const withUsername = async (post) => {
  if (!post) return post;
  const p = post.toObject ? post.toObject() : post;
  const user = await User.findById(p.user_id).select('username');
  p.username = user ? user.username : null;

  // attach usernames to nested comments if present
  if (Array.isArray(p.comments) && p.comments.length) {
    const userIds = [...new Set(p.comments.map((c) => c.user_id))];
    const users = await User.find({ _id: { $in: userIds } }).select('username');
    const map = {};
    users.forEach((u) => (map[String(u._id)] = u.username));
    p.comments = p.comments.map((c) => ({
      ...c,
      username: map[String(c.user_id)] || null,
    }));
  }
  return p;
};

exports.createPost = async (data) => {
  const post = await Post.create(data);
  return post;
};

exports.getPosts = async () => {
  const posts = await Post.find({ status: { $ne: 'deleted' } }).sort({
    createdAt: -1,
  });
  return Promise.all(posts.map((p) => withUsername(p)));
};

exports.getPostsByUserId = async (user_id) => {
  const posts = await Post.find({ user_id }).sort({ createdAt: -1 });
  return Promise.all(posts.map((p) => withUsername(p)));
};

exports.getPostById = async (id) => {
  const post = await Post.findById(id);
  return withUsername(post);
};

exports.updatePost = async (id, updateData, user) => {
  const post = await Post.findById(id);
  if (!post) {
    const err = new Error('Bài viết không tồn tại');
    err.statusCode = 404;
    throw err;
  }
  const isOwner = String(post.user_id) === String(user._id);
  const isAdmin = user.role === 'admin';
  if (!isOwner && !isAdmin) {
    const err = new Error('Bạn không có quyền sửa bài viết này');
    err.statusCode = 403;
    throw err;
  }

  // record edit history
  if (post.title !== updateData.title || post.content !== updateData.content) {
    post.editStatus.push({
      editedAt: new Date(),
      title: post.title,
      content: post.content,
    });
  }
  if (updateData.title !== undefined) post.title = updateData.title;
  if (updateData.content !== undefined) post.content = updateData.content;
  await post.save();
  return withUsername(post);
};

exports.deletePost = async (id, user) => {
  const post = await Post.findById(id);
  if (!post) {
    const err = new Error('Bài viết không tồn tại');
    err.statusCode = 404;
    throw err;
  }
  const isOwner = String(post.user_id) === String(user._id);
  const isAdmin = user.role === 'admin';
  if (!isOwner && !isAdmin) {
    const err = new Error('Bạn không có quyền xóa bài viết này');
    err.statusCode = 403;
    throw err;
  }
  await Post.findByIdAndDelete(id);
  return { _id: id };
};