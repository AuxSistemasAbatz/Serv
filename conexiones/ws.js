import { Client } from "whatsapp-web.js";
import QR from "qr-image";

const client = new Client();
export let qrAnterior = "";

client.on("qr", (qr) => {
  console.log("QR recibidio", qr);
  qrAnterior = qr;
});

client.on("ready", () => {
  console.log("El cliente esta ready");
});

client.on("message", (message) => {
  if (message.body === "!ping") {
    message.reply("pong");
  }
});

client.initialize();

export default client;
