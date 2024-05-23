import EnviarEmail, {
  EnviarEmailDeContra,
  EnviarEmailDeDiaDeEnvio,
} from "../conexiones/emailNode.js";
import { crearIdDeSolicitud, guardadoDeNuevaSolicitud } from "./solicitudes.js";

const enviarEmail = (req, res) => {
  let { tipodecliente, nombre, email, telefono, mensaje } = req.body;
  EnviarEmail(tipodecliente, nombre, email, telefono, mensaje);
  res.send({ status: "OK" });
};

const enviarEmailDeContra = async (req, res) => {
  let { correo } = req.body;
  let nuevoId = crearIdDeSolicitud();
  guardadoDeNuevaSolicitud(nuevoId, correo, res);
  EnviarEmailDeContra(correo, nuevoId);
};

const EnviarAvisoDeDiaDeEnvio = async (req, res) => {
  let { correo, id, dia } = req.body;
  EnviarEmailDeDiaDeEnvio(res, id, correo, dia);
};

export { enviarEmail, enviarEmailDeContra, EnviarAvisoDeDiaDeEnvio };
