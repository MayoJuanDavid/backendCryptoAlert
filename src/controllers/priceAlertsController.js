const PriceAlert = require('../models/PriceAlert');

// Crear una nueva alerta de precio
exports.createPriceAlert = async (req, res) => {
    try {
        const { cryptoSymbol, targetPrice, direction, userId } = req.body;
        const newAlert = new PriceAlert({ cryptoSymbol, targetPrice, direction, userId });
        await newAlert.save();
        res.status(201).json(newAlert);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener todas las alertas de precio
exports.getPriceAlerts = async (req, res) => {
    try {
        const alerts = await PriceAlert.find();
        res.status(200).json(alerts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
