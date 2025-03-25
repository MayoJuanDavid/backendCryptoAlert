const axios = require("axios");
const User = require("../models/User");
const { sendPushNotification } = require("./pushNotification");

const ETHERSCAN_API = `https://api.etherscan.io/api?module=account&action=txlist&sort=desc&apikey=${process.env.ETHERSCAN_API_KEY}`;
const BTC_API = "https://blockchain.info/unconfirmed-transactions?format=json";

const ETH_THRESHOLD = 10; // ETH
const BTC_THRESHOLD = 10; // BTC

async function getCryptoPrice(crypto) {
  try {
    console.log(`🔍 Obteniendo precio de ${crypto} en USD...`);
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price`,
      {
        params: { ids: crypto, vs_currencies: "usd" },
      }
    );

    const price = response.data[crypto]?.usd;
    return price && !isNaN(price) ? price : 0;
  } catch (error) {
    console.error(`❌ Error obteniendo el precio de ${crypto}:`, error.message);
    return 0;
  }
}

async function checkEthereumTransactions() {
  try {
    console.log("🔍 Consultando transacciones grandes en Ethereum...");

    const response = await axios.get(
      "https://api.blockchair.com/ethereum/mempool/transactions"
    );
    const transactions = response.data.data;

    if (!transactions || transactions.length === 0) {
      console.log("⚠️ No se encontraron transacciones en Ethereum.");
      return;
    }

    for (const tx of transactions) {
      const ethAmount = Number(tx.value) / 1e18;
      if (ethAmount >= ETH_THRESHOLD) {
        const sender = tx.sender || "Desconocido";
        const recipient = tx.recipient || "Desconocido";
        const ethPrice = await getCryptoPrice("ethereum");
        const usdValue = (ethPrice * ethAmount).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        });

        console.log(
          `🚨 Whale Alert: ${ethAmount} ETH (~${usdValue}) desde ${sender} hacia ${recipient}`
        );

        await notifyUsers("ethereum", {
          userId: sender,
          walletAddress: sender,
          amount: ethAmount,
          cryptoSymbol: "ethereum",
          network: "Ethereum",
        });
      }
    }
  } catch (error) {
    console.error("❌ Error en Ethereum Whale Alert:", error.message);
  }
}

async function checkBitcoinTransactions() {
  try {
    console.log("🔍 Consultando transacciones grandes en Bitcoin...");
    const response = await axios.get(BTC_API);
    const transactions = response.data?.txs;

    if (!transactions || !Array.isArray(transactions)) {
      console.error(
        "❌ Error en Bitcoin Whale Alert: No se encontraron transacciones válidas."
      );
      return;
    }

    for (const tx of transactions) {
      if (
        !tx.out ||
        tx.out.length === 0 ||
        !tx.inputs ||
        tx.inputs.length === 0
      ) {
        continue;
      }

      const btcAmount = Number(tx.out[0].value) / 1e8;
      if (btcAmount >= BTC_THRESHOLD) {
        const sender = tx.inputs[0]?.prev_out?.addr || "Desconocido";
        const recipient = tx.out[0]?.addr || "Desconocido";
        const btcPrice = await getCryptoPrice("bitcoin");
        const usdValue = (btcPrice * btcAmount).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        });

        console.log(
          `🚨 Whale Alert: ${btcAmount} BTC (~${usdValue}) desde ${sender} hacia ${recipient}`
        );

        await notifyUsers("bitcoin", {
          userId: sender,
          walletAddress: sender,
          amount: btcAmount,
          cryptoSymbol: "bitcoin",
          network: "Bitcoin",
        });
      }
    }
  } catch (error) {
    console.error("❌ Error en Bitcoin Whale Alert:", error.message);
  }
}

async function notifyUsers(crypto, data) {
  console.log(
    `🔍 Buscando usuarios que tienen "${crypto}" en selectedCryptos...`
  );
  const users = await User.find({ selectedCryptos: crypto });

  if (users.length === 0) {
    console.log(
      `⚠️ No hay usuarios interesados en esta notificación para ${crypto}.`
    );
    return;
  }

  const cryptoPrice = await getCryptoPrice(crypto);
  const usdEquivalent = cryptoPrice
    ? (data.amount * cryptoPrice).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      })
    : "(USD no disponible)";

  for (const user of users) {
    console.log(`📨 Enviando notificación a ${user.userId} sobre ${crypto}`);

    await sendPushNotification("whale", {
      userId: user.userId,
      walletAddress: data.walletAddress,
      amount: data.amount,
      cryptoSymbol: data.cryptoSymbol,
      network: data.network,
      usdEquivalent,
    });
  }
}

function startWhaleMonitor() {
  console.log("📡 Iniciando monitoreo de Whale Alerts...");
  setInterval(checkEthereumTransactions, 30 * 1000);
  setInterval(checkBitcoinTransactions, 30 * 1000);
}

module.exports = startWhaleMonitor;
