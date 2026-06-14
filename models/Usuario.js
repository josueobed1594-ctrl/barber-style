const db = require('../config/db');

const Usuario = {

    obtenerPorEmail: (email, callback) => {

        const sql = `
            SELECT *
            FROM usuarios
            WHERE email = ?
        `;

        db.query(sql, [email], callback);
    },

    crear: (datos, callback) => {

        const sql = `
            INSERT INTO usuarios
            (nombre, email, password, rol)
            VALUES (?, ?, ?, ?)
        `;

        db.query(sql, [
            datos.nombre,
            datos.email,
            datos.password,
            datos.rol
        ], callback);
    }

};

module.exports = Usuario;