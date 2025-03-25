const express = require('express');
const router = express.Router();
const whaleAlertsController = require('../controllers/whaleAlertsController');

/**
 * @swagger
 * /api/whale-alerts:
 *   post:
 *     summary: Crea una alerta de grandes transacciones en blockchain
 *     tags: [Whale Alerts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               walletAddress:
 *                 type: string
 *                 example: "0x123456789..."
 *               threshold:
 *                 type: number
 *                 example: 1000
 *               network:
 *                 type: string
 *                 enum: [Ethereum, Polygon, BNB Chain]
 *               userId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Alerta creada exitosamente
 */
router.post('/', whaleAlertsController.createAlert);

/**
 * @swagger
 * /api/whale-alerts:
 *   get:
 *     summary: Obtiene todas las alertas de grandes transacciones
 *     tags: [Whale Alerts]
 *     responses:
 *       200:
 *         description: Lista de alertas obtenida correctamente
 */
router.get('/', whaleAlertsController.getAlerts);

module.exports = router;