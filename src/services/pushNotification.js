require("dotenv").config();
const PushAPI = require("@pushprotocol/restapi");
const ethers = require("ethers");
const User = require("../models/User");

const IS_STAGING = process.env.PUSH_ENV === "staging";
const NETWORK_ID = IS_STAGING ? 11155111 : 1; // Sepolia para staging, Mainnet para producción
const CHANNEL_ADDRESS = `eip155:${NETWORK_ID}:${process.env.PUSH_CHANNEL_ADDRESS}`;
const signer = new ethers.Wallet(process.env.PUSH_PRIVATE_KEY);

console.log(
  `🚀 Usando Push Protocol en ${
    IS_STAGING ? "staging (Sepolia)" : "producción (Mainnet)"
  }`
);
console.log(`📢 Canal de Push Protocol: ${CHANNEL_ADDRESS}`);

async function sendPushNotification(type, data) {
  try {
    if (!["whale", "price"].includes(type)) {
      console.error("❌ Error: Tipo de notificación inválido", { type, data });
      return;
    }

    let title = "";
    let body = "";

    if (type === "whale") {
      title = "🚨 Whale Alert 🚨";
      body = `Una transacción de ${
        data.amount
      } ${data.cryptoSymbol.toUpperCase()} ${
        data.usdEquivalent
      } ha sido detectada en ${data.network} desde la wallet ${
        data.walletAddress
      }`;
    } else if (type === "price") {
      title = "🚨 Crypto Price Alert 🚨";
      body = `${data.cryptoSymbol.toUpperCase()} ha alcanzado ${
        data.price
      } USD`;
    }

    console.log("📨 Enviando notificación con:", { title, body });

    const notification = await PushAPI.payloads.sendNotification({
      signer,
      type: 1,
      identityType: 2,
      notification: { title, body },
      payload: { title, body, cta: "", img: "" },
      channel: CHANNEL_ADDRESS,
      recipients: [`eip155:${NETWORK_ID}:${data.userId}`],
      env: IS_STAGING ? "staging" : "prod",
    });

    console.log("✅ Notificación enviada:", notification);
  } catch (error) {
    console.error("❌ Error enviando la notificación:", error);
  }
}

module.exports = { sendPushNotification };
