
const express = require('express');
const router = express.Router();
const { getUsers, login, signup, home } = require('../controllers/userController');
const authrization = require('../middlewares/authMiddleware');

router.get('/users', getUsers);
router.post('/login', login);
router.post('/signup', signup);
router.post('/home', authrization, home);

module.exports = router;
