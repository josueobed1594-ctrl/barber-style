const Cliente = require('../models/Cliente');
const Cita = require('../models/Cita');

const clienteController = {

    // =========================
    // HOME CLIENTE
    // =========================
    inicio: (req, res) => {

        res.render('clientes/index', {
            titulo: 'Barber Style'
        });

    },

    // =========================
    // DASHBOARD CLIENTE (CORRECTO)
    // =========================
    dashboard: (req, res) => {

        const usuario_id = req.session.usuario.id;

        Cliente.obtenerPorUsuario(usuario_id, (err, cliente) => {

            if (err || !cliente.length) {
                return res.send('Cliente no encontrado');
            }

            const cliente_id = cliente[0].id;

            Cita.obtenerPorCliente(cliente_id, (err, citas) => {

                if (err) return res.send('Error');

                res.render('clientes/dashboard', {
                    titulo: 'Mis Citas',
                    citas
                });

            });

        });

    }

};

module.exports = clienteController;