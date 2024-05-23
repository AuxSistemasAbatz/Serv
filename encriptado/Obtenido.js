import fs from "fs";
import forge from "node-forge";

// Leer el archivo del certificado
const pem = fs.readFileSync(
  "./encriptado/multicobroskeyunixbanortecom.cer",
  "utf8"
);

// Convertir el certificado PEM a un certificado forge
const certForge = forge.pki.certificateFromPem(pem);

// Extraer la clave pública como un objeto forge
const publicKeyForge = certForge.publicKey;

// Convertir la clave pública a formato PEM
const publicKeyPemObtenida = forge.pki.publicKeyToPem(publicKeyForge);

export default publicKeyPemObtenida;
