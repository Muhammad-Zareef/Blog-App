
const express = require('express');
const router = express.Router();
const { getUsers, login, signup, checkUserRole, logout } = require('../controllers/userController');
const authrization = require('../middlewares/authMiddleware');
const verifyToken = require('../middlewares/verifyToken');

router.get('/users', getUsers);
router.post('/login', login);
router.post('/signup', signup);
// router.post('/home', authrization, home);
router.post('/verifyToken', verifyToken, checkUserRole);
router.post('/logout', logout);

module.exports = router;
