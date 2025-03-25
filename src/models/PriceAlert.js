const mongoose = require('mongoose');

const PriceAlertSchema = new mongoose.Schema({
  cryptoSymbol: { type: String, required: true }, // BTC, ETH, etc.
  targetPrice: { type: Number, required: true },
  direction: { type: String, required: true, enum: ["above", "below"] },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PriceAlert", PriceAlertSchema);
