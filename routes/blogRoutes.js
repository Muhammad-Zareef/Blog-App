
const express = require('express');
const router = express.Router();
const { getBlogs, createBlog } = require('../controllers/blogController');

router.get('/blogs', getBlogs);
router.post('/postBlog', createBlog);

module.exports = router;
