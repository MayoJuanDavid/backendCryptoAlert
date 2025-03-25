const User = require("../models/User");

exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.json({ selectedCryptos: user.selectedCryptos });
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo criptos seleccionadas" });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { selectedCryptos } = req.body;
    let user = await User.findOne({ userId: req.params.userId });
    if (!user) {
      user = new User({ userId: req.params.userId, selectedCryptos });
    } else {
      user.selectedCryptos = selectedCryptos;
    }
    await user.save();
    res.json({
      message: "Criptos actualizadas",
      selectedCryptos: user.selectedCryptos,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error actualizando criptos seleccionadas" });
  }
};
