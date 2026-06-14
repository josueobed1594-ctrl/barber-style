const express = require('express');
const router = express.Router();

const servicioController = require('../controllers/servicioController');

router.get('/servicios', servicioController.listar);

module.exports = router;