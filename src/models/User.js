const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // Dirección de la wallet
  selectedCryptos: { type: [String], default: [] }, // Monedas que quiere monitorear
});

module.exports = mongoose.model("User", UserSchema);
