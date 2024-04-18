const express = require('express');
const {
    foundGarbageModal, 
    GarbageStepModal, 
    addFoundGarbage, 
    addGarbageStep, 
} = require('../controllers/garbageController.js');
const router =  express.Router();
const fileUpload = require("express-fileupload");
const path = require('path');

router.post('/getModalFound', foundGarbageModal)
router.post('/getModalStep', GarbageStepModal);
router.post('/addFoundGarbage', fileUpload({ createParentPath: true }), addFoundGarbage);
router.post('/addGarbageStep', fileUpload({ createParentPath: true }), addGarbageStep);
module.exports = router;