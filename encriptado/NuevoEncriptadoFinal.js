//Nuevo encriptado final 27/03/2024
import crypto from "crypto";
import NodeRSA from "node-rsa";
import publicKeyPemObtenida from "./Obtenido.js";

function CrearPassPhrase() {
  const cadenaDeCaracteres =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz*&-%/!?*+=()";
  let passPhrase = "";
  for (let i = 0; i < 16; i++) {
    passPhrase += cadenaDeCaracteres.charAt(
      Math.floor(Math.random() * cadenaDeCaracteres.length)
    );
  }
  return passPhrase;
}
function CrearCadenaAleatoria() {
  const cadenaDeCaracteres = "0123456789abcdefghiklmnopqrstuvwxyz";
  let passPhrase = "";
  for (let i = 0; i < 16; i++) {
    passPhrase += cadenaDeCaracteres.charAt(
      Math.floor(Math.random() * cadenaDeCaracteres.length)
    );
  }
  return passPhrase;
}

function AESEncryptString(datosJSONtxt, claves) {
  const key = crypto.pbkdf2Sync(
    claves.Clave,
    claves.saltByte,
    1000,
    32,
    "sha256"
  );

  const cipher = crypto.createCipheriv("aes-256-ctr", key, claves.vi);
  let datosCifrados = cipher.update(datosJSONtxt, "utf8", "base64");
  datosCifrados += cipher.final("base64");

  return {
    DatosCifrados: datosCifrados,
    Clave: claves.Clave,
    Vi: claves.vi.toString("base64"),
  };
}

function RSAEncryptWithPK(pData, rsaPublicKey) {
  const key = new NodeRSA();
  key.importKey(rsaPublicKey, "pkcs8-public-pem");
  const encrypted = key.encrypt(pData, "base64");
  return encrypted;
}

const ValidarClaveRSA = (clave) => {
  try {
    const key = new NodeRSA();
    key.importKey(clave, "pkcs8-public-pem");
    console.log("Clave valida");
  } catch (err) {
    console.log("Clave invalida");
    console.log(err);
  }
};

const GenerarClave = (req, res) => {
  const { base64 } = req.body;
  let datosFormateados = Buffer.from(base64, "base64").toString("utf8");
  datosFormateados = JSON.parse(datosFormateados);
  datosFormateados["merchantId"] = process.env.ID_AFILIACION_BANORTE;
  datosFormateados["name"] = process.env.NOMBRE_BANORTE_2;
  datosFormateados["password"] = process.env.CONTRA_DE_BAN_2;
  datosFormateados["terminalId"] = process.env.TERMINAL_ID_BANORTE;
  datosFormateados = JSON.stringify(datosFormateados);
  let claves = {
    Clave: CrearPassPhrase(),
    saltByte: Buffer.from(CrearCadenaAleatoria(), "utf8"),
    vi: Buffer.from(CrearCadenaAleatoria(), "utf8"),
  };
  const llave = AESEncryptString(datosFormateados, claves);
  const pData =
    claves.vi.toString("hex") +
    "::" +
    claves.saltByte.toString("hex") +
    "::" +
    llave.Clave;
  const encrypted = RSAEncryptWithPK(pData, publicKeyPemObtenida);
  let cadenaCompletaDeCif = encrypted + ":::" + llave.DatosCifrados;
  res.send({
    data: cadenaCompletaDeCif,
  });
};

export default GenerarClave;
