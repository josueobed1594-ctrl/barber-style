const db = require('../config/db');

const Servicio = {

    obtenerTodos: (callback) => {

        const sql = `
            SELECT *
            FROM servicios
            WHERE estado = 1
            ORDER BY nombre ASC
        `;

        db.query(sql, callback);

    }

};

module.exports = Servicio;