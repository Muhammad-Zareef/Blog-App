
const Blog = require('../models/blogModel');

const getBlogs = async (req, res) => {
    try {
        const users = await Blog.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const createBlog = async (req, res) => {
    try {
        const {title, author, desc, uid} = req.body;
        const newBlog = new Blog({title, author, desc, uid});
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

module.exports = { getBlogs, createBlog, updateBlog, deleteBlog };
