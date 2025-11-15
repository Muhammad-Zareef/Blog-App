
const express = require('express');
const router = express.Router();
const { getBlogs, createBlog, updateBlog, deleteBlog, home } = require('../controllers/blogController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/home', verifyToken, home);
router.get('/blogs', getBlogs);
router.post('/postBlog', createBlog);
router.put('/updateBlog/:id', updateBlog);
router.delete('/deleteBlog/:id', deleteBlog);

module.exports = router;
