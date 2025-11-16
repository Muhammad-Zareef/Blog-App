
const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin');
const { getUsersAndBlogs, getBlogs, updateBlog, deleteBlog } = require('../controllers/adminController');

router.get("/dashboard", verifyToken, verifyAdmin, (req, res) => {
    res.json({
        message: "Welcome Admin Dashboard", user: req.user
    });
});

router.get('/getUsersAndBlogs', getUsersAndBlogs);
router.get('/getBlogs', getBlogs);
router.put('/updateBlog/:id', updateBlog);
router.delete('/deleteBlog/:id', deleteBlog);

module.exports = router;
