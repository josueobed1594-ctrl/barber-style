const db = require('../config/db');

const Cliente = {

    crear: (datos, callback) => {

        const sql = `
            INSERT INTO clientes
            (
                nombre,
                telefono,
                email
            )
            VALUES (?, ?, ?)
        `;

        db.query(
            sql,
            [
                datos.nombre,
                datos.telefono,
                datos.email
            ],
            callback
        );

    }

};

module.exports = Cliente;