const mongoose = require("mongoose");

const WhaleAlertSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true },
  threshold: { type: Number, required: true },
  network: {
    type: String,
    required: true,
    enum: ["Ethereum", "Polygon", "BNB Chain"],
  },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("WhaleAlert", WhaleAlertSchema);
