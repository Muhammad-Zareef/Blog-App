
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

const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const {fullName, email, role} = req.body;
        const updatedUser = await User.findByIdAndUpdate(id, {fullName, email, role}, {new: true});
        res.status(200).json({
            message: "User updated successfully!",
            updatedUser
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}


const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        res.status(200).json({
            message: "User deleted successfully",
            deletedUser
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const logout = (req, res) => {
    res.clearCookie("jwtToken", {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    });
    res.json({ message: "Logged out successfully" });
};

module.exports = { getUsersAndBlogs, getBlogs, updateBlog, deleteBlog, getUsers, updateUser, deleteUser, logout };
