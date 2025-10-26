
const User = require('../models/userModel');
const hashy = require('hashy');
const saltRounds = 10;

const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

const login = async (req, res) => {
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
}

const signup = (req, res) => {
    const { fullName, email, password } = req.body;
    hashy.hash(password, async function (error, hash) {
        if (error) {
            return console.log(error);
        }
        try {
            const newUser = new User({ fullName, email, password: hash });
            await newUser.save();
            res.status(200).send({
                status: 200,
                newUser,
                message: "User has been created successfully"
            });
        } catch (err) {
            if (err.code === 11000) {
                return res.status(400).send({
                    status: 400,
                    success: false,
                    message: "Email already exists. Please use another email"
                });
            }
            res.status(500).json({
                success: false,
                status: 500,
                message: "Internal Server Error",
            });
        }
    });
}

module.exports = {getUsers, login, signup};
