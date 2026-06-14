const db = require('../config/db');

const Barbero = {

    obtenerTodos: (callback) => {

        const sql = `
            SELECT *
            FROM barberos
            WHERE estado = 1
            ORDER BY nombre ASC
        `;

        db.query(sql, callback);

    },

    obtenerPorId: (id, callback) => {

        const sql = `
            SELECT *
            FROM barberos
            WHERE id = ?
        `;

        db.query(sql, [id], callback);

    }

};

module.exports = Barbero;