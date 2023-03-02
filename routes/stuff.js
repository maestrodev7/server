const express = require('express');

const router = express.Router();
const stuffCtrl = require('../controllers/stuff');
router.get('/', stuffCtrl.streaming);
module.exports = router;