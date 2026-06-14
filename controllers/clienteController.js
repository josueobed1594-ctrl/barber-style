const clienteController = {

    inicio: (req, res) => {

        res.render('clientes/index', {
            titulo: 'Barber Style'
        });

    }

};

module.exports = clienteController;