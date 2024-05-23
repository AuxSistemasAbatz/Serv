import { Visita } from "../modelos/analiticas/visitas.js";

const ObtenerVisitas = async (req, res) => {
  try {
    const visitas = await Visita.find();
    res.json(visitas);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

const ObtenerVisitasDeParteEspecifica = async (req, res) => {
  try {
    const { parte } = req.params;
    const visitas = await Visita.find({ [parte]: { $exists: true } });
    res.json(visitas);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

const AplicarVisita = async (req, res) => {
  try {
    const { parte } = req.body;
    let fecha = new Date().toISOString().split("T")[0];
    const visita = await Visita.findOne({ [parte]: { $exists: true } });
    visita[parte].numVisitas += 1;
    visita[parte].fechaUltimaVisita = fecha;
    await visita.save();
    res.status(200).json({ estatus: "ok" });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

const InicializarVisita = async (req, res) => {
  try {
    const { parte } = req.params;
    const visita = new Visita({
      [parte]: {
        numVisitas: 1,
        fechaUltimaVisita: new Date().toISOString(),
      },
    });
    await visita.save();
    res.json(visita);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

const InicializarTodasLasVisitas = async (req, res) => {
  try {
    const visitas = new Visita({
      inicio: {
        numVisitas: 0,
        fechaUltimaVisita: "",
      },
      productos: {
        numVisitas: 0,
        fechaUltimaVisita: "",
      },
      nosotros: {
        numVisitas: 0,
        fechaUltimaVisita: "",
      },
      sucursales: {
        numVisitas: 0,
        fechaUltimaVisita: "",
      },
      rutas: {
        numVisitas: 0,
        fechaUltimaVisita: "",
      },
      contacto: {
        numVisitas: 0,
        fechaUltimaVisita: "",
      },
      bolsadetrabajo: {
        numVisitas: 0,
        fechaUltimaVisita: "",
      },
      sesion: {
        numVisitas: 0,
        fechaUltimaVisita: "",
      },
      perfil: {
        numVisitas: 0,
        fechaUltimaVisita: "",
      },
      registro: {
        numVisitas: 0,
        fechaUltimaVisita: "",
      },
      pago: {
        numVisitas: 0,
        fechaUltimaVisita: "",
      },
    });
    await visitas.save();
    res.json(visitas);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

export {
  ObtenerVisitas,
  ObtenerVisitasDeParteEspecifica,
  AplicarVisita,
  InicializarVisita,
  InicializarTodasLasVisitas,
};
