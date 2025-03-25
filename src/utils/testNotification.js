require("dotenv").config();
const PushAPI = require("@pushprotocol/restapi");
const ethers = require("ethers");

const PRIVATE_KEY = process.env.PUSH_PRIVATE_KEY;
const CHANNEL_ADDRESS = `eip155:11155111:${process.env.PUSH_CHANNEL_ADDRESS}`;
const signer = new ethers.Wallet(PRIVATE_KEY);

const recipient = `eip155:1:${process.env.TEST_WALLET_ADDRESS}`;

console.log(
  "📩 Dirección de la wallet de prueba:",
  process.env.TEST_WALLET_ADDRESS
);
console.log("📩 Formato del destinatario:", recipient);

async function testSendNotification() {
  try {
    console.log(
      "📨 Intentando enviar una notificación de prueba a Push Protocol..."
    );

    const response = await PushAPI.payloads.sendNotification({
      signer,
      type: 1, // Tipo de notificación: Individual
      identityType: 2, // Direct payload
      notification: {
        title: "🚀 Test Notification",
        body: "This is a test message from backend.",
      },
      payload: {
        title: "🚀 Test Notification",
        body: "This is a test message from backend.",
        cta: "",
        img: "",
      },
      channel: CHANNEL_ADDRESS,
      recipients: [recipient],
      env: "staging",
    });

    console.log("✅ Notificación de prueba enviada con éxito:", response);
  } catch (error) {
    console.error("❌ Error enviando la notificación de prueba:", error);
  }
}

testSendNotification();
