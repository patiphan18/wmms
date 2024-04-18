const express = require('express');
const {registerView, loginView, forgetPasswordView, login, register, logout, sendMail, resetPasswordView, resetPassword} = require('../controllers/loginController.js');
const router =  express.Router();

router.get('/register', registerView);
router.get('/login', loginView);
router.get('/forgot', forgetPasswordView);
router.get('/resetPassword/:code', resetPasswordView);
router.get('/logout', logout);
router.post('/login', login);
router.post('/register', register);
router.post('/resetPassword', resetPassword);
router.post('/sendResetCode', sendMail);
// router.post('/auth', verifyToken);

module.exports = router;