const express = require('express');
const router = express.Router();

const clienteController = require('../controllers/clienteController');
const Cita = require('../models/Cita');

router.get('/', clienteController.inicio);

router.get('/confirmacion', (req, res) => {
    res.render('clientes/confirmacion');
});

function protegerCliente(req, res, next) {

    if (!req.session.usuario) {
        return res.redirect('/login');
    }

    if (req.session.usuario.rol !== 'cliente') {
        return res.send('No autorizado');
    }

    next();
}

router.get('/clientes/dashboard', protegerCliente, (req, res) => {

    Cita.obtenerPorCliente(req.session.usuario.id, (err, citas) => {

        if (err) return res.send('Error');

        res.render('clientes/dashboard', {
            titulo: 'Mis Citas',
            citas
        });

    });

});

module.exports = router;