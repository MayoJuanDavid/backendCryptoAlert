const axios = require("axios");
const User = require("../models/User");
const { sendPushNotification } = require("./pushNotification");

const COINGECKO_API = "https://api.coingecko.com/api/v3/simple/price";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
let priceCache = {};

async function fetchCryptoPrices(cryptoIds) {
  const missingCryptos = cryptoIds.filter(
    (id) =>
      !priceCache[id] || Date.now() - priceCache[id].timestamp > CACHE_DURATION
  );
  if (missingCryptos.length === 0) return;

  try {
    const response = await axios.get(COINGECKO_API, {
      params: { ids: missingCryptos.join(","), vs_currencies: "usd" },
    });
    for (const crypto of missingCryptos) {
      priceCache[crypto] = {
        price: response.data[crypto]?.usd || 0,
        timestamp: Date.now(),
      };
    }
  } catch (error) {
    console.error(
      "❌ Error obteniendo precios de criptomonedas:",
      error.message
    );
  }
}

async function checkPriceAlerts() {
  try {
    console.log("🔍 Verificando alertas de precios...");
    const users = await User.find();
    if (users.length === 0) return;

    const uniqueCryptos = [
      ...new Set(users.flatMap((user) => user.selectedCryptos)),
    ];
    await fetchCryptoPrices(uniqueCryptos);

    for (const user of users) {
      for (const crypto of user.selectedCryptos) {
        const currentPrice = priceCache[crypto]?.price;
        if (!currentPrice) continue;

        console.log(
          `🚨 Enviando alerta de precio para ${crypto.toUpperCase()} a ${
            user.userId
          }`
        );
        await sendPushNotification("price", {
          userId: user.userId,
          cryptoSymbol: crypto,
          price: currentPrice,
        });
      }
    }
  } catch (error) {
    console.error("❌ Error al verificar alertas de precio:", error.message);
  }
}

function startPriceMonitor() {
  console.log("📡 Iniciando monitoreo de precios cada 60 segundos...");
  setInterval(checkPriceAlerts, 60000);
}

module.exports = startPriceMonitor;
