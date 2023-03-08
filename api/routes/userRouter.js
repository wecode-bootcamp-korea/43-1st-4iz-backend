const express = require('express');
const { userController } = require('../controllers');

const router = express.Router();

router.post('/signup', userController.signUp)

module.exports = router;