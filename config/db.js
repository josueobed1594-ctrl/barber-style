const mysql = require('mysql2');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});

connection.connect((error) => {
    if (error) {
        console.error('❌ Error MySQL:', error);
        return;
    }

    console.log(
        isProduction
            ? '🚀 Conectado a Railway (PROD)'
            : '🖥 Conectado a MySQL Local'
    );
});

module.exports = connection;