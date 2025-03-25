const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Crypto Alert API",
      version: "1.0.0",
      description:
        "API para alertas de precios y transacciones de criptomonedas",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Servidor de desarrollo",
      },
    ],
  },
  apis: ["./routes/*.js"], // Asegúrate de que coincida con tu estructura de rutas
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerDocs };
