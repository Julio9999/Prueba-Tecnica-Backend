const express = require('express');
const app = express();
const morgan = require('morgan');
const path = require('path');


// swagger
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerSpec = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Prueba Tecnica Backend",
      version: "1.0.0",
      description: "Una API de prueba"
    },
    servers: [
      {
        url: process.env.URL||"http://localhost:4000"
      }
    ]
  },
  apis: [`${path.join(__dirname, "./routes/index.routes.js")}`]
}

const PORT = process.env.PORT || 4000;

// middleware para procesar datos en formato JSON
app.use(express.json());

// middleware de para generar logs
if(process.env.PRODUCCION == undefined){
    // app.use(morgan('dev'));
}
// midleware para swagger
app.use("/api-doc", swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerSpec)))


// importar las rutas definidas
app.use(require('./routes/index.routes'));


app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
})