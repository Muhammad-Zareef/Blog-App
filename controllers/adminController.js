
const User = require('../models/userModel');
const Blog = require('../models/blogModel');

const getUsersAndBlogs = async (req, res) => {
    try {
        const users = await User.find();
        const blogs = await Blog.find();
        res.status(200).json({
            users,
            blogs
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json(blogs);
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
        const {title, author, desc} = req.body;
        const updatedBlog = await Blog.findByIdAndUpdate(id, {title, author, desc}, {new: true});
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

module.exports = { getUsersAndBlogs, getBlogs, updateBlog, deleteBlog };
