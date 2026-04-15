
const mongoose = require('mongoose');
const Blog = require('../models/blogModel');
const Likes = require('../models/likeModel');

const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.status(200).json(blogs);
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const getOldestBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: 1 });
        res.status(200).json(blogs);
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const getOldestBlogsWithUserId = async (req, res) => {
    try {
        const { user } = req.user;
        const blogs = await Blog.find({ uid: user.id }).sort({ createdAt: 1 });
        res.status(200).json(blogs);
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid blog ID" });
        }
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.status(200).json({
            success: true,
            blog
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
        console.log(err);
    }
}

const getBlogsByUserId = async (req, res) => {
    try {
        const { user } = req.user;
        const blogs = await Blog.find({ uid: user.id }).sort({ createdAt: -1 });
        if (blogs.length === 0) {
            return res.status(404).json({ message: "No blogs found for this user" });
        }
        res.status(200).json(blogs);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}

const createBlog = async (req, res) => {
    try {
        const { title, author, desc, uid } = req.body;
        const newBlog = new Blog({ title, author, desc, image: req.file.path, uid });
        await newBlog.save();
        res.send({
            success: true,
            blog: newBlog
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, desc } = req.body;
        const updatedBlog = await Blog.findByIdAndUpdate(id, { title, author, desc }, {new: true});
        res.status(200).json({
            message: "Blog updated successfully!",
            updatedBlog
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBlog = await Blog.findByIdAndDelete(id);
        res.status(200).json({
            message: "Blog deleted successfully",
            deletedBlog
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const search = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({
                message: "Search query is required"
            });
        }
        const blogs = await Blog.find({
            title: { $regex: query, $options: "i" } // case-insensitive search
        });
        res.json({
            success: true,
            count: blogs.length,
            blogs
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server error"
        });
    }
}

const searchWithUserId = async (req, res) => {
    try {
        const { user } = req.user;
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({
                message: "Search query is required"
            });
        }
        const blogs = await Blog.find({
            uid: user.id,
            title: { $regex: query, $options: "i" } // case-insensitive search
        });
        res.json({
            success: true,
            blogs
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server error"
        });
    }
}

const getLikes = async (req, res) => {
    try {
        const likes = await Likes.find();
        // console.log(likes)
        res.status(200).json(likes);
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const updateLikes = async (req, res) => {
    try {
        const { id } = req.params;
        // console.log(id)
        const { likes } = req.body;
        // console.log('line 126', {likes})
        const updatedLikes = await Likes.findByIdAndUpdate(id, {likes}, { new: true });
        // console.log(updatedLikes)
        res.status(200).json({
            message: "Likes updated successfully!",
            // likes: updatedLikes.likes
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const home = async (req, res) => {
    const { user } = req.user;
    try {
        if (user.role === 'admin') {
            // location.href = '/public/dashboard/index.html';
            return res.send({
                status: 200,
                user,
                message: "Welcome Admin",
            });
        }
        res.send({
            status: 200,
            user,
            message: "Welcome User",
        });
    } catch (err) {
        res.send({
            err,
            status: 500,
            message: "Sorry! Server is not responding",
        });
    }
}

module.exports = { getBlogs, getOldestBlogs, getOldestBlogsWithUserId, getBlogById, getBlogsByUserId, createBlog, updateBlog, deleteBlog, search, searchWithUserId, getLikes, updateLikes, home };
