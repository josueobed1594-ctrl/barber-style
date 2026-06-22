const express = require('express');
const router = express.Router();

const clienteController = require('../controllers/clienteController');

// =========================
// HOME CLIENTE
// =========================
router.get('/', clienteController.inicio);

// =========================
// CONFIRMACION
// =========================
router.get('/confirmacion', (req, res) => {
    res.render('clientes/confirmacion');
});

// =========================
// MIDDLEWARE CLIENTE
// =========================
function protegerCliente(req, res, next) {

    if (!req.session.usuario) {
        return res.redirect('/login');
    }

    if (req.session.usuario.rol !== 'cliente') {
        return res.send('No autorizado');
    }

    next();
}

// =========================
// DASHBOARD CLIENTE (CORRECTO)
// =========================
router.get('/clientes/dashboard', protegerCliente, clienteController.dashboard);

module.exports = router;