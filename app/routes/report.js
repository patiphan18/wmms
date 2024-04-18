const express = require('express');
const {reportView, getBinReport, getGarbageReport, getCollectReport} = require('../controllers/reportController.js');
const router =  express.Router();

router.get('/', reportView)
router.post('/getBinReport', getBinReport)
router.post('/getGarbageReport', getGarbageReport);
router.post('/getCollectReport', getCollectReport);

module.exports = router;