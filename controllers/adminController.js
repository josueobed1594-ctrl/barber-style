const Cita = require('../models/Cita');

const adminController = {

    listarCitas: (req, res) => {

        Cita.obtenerTodas((error, citas) => {

            if (error) {

                console.error(error);

                return res.send(
                    'Error cargando citas'
                );

            }

            res.render(
                'admin/citas',
                {
                    titulo: 'Administrar Citas',
                    citas
                }
            );

        });

    }

};

module.exports = adminController;