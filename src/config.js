const { config } = require('dotenv');

config();

// uso de las variables de entorno

module.exports = credenciales = {
    database_name: process.env.DATABASE_NAME,
    user_name: process.env.USER_NAME,
    user_password: process.env.USER_PASSWORD,
    port: process.env.PORT,
    host: process.env.HOST,
    jwt_secret: process.env.JWT_SECRET,
}