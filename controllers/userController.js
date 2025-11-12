
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const dotenv = require('dotenv');
const hashy = require('hashy');
const saltRounds = 10;
dotenv.config();

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

const createToken = (user) => {
    return jwt.sign({user}, process.env.JWTSECRETKEY, { expiresIn: "3d" });
}

const login = async (req, res) => {
    const token = req.cookies;
    console.log(token);
    try {
        const { loginEmail, loginPassword } = req.body;
        const user = await User.findOne({ email: loginEmail });
        if (!user) {
            return res.send({
                status: 404,
                message: 'User not found',
            });
        }
        hashy.verify(loginPassword, user.password, function (error, success) {
            if (error) {
                return console.error(err);
            }
            if (success) {
                const token = createToken({
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                });
                console.log(token);
                const oneDay = 24 * 60 * 60 * 1000;
                res.cookie("jwtToken", token, {
                    httpOnly: true,
                    sameSite: "lax",
                    secure: false,
                    maxAge: oneDay, // 1 day in milliseconds
                });
                return res.send({
                    status: 200,
                    user,
                    message: "User login successfully",
                    token,
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
    const { fullName, email, password, role } = req.body;
    hashy.hash(password, async function (error, hash) {
        if (error) {
            return console.log(error);
        }
        try {
            const newUser = new User({ fullName, email, password: hash, role });
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

async function home(req, res) {
    const { user } = req.user;
    console.log(user, "this is line 42");
    try {
        if (user.role === 'admin') {
            location.href = '/public/dashboard/index.html';
            return res.send({
                status: 200,
                message: "Welcome Admin",
            });
        }
        res.send({
            status: 200,
            message: "Welcome User",
        });
    } catch (err) {
        res.send({
            err,
            status: 500,
            message: "Sorry! Server is not responding",
        });
    }
}

module.exports = { getUsers, login, signup, home };
