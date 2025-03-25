const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     summary: Obtener criptos seleccionadas por usuario
 *     description: Retorna las criptomonedas que un usuario ha seleccionado para recibir alertas.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: Dirección de la wallet del usuario
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de criptos seleccionadas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 selectedCryptos:
 *                   type: array
 *                   items:
 *                     type: string
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error obteniendo criptos seleccionadas
 */
router.get("/:userId", userController.getUser);

/**
 * @swagger
 * /api/users/{userId}:
 *   post:
 *     summary: Actualizar criptos seleccionadas por usuario
 *     description: Permite al usuario actualizar las criptomonedas de las cuales quiere recibir alertas.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: Dirección de la wallet del usuario
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               selectedCryptos:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Criptos actualizadas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 selectedCryptos:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: Error actualizando criptos seleccionadas
 */
router.post('/:userId', userController.createUser);


module.exports = router;
