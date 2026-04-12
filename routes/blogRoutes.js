
const express = require('express');
const router = express.Router();
const { getBlogs, getOldestBlogs, getBlogById, getBlogsByUserId, createBlog, updateBlog, deleteBlog, search, searchWithUserId, getLikes, updateLikes, home } = require('../controllers/blogController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/home', verifyToken, home);
router.get('/blogs', getBlogs);
router.get('/oldestBlogs', getOldestBlogs);
router.get('/blogs/:id', getBlogById);
router.get("/blogs/user", getBlogsByUserId);
router.post('/postBlog', createBlog);
router.put('/updateBlog/:id', updateBlog);
router.delete('/deleteBlog/:id', deleteBlog);
router.get('/search', search);
router.get('/searchWithUserId', searchWithUserId);
router.get('/likes', getLikes);
router.put('/updateLikes/:id', updateLikes);

module.exports = router;
