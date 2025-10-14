
const express = require('express');
const router = express.Router();
const { getUsers, login, signup } = require('../controllers/userController');

router.get('/users', getUsers);
router.post('/login', login);
router.post('/signup', signup);

module.exports = router;
