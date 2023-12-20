import { Vacante } from "../modelos/vacantes/vacantes.js";

const crearNuevaVacante = async (req, res) => {
  let { id, img, titulo, rol, horario, recomendacion } = req.body;
  const nuevaVacante = new Vacante({
    id: id,
    img: img,
    titulo: titulo,
    rol: rol,
    horarios: horario,
    recomendacion: recomendacion,
  });
  try {
    nuevaVacante.save().then(() => {
      console.log("Vacante guardada");
      res.status(200).send({ status: "ok" });
    });
  } catch (err) {
    res.status(400).send({ status: "nook" });
    console.log(err);
  }
};
const modificarVacante = async (req, res) => {
  let { id, img, titulo, rol, horario, recomendacion } = req.body;
  try {
    await Vacante.findOneAndUpdate(
      {
        id: id,
      },
      {
        id: id,
        img: img,
        titulo: titulo,
        rol: rol,
        horarios: horario,
        recomendacion: recomendacion,
      }
    )
      .then(() => {
        console.log("Vacante modificada");
        res.status(202).send({ status: "ok" });
      })
      .catch((err) => {
        console.log(err);
        res.status(404).send({ status: "No encontrado" });
      });
  } catch (err) {
    console.log(err);
  }
};

const eliminarVacante = async (req, res) => {
  let { id } = req.body;
  try {
    await Vacante.findOneAndDelete({ id: id })
      .then((response) => {
        console.log("Vacante eliminada");
        res.status(200).send({ status: "ok" });
      })
      .catch((err) => res.status(404).send({ status: "error" }));
  } catch (err) {
    console.log(err);
  }
};
const obternerTodasLasVacantes = async (req, res) => {
  try {
    const listaDeVacantes = await Vacante.find({});
    res.status(200).send(listaDeVacantes);
  } catch (err) {
    console.log(err);
    res.status(400).send("No funciona");
  }
};

export {
  eliminarVacante,
  obternerTodasLasVacantes,
  modificarVacante,
  crearNuevaVacante,
};
