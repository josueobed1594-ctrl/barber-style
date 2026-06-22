const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');
const Cliente = require('../models/Cliente');

const authController = {

    // =========================
    // LOGIN
    // =========================
    mostrarLogin: (req, res) => {
        res.render('auth/login', { titulo: 'Login' });
    },

    login: (req, res) => {

        const { email, password } = req.body;

        Usuario.obtenerPorEmail(email, (error, resultados) => {

            if (error) {
                return res.status(500).send('Error servidor');
            }

            // ❌ Usuario no existe
            if (!resultados.length) {
                return res.render('auth/login', {
                    titulo: 'Login',
                    error: 'Email o contraseña incorrectos. Si aún no tienes una cuenta, regístrate gratis.'
                });
            }

            const usuario = resultados[0];

            bcrypt.compare(password, usuario.password, (err, ok) => {

                if (err) {
                    return res.render('auth/login', {
                        titulo: 'Login',
                        error: 'Error al validar credenciales'
                    });
                }

                // ❌ Password incorrecta
                if (!ok) {
                    return res.render('auth/login', {
                        titulo: 'Login',
                        error: 'Email o contraseña incorrectos. Si aún no tienes una cuenta, regístrate gratis.'
                    });
                }

                // =========================
                // SESIÓN
                // =========================
                req.session.usuario = {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    rol: usuario.rol
                };

                // =========================
                // REDIRECCIÓN SEGÚN ROL
                // =========================
                if (usuario.rol === 'admin') {
                    return res.redirect('/admin/dashboard');
                }

                return res.redirect('/clientes/dashboard');
            });

        });
    },

    // =========================
    // REGISTER
    // =========================
    mostrarRegister: (req, res) => {
        res.render('auth/register', { titulo: 'Registro' });
    },

    register: (req, res) => {

        const { nombre, email, password, telefono } = req.body;

        Usuario.obtenerPorEmail(email, (err, existe) => {

            if (err) {
                return res.send('Error servidor');
            }

            if (existe.length > 0) {
                return res.render('auth/register', {
                    titulo: 'Registro',
                    error: 'El usuario ya existe'
                });
            }

            bcrypt.hash(password, 10, (err, hash) => {

                if (err) return res.send('Error hash');

                // =========================
                // 1. CREAR USUARIO
                // =========================
                Usuario.crear({
                    nombre,
                    email,
                    password: hash,
                    rol: 'cliente'
                }, (errorUsuario, resultadoUsuario) => {

                    if (errorUsuario) {
                        console.error(errorUsuario);
                        return res.send('Error al registrar usuario');
                    }

                    const usuario_id = resultadoUsuario.insertId;

                    // =========================
                    // 2. CREAR CLIENTE
                    // =========================
                    Cliente.crear({
                        nombre,
                        telefono,
                        email,
                        usuario_id
                    }, (errorCliente) => {

                        if (errorCliente) {
                            console.error(errorCliente);
                            return res.send('Error al crear cliente');
                        }

                        return res.redirect('/login');

                    });

                });

            });

        });

    },

    // =========================
    // LOGOUT
    // =========================
    logout: (req, res) => {
        req.session.destroy(() => {
            res.redirect('/login');
        });
    }

};

module.exports = authController;