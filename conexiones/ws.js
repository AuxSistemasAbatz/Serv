import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import QR from "qr-image";
import fs from "fs";

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "web",
  }),
  puppeteer: {
    headless: false,
  },
});
export let qrAnterior = "";

client.on("qr", (qr) => {
  console.log("QR recibidio", qr);
  qrAnterior = qr;
  const ImagenDeQr = QR.image(qr, { type: "png" });
  ImagenDeQr.pipe(fs.createWriteStream("Qr.png"));
});

client.on("ready", () => {
  console.log("El cliente esta listo");
});

client.on("authenticated", (session) => {
  console.log("Autenticado");
});

client.on("auth_failure", (msg) => {
  console.log("Error de autenticacion", msg);
});

//client.initialize();

const ObtenerImagenDeQr = (req, res) => {
  let ImagenDeQr = QR.imageSync(qrAnterior, { type: "png" });
  res.send(ImagenDeQr);
};

export default client;

export { ObtenerImagenDeQr };
