import { obtenerProductosDeArchivo } from "../solicitudes.js";
import ActualizarArchivos from "../base/ActualizacionDeArchivos.js";

const ObtenerProductosDeVariable = (req, res) => {
  obtenerProductosDeArchivo(req, res);
};

const ActualizarLasOfertas = (req, res) => {
  console.log("Actualizando ofertas");
  ActualizarArchivos(true);
  res.send("ok");
};

export { ObtenerProductosDeVariable, ActualizarLasOfertas };
