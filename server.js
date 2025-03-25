require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { swaggerUi, swaggerDocs } = require("./src/config/swaggerConfig");

// Importar rutas modularizadas
const whaleRoutes = require("./src/routes/whaleAlerts");
const priceRoutes = require("./src/routes/priceAlerts");
const userRoutes = require("./src/routes/userRoutes");

// Importar monitores
const startPriceMonitor = require("./src/services/priceMonitor");
const startWhaleMonitor = require("./src/services/whaleMonitor");

// Conexión a MongoDB
const { connectDB } = require("./src/config/db");
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// Configurar documentación de API
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rutas
app.use("/api/whale-alerts", whaleRoutes);
app.use("/api/price-alerts", priceRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);

  // Iniciar monitores
  startPriceMonitor();
  startWhaleMonitor();
});
