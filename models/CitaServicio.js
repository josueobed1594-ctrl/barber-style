const db = require('../config/db');

const CitaServicio = {

    crear: (cita_id, servicio_id, callback) => {

        const sql = `
            INSERT INTO cita_servicios
            (
                cita_id,
                servicio_id
            )
            VALUES (?, ?)
        `;

        db.query(
            sql,
            [
                cita_id,
                servicio_id
            ],
            callback
        );

    }



    

};






module.exports = CitaServicio;