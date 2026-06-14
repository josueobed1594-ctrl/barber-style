const express = require('express');
const path = require('path');
const session = require('express-session');

require('dotenv').config();

// BD
require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// =============================
// EJS
// =============================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// =============================
// MIDDLEWARES
// =============================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// =============================
// SESIONES
// =============================
app.use(session({
    secret: 'barber-style-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 8 }
}));

// =============================
// USUARIO GLOBAL EN VISTAS
// =============================
app.use((req, res, next) => {
    res.locals.usuario = req.session.usuario || null;
    next();
});

// =============================
// PUBLIC
// =============================
app.use(express.static(path.join(__dirname, 'public')));

// =============================
// ROUTES
// =============================
const authRoutes = require('./routes/authRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const servicioRoutes = require('./routes/servicioRoutes');
const citaRoutes = require('./routes/citaRoutes');
const adminRoutes = require('./routes/adminRoutes');
const clienteDashboardRoutes = require('./routes/clienteDashboardRoutes');

app.use('/', clienteRoutes);
app.use('/', authRoutes);
app.use('/', servicioRoutes);
app.use('/', citaRoutes);
app.use('/', adminRoutes);
app.use('/', clienteDashboardRoutes);

// =============================
// START SERVER
// =============================
app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
});