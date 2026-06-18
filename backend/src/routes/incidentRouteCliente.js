const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');

router.get('/list', incidentController.getIncidents);
router.post('/create', incidentController.createIncident);

module.exports = router;