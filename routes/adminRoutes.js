
const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin');
const { getUsersAndBlogs, getBlogs, updateBlog, deleteBlog, getUsers, updateUser, deleteUser, logout } = require('../controllers/adminController');

router.get("/dashboard", verifyToken, verifyAdmin, (req, res) => {
    res.json({
        message: "Welcome Admin Dashboard", admin: req.user.user
    });
});

router.get('/getUsersAndBlogs', getUsersAndBlogs);
router.get('/getBlogs', getBlogs);
router.post('/logout', logout);
router.put('/updateBlog/:id', updateBlog);
router.delete('/deleteBlog/:id', deleteBlog);
router.get('/getUsers', getUsers);
router.put('/updateUser/:id', updateUser);
router.delete('/deleteUser/:id', deleteUser);

module.exports = router;
