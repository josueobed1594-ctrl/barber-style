const Servicio = require('../models/Servicio');

const servicioController = {

    listar: (req, res) => {

        Servicio.obtenerTodos((error, servicios) => {

            if (error) {
                console.error(error);
                return res.status(500).send('Error al obtener servicios');
            }

            res.render('clientes/servicios', {
                titulo: 'Servicios',
                servicios
            });

        });

    }

};

module.exports = servicioController;