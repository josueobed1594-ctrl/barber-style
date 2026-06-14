const express = require('express');
const router = express.Router();

const citaController = require('../controllers/citaController');

router.get(
    '/reservar',
    citaController.mostrarFormulario
);

router.post(
    '/reservar',
    citaController.guardarReserva
);

module.exports = router;