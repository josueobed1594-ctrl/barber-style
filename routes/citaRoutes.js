const express = require('express');
const router = express.Router();

const citaController = require('../controllers/citaController');
const protegerCliente = require('../middlewares/protegerCliente');

// 🔥 FORMULARIO DE RESERVA
router.get(
    '/reservar',
    protegerCliente,
    citaController.mostrarFormulario
);

// 🔥 GUARDAR RESERVA
router.post(
    '/reservar',
    protegerCliente,
    citaController.guardarReserva
);

module.exports = router;