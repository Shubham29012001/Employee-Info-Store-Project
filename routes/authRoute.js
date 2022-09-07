const express = require('express');
const router = express.Router();

const { loginController, signupController } = require('../controllers/authController');

router.route('/login').post(loginController);
router.route('/signup').post(signupController);

module.exports = router;