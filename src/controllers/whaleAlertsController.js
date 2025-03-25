const WhaleAlert = require('../models/WhaleAlert');

// Crear una nueva alerta
exports.createAlert = async (req, res) => {
    try {
        const { walletAddress, threshold, network, userId } = req.body;
        const newAlert = new WhaleAlert({ walletAddress, threshold, network, userId });
        await newAlert.save();
        res.status(201).json(newAlert);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener todas las alertas
exports.getAlerts = async (req, res) => {
    try {
        const alerts = await WhaleAlert.find();
        res.status(200).json(alerts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};