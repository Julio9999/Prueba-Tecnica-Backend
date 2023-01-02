const { Pool } = require('pg');
const credenciales = require('../config');


// Conexion con la base de datos

const pool = new Pool({
    database: credenciales.database_name,
    user: credenciales.user_name,
    password: credenciales.user_password,
    port: credenciales.port,
    host: credenciales.host
});

module.exports = pool;