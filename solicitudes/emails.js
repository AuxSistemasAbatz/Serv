import EnviarEmail, { EnviarEmailDeContra } from "../conexiones/email.js";
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

export { enviarEmail, enviarEmailDeContra };
