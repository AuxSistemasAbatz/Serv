import { Errores } from "../modelos/errores/errores.js";

const AgregarError = async (req, res) => {
  let { parte, error } = req.body;
  const nuevoError = new Errores({
    parte: parte,
    error: {
      error: error,
    },
  });
  try {
    nuevoError
      .save()
      .then((response) => {
        res.status(200).send({ status: "ok" });
      })
      .catch((err) => {
        console.log(err);
        res.status(404);
      });
  } catch (err) {
    console.log(err);
  }
};

const RemoverError = async (req, res) => {
  let { id } = req.body;
  try {
    Errores.findOneAndDelete(id)
      .then((response) => {
        console.log(response);
        res.status(200).send({ status: "ok" });
      })
      .catch((err) => {
        console.log(err);
        res.status(400);
      });
  } catch (err) {
    console.log(err);
  }
};

const ObtenerListaDeErrores = async (req, res) => {
  try {
    Errores.find({})
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((err) => {
        console.log(err);
        res.status(400);
      });
  } catch (err) {
    console.log(err);
  }
};

export { AgregarError, RemoverError, ObtenerListaDeErrores };
