import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { Solicitudes } from "../modelos/solicitudes/solicitudes.js";
import { Cliente } from "../modelos/clientes/clientes.js";
import { EnviarEmailDeCambioDeContra } from "../conexiones/email.js";
import {
  desencriptarCorreo,
  encriptarContra,
  encriptarCorreo,
} from "../utilidades/encriptado.js";
dotenv.config();

const crearIdDeSolicitud = () => {
  let nuevoId = uuidv4();
  return nuevoId;
};

const guardadoDeNuevaSolicitud = async (id, correo, res) => {
  let fecha = new Date();
  let hora = fecha.getHours();
  let horaFormateada = hora < 10 ? "0" + hora : hora;
  let minutos = fecha.getMinutes();
  let minutosFormateados = minutos < 10 ? "0" + minutos : minutos;
  let nuevosDatos = {
    email: encriptarCorreo(correo.toLowerCase()),
    codigo: id,
    hora: horaFormateada + ":" + minutosFormateados,
    fecha: fecha.toDateString(),
    estatus: "ok",
  };
  const nuevaSolicitud = new Solicitudes(nuevosDatos);
  try {
    nuevaSolicitud
      .save()
      .then((response) => {
        console.log("ok");
        res.send({ estatus: "ok" });
      })
      .catch((err) => {
        console.log("error");
        res.status(400);
      });
  } catch (err) {
    console.log(err);
  }
};

const recuperarDatos = async (req, res) => {
  let { id } = req.body;
  try {
    Solicitudes.find({ codigo: id })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
};

const cambiarContraConCorreo = async (req, res) => {
  let { correo, nuevaContrasena, id } = req.body;
  let correoEncriptado = correo;
  let contraNuevaEncriptada = encriptarContra(nuevaContrasena);
  try {
    let data = await Solicitudes.find({
      codigo: id,
      email: correoEncriptado,
    });
    if (Array.isArray(data) && data.length > 0) {
      Solicitudes.findOneAndDelete({ codigo: id })
        .then((response) => {
          Cliente.findOneAndUpdate(
            { correo: correoEncriptado },
            { contrasena: contraNuevaEncriptada }
          )
            .then((response) => {
              EnviarEmailDeCambioDeContra(desencriptarCorreo(correo));
              res.status(200).send({ estatus: "ok" });
            })
            .catch((err) => {
              res.status(400).send();
            });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).send();
        });
    } else {
      res.status(400).send();
    }
  } catch (err) {
    console.log(err);
  }
};

export {
  crearIdDeSolicitud,
  guardadoDeNuevaSolicitud,
  recuperarDatos,
  cambiarContraConCorreo,
};
