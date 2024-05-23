import { CrearLibroDeProductosSinImagen } from "../excel/CreacionDeExcelDeProductosSinImagen.js";
import { Productos } from "../modelos/productosSinImagen/Productos.js";

const agregarProductoSinImagen = async (req, res) => {
  let { item, descripcion } = req.body;
  let itemActual = item.toString();
  let descripcionActual = Array.isArray(descripcion)
    ? descripcion[0]
    : descripcion;
  try {
    const productosEncontrados = await Productos.find({
      item: item,
    });
    if (productosEncontrados.length === 0) {
      try {
        const ProductoSinImagen = new Productos({
          item: itemActual,
          descripcion: descripcionActual,
        });
        ProductoSinImagen.save()
          .then(() => {
            res.status(200).json({ status: "ok" });
          })
          .catch((err) =>
            res.status(404).json({ status: "No se pudo guardar", err: err })
          );
      } catch (err) {
        console.log(err);
      }
    } else {
      res.status(200).json({ status: "ok" });
    }
  } catch (err) {
    console.log(err);
  }
};

const obtenerProductosSinImagen = async (req, res) => {
  try {
    const data = await Productos.find({});
    if (!data) {
      res.status(404).json({ status: "No se encontraron" });
    } else {
      res.status(200).json(data);
    }
  } catch (err) {
    console.log(err);
  }
};

const eliminarProductoSinImagen = async (req, res) => {
  let { id } = req.body;
  try {
    await Productos.findOneAndDelete({ id: id })
      .then((response) => {
        res.status(200).send({ status: "ok" });
      })
      .catch((err) => console.log(err));
  } catch (err) {
    console.log(err);
  }
};

const EliminarVariosProductosSinImagen = async (req, res) => {
  let { id } = req.body;
  try {
    await Productos.deleteMany({ item: id })
      .then((response) => {
        console.log(response);
        res.status(200).send({ status: "ok" });
      })
      .catch((err) => {
        console.log(err);
        res.status(404).send({ status: "error" });
      });
  } catch (err) {}
};

const AgregarProductosSinImagenNuevo = async (req, res) => {
  let { item, descripcion } = req.body;
  let itemActual = item.toString();
  let descripcionActual = Array.isArray(descripcion)
    ? descripcion[0]
    : descripcion;
  try {
    Productos.find({ item: item }).then((response) => {
      if (response.length < 1) {
        try {
          try {
            const ProductoSinImagen = new Productos({
              item: itemActual,
              descripcion: descripcionActual,
            });
            ProductoSinImagen.save()
              .then(() => {
                res.status(200).json({ status: "ok" });
              })
              .catch((err) =>
                res.status(404).json({ status: "No se pudo guardar", err: err })
              );
          } catch (err) {
            console.log(err);
            res.status(404).json({ status: "No se pudo guardar", err: err });
          }
        } catch (err) {
          res.status(200).json({ status: "ok", error: "No se pudo guardar" });
        }
      } else {
        res
          .status(200)
          .json({ status: "ok", error: "Se encontro y por eso no se guardo" });
      }
    });
  } catch (err) {
    res.status(404).json({ status: "No se pudo guardar", err: err });
  }
};

const CrearExcelDeProductosSinImagen = async (req, res) => {
  try {
    const data = await Productos.find({});
    if (!data) {
      res.status(404).json({ status: "No se encontraron" });
    } else {
      CrearLibroDeProductosSinImagen(data, res);
    }
  } catch (err) {
    console.log(err);
  }
};

export {
  agregarProductoSinImagen,
  obtenerProductosSinImagen,
  eliminarProductoSinImagen,
  EliminarVariosProductosSinImagen,
  AgregarProductosSinImagenNuevo,
  CrearExcelDeProductosSinImagen,
};
