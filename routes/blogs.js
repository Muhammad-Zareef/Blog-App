
const express = require('express');
const router = express.Router();

const Blog = require('../models/blogModel');

router.get('/blogs', async (req, res) => {
    try {
        const users = await Blog.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});

router.post('/postBlog', async (req, res) => {
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
});

module.exports = router;
