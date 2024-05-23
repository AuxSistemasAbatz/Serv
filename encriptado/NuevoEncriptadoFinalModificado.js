//Nuevo encriptado final 27/03/2024
import crypto from "crypto";
import NodeRSA from "node-rsa";
import publicKeyPemObtenida from "./Obtenido.js";
import CrearMapaDeDatos from "./PlantillaDeMapaDeDatos.js";

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

const GenerarClave = (req, res) => {
  console.log(req);
  const datos = req.body;
  const datosFormateados = CrearMapaDeDatos(datos);
  let claves = {
    Clave: CrearPassPhrase(),
    saltByte: Buffer.from(CrearCadenaAleatoria(), "utf8"),
    vi: Buffer.from(CrearCadenaAleatoria(), "utf8"),
  };
  const llave = AESEncryptString(JSON.stringify(datosFormateados), claves);
  const pData =
    claves.saltByte.toString("hex") +
    "::" +
    claves.vi.toString("hex") +
    "::" +
    llave.Clave;
  const encrypted = RSAEncryptWithPK(pData, publicKeyPemObtenida);
  let cadenaCompletaDeCif = llave.DatosCifrados + ":::" + encrypted;

  res.send({ data: cadenaCompletaDeCif });
};

export default GenerarClave;

class CifradoController {
  constructor() {
    this.logger = console;
  }

  async cifrarInformacion(request) {
    let responseBO;

    const llavePublica = request.pubKeyStrCert;
    const cadenaACifrarEnBase64 = request.base64;

    const ivHex = CrearCadenaAleatoria().toString("hex");
    const saltHex = CrearCadenaAleatoria().toString("hex");
    const passPhrase = CrearCadenaAleatoria();

    try {
      const cadenaACifrarDecodificada = Buffer.from(
        cadenaACifrarEnBase64,
        "base64"
      ).toString("utf-8");

      const cipher = crypto.createCipheriv("aes-256-ctr", passPhrase, ivHex);
      let cadenaCifradaAES = cipher.update(
        cadenaACifrarDecodificada,
        "utf8",
        "hex"
      );
      cadenaCifradaAES += cipher.final("hex");

      const decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        passPhrase,
        ivHex
      );
      let cadenaDescifradaAES = decipher.update(
        cadenaCifradaAES,
        "hex",
        "utf8"
      );
      cadenaDescifradaAES += decipher.final("utf8");

      const aesKey = `${ivHex}::${saltHex}::${passPhrase}`;

      const key = new NodeRSA(llavePublica);
      const cadenaCifradaRSA = key.encrypt(aesKey, "base64");

      const cadenaParaOrquestador = `${cadenaCifradaRSA}:::${cadenaCifradaAES}`;

      responseBO = {
        code: "100",
        status: "200",
        message: "OK",
        data: cadenaParaOrquestador,
      };
    } catch (e) {
      responseBO = {
        code: null,
        status: "500",
        message: "No Procesado",
        data: null,
      };
      this.logger.error("Ocurrio un error General [{}]", e);
    }
    return responseBO;
  }

  async descifrarInformacion(request) {
    let responseBO;

    this.logger.debug("Request [{}]", request.passphrase);

    const serviceId = "100";

    try {
      this.logger.debug(
        "1.- Información a descifrar (JSON Datos) [{}]... ",
        request.cypherData
      );
      this.logger.debug(
        "2.- Llaves para descifrado: Vi [{}], Salt [{}], PassPhrase [{}] ... ",
        request.vi,
        request.salt,
        request.passphrase
      );

      const decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        request.passphrase,
        request.vi
      );
      let descifradoAES = decipher.update(request.cypherData, "hex", "utf8");
      descifradoAES += decipher.final("utf8");

      this.logger.debug("3.- Resultado decifrado AES: [{}]", descifradoAES);

      responseBO = {
        code: "100",
        status: "200",
        message: "OK",
        data: descifradoAES,
      };
    } catch (e) {
      responseBO = {
        code: null,
        status: "500",
        message: "No Procesado",
        data: null,
      };
      this.logger.error("Ocurrio un error General [{}]", e);
    }
    return responseBO;
  }
}

const EncriptarDatosDeBN = (req, res) => {
  let { base64, pubKeyStrCert } = req.body;
  const cifradoController = new CifradoController();
  const request = {
    base64,
    pubKeyStrCert,
  };
  cifradoController.cifrarInformacion(request).then((response) => {
    res.status(200).send(response);
  });
};

export { EncriptarDatosDeBN };
