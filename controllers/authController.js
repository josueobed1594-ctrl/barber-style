const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');

const authController = {

    mostrarLogin: (req, res) => {
        res.render('auth/login', { titulo: 'Login' });
    },

    login: (req, res) => {

        const { email, password } = req.body;

        Usuario.obtenerPorEmail(email, (error, resultados) => {

            if (error) return res.status(500).send('Error servidor');

            if (!resultados.length) return res.send('Usuario no encontrado');

            const usuario = resultados[0];

            bcrypt.compare(password, usuario.password, (err, ok) => {

                if (err) return res.send('Error password');
                if (!ok) return res.send('Contraseña incorrecta');

                req.session.usuario = {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    rol: usuario.rol
                };

                if (usuario.rol === 'admin') {
                    return res.redirect('/admin/dashboard');
                }

                return res.redirect('/clientes/dashboard');
            });

        });
    },

    logout: (req, res) => {
        req.session.destroy(() => {
            res.redirect('/login');
        });
    }
};

module.exports = authController;