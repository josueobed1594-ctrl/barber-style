const Servicio = require('../models/Servicio');
const Barbero = require('../models/Barbero');
const Cliente = require('../models/Cliente');
const Cita = require('../models/Cita');
const CitaServicio = require('../models/CitaServicio');

const citaController = {

    mostrarFormulario: (req, res) => {

        Servicio.obtenerTodos((errorServicios, servicios) => {

            if (errorServicios) {
                return res.status(500).send('Error al cargar servicios');
            }

            Barbero.obtenerTodos((errorBarberos, barberos) => {

                if (errorBarberos) {
                    return res.status(500).send('Error al cargar barberos');
                }

                res.render('clientes/reservar', {
                    titulo: 'Reservar Cita',
                    servicios,
                    barberos
                });

            });

        });

    },

    guardarReserva: (req, res) => {

        const {
            barbero_id,
            fecha,
            hora,
            observacion
        } = req.body;

        let servicios = req.body.servicios || [];

        if (!Array.isArray(servicios)) {
            servicios = [servicios];
        }

        const renderError = (msg) => {
            Servicio.obtenerTodos((errS, serviciosData) => {
                Barbero.obtenerTodos((errB, barberosData) => {

                    return res.render('clientes/reservar', {
                        titulo: 'Reservar Cita',
                        servicios: serviciosData,
                        barberos: barberosData,
                        error: msg
                    });

                });
            });
        };

    
       // ==========================
        // VALIDAR FECHA Y HORA (PERÚ)
        // ==========================

        const ahoraPeru = new Date(
            new Date().toLocaleString('en-US', {
                timeZone: 'America/Lima'
            })
        );

        const anio = ahoraPeru.getFullYear();
        const mes = String(ahoraPeru.getMonth() + 1).padStart(2, '0');
        const dia = String(ahoraPeru.getDate()).padStart(2, '0');

        const fechaActual = `${anio}-${mes}-${dia}`;

        if (fecha < fechaActual) {
            return renderError('No puedes reservar una fecha pasada.');
        }

        if (fecha === fechaActual) {

            const horaActualMin =
                ahoraPeru.getHours() * 60 +
                ahoraPeru.getMinutes();

            const [h, m] = hora.split(':').map(Number);

            const horaReservaMin =
                (h * 60) + m;

            if (horaReservaMin <= horaActualMin) {
                return renderError(
                    'Debes seleccionar una hora posterior a la actual.'
                );
            }

        }

        // ==========================
        // VALIDAR DISPONIBILIDAD
        // ==========================

        Cita.verificarDisponibilidad(
            barbero_id,
            fecha,
            hora,
            (errorDisponibilidad, citasExistentes) => {

                if (errorDisponibilidad) {
                    console.error(errorDisponibilidad);
                    return renderError('Error verificando disponibilidad.');
                }

                if (citasExistentes.length > 0) {
                    return renderError('El barbero ya tiene una cita en esa fecha y hora.');
                }

                // ==========================
                // CLIENTE LOGUEADO
                // ==========================

                const usuario_id = req.session.usuario.id;

                Cliente.obtenerPorUsuario(usuario_id, (errorCliente, cliente) => {

                    if (errorCliente || !cliente.length) {
                        return renderError('Cliente no encontrado.');
                    }

                    const cliente_id = cliente[0].id;

                    // ==========================
                    // CREAR CITA
                    // ==========================

                    Cita.crear(
                        {
                            cliente_id,
                            barbero_id,
                            fecha,
                            hora,
                            observacion
                        },
                        (errorCita, resultadoCita) => {

                            if (errorCita) {
                                console.error(errorCita);
                                return renderError('Error al registrar cita.');
                            }

                            const cita_id = resultadoCita.insertId;

                            if (servicios.length === 0) {
                                return res.redirect('/confirmacion');
                            }

                            let pendientes = servicios.length;

                            servicios.forEach(servicio_id => {

                                CitaServicio.crear(
                                    cita_id,
                                    servicio_id,
                                    (errorRelacion) => {

                                        if (errorRelacion) {
                                            console.error(errorRelacion);
                                        }

                                        pendientes--;

                                        if (pendientes === 0) {
                                            return res.redirect('/confirmacion');
                                        }

                                    }
                                );

                            });

                        }
                    );

                });

            }
        );

    }

};

module.exports = citaController;