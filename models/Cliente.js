const db = require('../config/db');

const Cliente = {

    // =========================
    // CREAR CLIENTE
    // =========================
   crear: (datos, callback) => {

    const sql = `
        INSERT INTO clientes
        (nombre, telefono, email, usuario_id)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [
        datos.nombre,
        datos.telefono,
        datos.email,
        datos.usuario_id
    ], callback);
},
    // =========================
    // BUSCAR POR EMAIL
    // =========================
    obtenerPorEmail: (email, callback) => {

        const sql = `
            SELECT *
            FROM clientes
            WHERE email = ?
            LIMIT 1
        `;

        db.query(sql, [email], callback);
    },

    // =========================
    // BUSCAR POR USUARIO_ID
    // =========================
    obtenerPorUsuario: (usuario_id, callback) => {

        const sql = `
            SELECT *
            FROM clientes
            WHERE usuario_id = ?
            LIMIT 1
        `;

        db.query(sql, [usuario_id], callback);
    }

};

module.exports = Cliente;