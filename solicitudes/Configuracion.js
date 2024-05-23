import { Configuracion } from "../modelos/Configuraciones/configuraciones.js";

const AjustarConfiguracion = async (req, res) => {
  const {
    minimoDeEnvioLocal,
    minimoDeEnvioForaneo,
    permitirPago,
    permitirCualquierPago,
    usuario,
  } = req.body;
  console.log(usuario + ": Modifico los datos de configuración");
  const configuracion = await Configuracion.findOne();
  configuracion.minimoDeEnvioLocal = minimoDeEnvioLocal;
  configuracion.minimoDeEnvioForaneo = minimoDeEnvioForaneo;
  configuracion.permitirPago = permitirPago;
  configuracion.permitirCualquierPago = permitirCualquierPago;
  await configuracion
    .save()
    .then((value) => {
      res.json({ estatus: "ok", mensaje: "Configuracion actualizada" });
    })
    .catch((err) => {
      res.json({
        estatus: "error",
        mensaje: "Error al actualizar la configuracion",
      });
    });
};

const ObtenerConfiguracion = async (req, res) => {
  const configuracion = await Configuracion.findOne();
  if (configuracion) {
    res.json({ configuracion, estatus: "ok" });
  } else {
    res.json({ estatus: "error" });
  }
};

const ConfigurarPorPrimeraVez = async () => {
  const configuracion = new Configuracion({
    minimoDeEnvioLocal: 0,
    minimoDeEnvioForaneo: 0,
    permitirPago: false,
    permitirCualquierPago: false,
  });
  configuracion.save();
};

export { AjustarConfiguracion, ObtenerConfiguracion, ConfigurarPorPrimeraVez };
