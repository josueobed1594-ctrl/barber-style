const db = require('../config/db');

const Cita = {

    crear: (datos, callback) => {

        const sql = `
            INSERT INTO citas
            (cliente_id, barbero_id, fecha, hora, observacion)
            VALUES (?, ?, ?, ?, ?)
        `;

        db.query(sql, [
            datos.cliente_id,
            datos.barbero_id,
            datos.fecha,
            datos.hora,
            datos.observacion
        ], callback);

    },

    verificarDisponibilidad: (barbero_id, fecha, hora, callback) => {

        // 🔥 NORMALIZAR HORA (IMPORTANTE)
        const horaNormalizada = hora.length === 5 ? hora + ':00' : hora;

        const sql = `
            SELECT id
            FROM citas
            WHERE barbero_id = ?
            AND fecha = ?
            AND hora = ?
            AND estado <> 'cancelada'
        `;

        db.query(sql, [barbero_id, fecha, horaNormalizada], callback);

    },

    obtenerTodas: (callback) => {

        const sql = `
            SELECT
                citas.id,
                clientes.nombre AS cliente,
                clientes.telefono,
                barberos.nombre AS barbero,
                citas.fecha,
                citas.hora,
                citas.estado,
                citas.observacion
            FROM citas
            INNER JOIN clientes ON clientes.id = citas.cliente_id
            INNER JOIN barberos ON barberos.id = citas.barbero_id
            ORDER BY citas.fecha DESC, citas.hora DESC
        `;

        db.query(sql, callback);
    },

    actualizarEstado: (id, estado, callback) => {

        const sql = `
            UPDATE citas
            SET estado = ?
            WHERE id = ?
        `;

        db.query(sql, [estado, id], callback);
    },

    eliminar: (id, callback) => {

        const sql = `
            DELETE FROM citas
            WHERE id = ?
        `;

        db.query(sql, [id], callback);
    },

    contarPorEstado: (callback) => {

        const sql = `
            SELECT estado, COUNT(*) AS total
            FROM citas
            GROUP BY estado
        `;

        db.query(sql, callback);
    },

    obtenerMetricas: (callback) => {

        const sql = `
            SELECT

                SUM(CASE WHEN fecha = CURDATE() THEN 1 ELSE 0 END) AS hoy,

                SUM(CASE WHEN YEARWEEK(fecha,1) = YEARWEEK(CURDATE(),1) THEN 1 ELSE 0 END) AS semana,

                SUM(
                    CASE 
                        WHEN MONTH(fecha) = MONTH(CURDATE())
                        AND YEAR(fecha) = YEAR(CURDATE())
                        THEN 1 ELSE 0
                    END
                ) AS mes,

                COUNT(*) AS total

            FROM citas
            WHERE estado <> 'cancelada'
        `;

        db.query(sql, callback);
    },

    obtenerUltimos7Dias: (callback) => {

        const sql = `
            SELECT
                DATE_FORMAT(fecha, '%d/%m') AS dia,
                COUNT(*) AS total
            FROM citas
            WHERE fecha >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
            GROUP BY fecha
            ORDER BY fecha ASC
        `;

        db.query(sql, callback);
    },

    obtenerPorCliente: (cliente_id, callback) => {

        const sql = `
            SELECT *
            FROM citas
            WHERE cliente_id = ?
            ORDER BY fecha DESC
        `;

        db.query(sql, [cliente_id], callback);
    }

};

module.exports = Cita;