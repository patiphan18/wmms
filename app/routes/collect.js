const express = require('express');
const {
    collectView, 
    getTable,
    addCollectView,
    addCollect,
    reportView,
    getGraph
} = require('../controllers/collectController.js');
const router =  express.Router();
const fileUpload = require("express-fileupload");
const path = require('path');

router.get('/', collectView);
router.get('/report', reportView);
router.post('/getGraph', getGraph);
router.post('/getTable', getTable);
router.post('/getFormAdd', addCollectView);
router.post('/add', fileUpload({ createParentPath: true }), addCollect);

module.exports = router;