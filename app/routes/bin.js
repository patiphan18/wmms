const express = require('express');
const {binView, addBinView, addBin, editBinView, updateBin, deleteBin} = require('../controllers/binController.js');
const router =  express.Router();
const fileUpload = require("express-fileupload");

router.get('/', binView);

router.post('/getModal', addBinView);
router.post('/getModalEdit', editBinView)

router.post('/add', fileUpload({ createParentPath: true }), addBin);
router.post('/update', fileUpload({ createParentPath: true }), updateBin);
router.post('/delete', deleteBin)

module.exports = router;