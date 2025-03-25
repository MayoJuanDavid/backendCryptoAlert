const express = require("express");
const router = express.Router();
const priceAlertsController = require("../controllers/priceAlertsController");

/**
 * @swagger
 * /api/price-alerts:
 *   post:
 *     summary: Crea una alerta de precio para una criptomoneda
 *     tags: [Price Alerts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cryptoSymbol:
 *                 type: string
 *                 example: "BTC"
 *               targetPrice:
 *                 type: number
 *                 example: 65000
 *               direction:
 *                 type: string
 *                 enum: [above, below]
 *               userId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Alerta de precio creada exitosamente
 */
router.post("/", priceAlertsController.createPriceAlert);

/**
 * @swagger
 * /api/price-alerts:
 *   get:
 *     summary: Obtiene todas las alertas de precio
 *     tags: [Price Alerts]
 *     responses:
 *       200:
 *         description: Lista de alertas de precio obtenida correctamente
 */
router.get("/", priceAlertsController.getPriceAlerts);

module.exports = router;
