
const express = require('express');
const router = express.Router();
const hashy = require('hashy');
const saltRounds = 10;

const User = require('../models/userModel');

router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { loginEmail, loginPassword } = req.body;
        const user = await User.findOne({ email: loginEmail });
        hashy.verify(loginPassword, user.password, function (error, success) {
            if (error) {
                return console.error(err);
            }
            if (success) {
                return res.send({
                    status: 200,
                    user,
                    message: "User login successfully",
                });
            } else {
                return res.send({
                    status: 401,
                    message: "Wrong password"
                });
            }
        });
    } catch (err) {
        res.send({
            status: 404,
            message: 'User not found',
        });
    }
});

router.post('/signup', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        const isFound = await User.findOne({ email });
        if (isFound) {
            return res.send({
                status: 505,
                message: "User already exists",
            });
        }
        hashy.hash(password, function (error, hash) {
            if (error) {
                return console.log(error);
            }
            const newUser = new User({ fullName, email, password: hash });
            newUser.save();
            res.send({
                status: 200,
                newUser,
                message: "User has been created successfully"
            });
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            status: 500,
            message: err.message,
        });
    }
});

module.exports = router;
