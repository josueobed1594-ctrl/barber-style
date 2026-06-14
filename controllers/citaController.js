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
            nombre,
            telefono,
            email,
            barbero_id,
            fecha,
            hora,
            observacion
        } = req.body;

        // ==========================
        // VALIDAR FECHA Y HORA
        // ==========================

        const ahora = new Date();

        const fechaActual = ahora.toISOString().split('T')[0];

        if (fecha < fechaActual) {

            return res.send(`
                <h2>Fecha inválida</h2>
                <p>No puedes reservar una fecha pasada.</p>
                <a href="/reservar">Volver</a>
            `);

        }

        if (fecha === fechaActual) {

            const horaActual =
                String(ahora.getHours()).padStart(2, '0') +
                ':' +
                String(ahora.getMinutes()).padStart(2, '0');

            const horaReserva = hora.substring(0, 5);

            if (horaReserva <= horaActual) {

                return res.send(`
                    <h2>Horario inválido</h2>
                    <p>
                        Debes seleccionar una hora posterior a la actual.
                    </p>
                    <a href="/reservar">Volver</a>
                `);

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

                    return res.send(
                        'Error verificando disponibilidad'
                    );

                }

                if (citasExistentes.length > 0) {

                    return res.send(`
                        <h2>Horario no disponible</h2>

                        <p>
                            El barbero ya tiene una cita registrada
                            para esa fecha y hora.
                        </p>

                        <a href="/reservar">
                            Volver
                        </a>
                    `);

                }

                let servicios = req.body.servicios || [];

                if (!Array.isArray(servicios)) {
                    servicios = [servicios];
                }

                Cliente.crear(
                    {
                        nombre,
                        telefono,
                        email
                    },
                    (errorCliente, resultadoCliente) => {

                        if (errorCliente) {
                            console.error(errorCliente);
                            return res.send(
                                'Error al registrar cliente'
                            );
                        }

                        const cliente_id =
                            resultadoCliente.insertId;

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
                                    return res.send(
                                        'Error al registrar cita'
                                    );
                                }

                                const cita_id =
                                    resultadoCita.insertId;

                                let pendientes =
                                    servicios.length;

                                if (pendientes === 0) {

                                    return res.redirect(
                                        '/confirmacion'
                                    );

                                }

                                servicios.forEach(
                                    servicio_id => {

                                        CitaServicio.crear(
                                            cita_id,
                                            servicio_id,
                                            (errorRelacion) => {

                                                if (
                                                    errorRelacion
                                                ) {

                                                    console.error(
                                                        errorRelacion
                                                    );

                                                }

                                                pendientes--;

                                                if (
                                                    pendientes === 0
                                                ) {

                                                    return res.redirect(
                                                        '/confirmacion'
                                                    );

                                                }

                                            }
                                        );

                                    }
                                );

                            }
                        );

                    }
                );

            }
        );

    }

};

module.exports = citaController;