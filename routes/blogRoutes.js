
const express = require('express');
const router = express.Router();
const { getBlogs, getOldestBlogs, getOldestBlogsWithUserId, getBlogById, getBlogsByUserId, createBlog, updateBlog, deleteBlog, search, searchWithUserId, getLikes, updateLikes, home } = require('../controllers/blogController');
const verifyToken = require('../middlewares/verifyToken');
const upload = require("../config/cloudinary");

router.get('/home', verifyToken, home);
router.get('/blogs', getBlogs);
router.get('/oldestBlogs', getOldestBlogs);
router.get('/oldestBlogsOfUser', verifyToken, getOldestBlogsWithUserId);
router.get('/blogs/:id', getBlogById);
router.get('/userBlogs', verifyToken, getBlogsByUserId);
router.post('/postBlog', upload.single("image"), createBlog);
router.put('/updateBlog/:id', updateBlog);
router.delete('/deleteBlog/:id', deleteBlog);
router.get('/search', search);
router.get('/searchWithUserId', verifyToken, searchWithUserId);
router.get('/likes', getLikes);
router.put('/updateLikes/:id', updateLikes);

module.exports = router;
