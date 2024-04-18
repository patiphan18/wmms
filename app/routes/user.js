const express = require('express');
const {userView, getProfile, getPasswordForm, updatePassword, updateProfile} = require('../controllers/userController.js');
const router =  express.Router();

router.get('/', userView);
router.get('/changePassword', userView);
router.post('/getProfile', getProfile);
router.post('/getPasswordForm', getPasswordForm);
router.post('/updatePassword', updatePassword);
router.post('/updateProfile', updateProfile);

module.exports = router;