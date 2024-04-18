const express = require('express');
const {homeView, upload, deleteImage} = require('../controllers/homeController.js');
const fileUpload = require("express-fileupload");
const router =  express.Router();

router.get('/', homeView);
router.post('/upload', fileUpload({ createParentPath: true }), upload);
router.post('/deleteImage', deleteImage);
module.exports = router;