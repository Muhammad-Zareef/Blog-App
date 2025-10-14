
const Blog = require('../models/blogModel');

const getBlogs = async (req, res) => {
    try {
        const users = await Blog.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
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
            message: err.message,
        });
    }
}

module.exports = { getBlogs, createBlog };
