const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');

router.get('/list', documentController.getDocuments);

module.exports = router;