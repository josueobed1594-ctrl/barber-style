const express = require('express');
const router = express.Router();

const Cita = require('../models/Cita');
const authMiddleware = require('../middlewares/authMiddleware');


// =============================
// DASHBOARD
// =============================
router.get('/admin/dashboard', authMiddleware, (req, res) => {

    Cita.contarPorEstado((err, resultados) => {

        if (err) {
            console.error(err);
            return res.send('Error dashboard');
        }

        const data = {
            pendientes: 0,
            confirmadas: 0,
            canceladas: 0,
            eliminadas: 0,
            finalizadas: 0
        };

        resultados.forEach(r => {
            const total = Number(r.total);

            if (r.estado === 'pendiente') data.pendientes = total;
            if (r.estado === 'confirmada') data.confirmadas = total;
            if (r.estado === 'cancelada') data.canceladas = total;
            if (r.estado === 'eliminada') data.eliminadas = total;
            if (r.estado === 'finalizada') data.finalizadas = total;
        });

        Cita.obtenerMetricas((err, metricas) => {

            if (err) {
                console.error(err);
                return res.send('Error métricas');
            }

            const resumen = metricas?.[0] || {
                hoy: 0,
                semana: 0,
                mes: 0,
                total: 0
            };

            res.render('admin/dashboard', {
                titulo: 'Dashboard Administrativo',
                data,
                resumen
            });

        });

    });

});


// =============================
// LISTAR CITAS
// =============================
router.get('/admin/citas', authMiddleware, (req, res) => {

    Cita.obtenerTodas((err, citas) => {

        if (err) {
            console.error(err);
            return res.send('Error cargando citas');
        }

        res.render('admin/citas', {
            titulo: 'Administrar Citas',
            citas
        });

    });

});


// =============================
// ACCIONES
// =============================
router.post('/admin/citas/confirmar/:id', authMiddleware, (req, res) => {

    Cita.actualizarEstado(req.params.id, 'confirmada', (err) => {
        if (err) return res.json({ ok: false });
        res.json({ ok: true });
    });

});

router.post('/admin/citas/cancelar/:id', authMiddleware, (req, res) => {

    Cita.actualizarEstado(req.params.id, 'cancelada', (err) => {
        if (err) return res.json({ ok: false });
        res.json({ ok: true });
    });

});

router.post('/admin/citas/finalizar/:id', authMiddleware, (req, res) => {

    Cita.actualizarEstado(req.params.id, 'finalizada', (err) => {
        if (err) return res.json({ ok: false });
        res.json({ ok: true });
    });

});

router.post('/admin/citas/eliminar/:id', authMiddleware, (req, res) => {

    Cita.eliminar(req.params.id, (err) => {
        if (err) return res.json({ ok: false });
        res.json({ ok: true });
    });

});

module.exports = router;