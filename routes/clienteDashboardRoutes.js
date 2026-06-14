const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const Cita = require('../models/Cita');

// =========================
// DASHBOARD CLIENTE
// =========================
router.get('/cliente/dashboard', authMiddleware, (req, res) => {

    const cliente_id = req.session.usuario.id;

    Cita.obtenerPorCliente(cliente_id, (err, citas) => {

        if (err) {
            console.error(err);
            return res.send('Error cargando citas');
        }

        res.render('cliente/dashboard', {
            titulo: 'Mi Panel',
            citas
        });

    });

});

module.exports = router;