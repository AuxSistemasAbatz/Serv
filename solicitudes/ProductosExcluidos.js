import { ProductosExcluidos } from "../modelos/ProductosExcluidos/ProductosExcluidos.js";
let listaDeProductosExcluidos = [];

const CrearProductoExcluido = async (req, res) => {
  const { item, unidad, descripcion, precio } = req.body;
  let productoExistente = false;
  await ProductosExcluidos.find({ item: item }).then((response) => {
    if (response.length > 0) {
      productoExistente = true;
    }
  });
  if (!productoExistente) {
    const nuevoProductoExcluido = new ProductosExcluidos({
      item,
      unidad,
      descripcion,
      precio,
    });
    nuevoProductoExcluido
      .save()
      .then((response) => {
        res.status(200).send({ status: "ok" });
      })
      .catch((error) => {
        console.log(error);
        res.send(error);
      });
  } else {
    res.send({ status: "ya existe" });
  }
};

const ObtenerProductosExcluidos = async (req, res) => {
  ProductosExcluidos.find({})
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.send(error);
    });
};

const EliminarProductoExcluido = async (req, res) => {
  let { item } = req.body;
  ProductosExcluidos.deleteMany({ item: item })
    .then((response) => {
      res.status(200).send({ status: "ok" });
    })
    .catch((error) => {
      res.send(error);
    });
};

const ObtenerListaDeProductosExcluidos = (req, res) => {
  ProductosExcluidos.find({}).then((response) => {
    listaDeProductosExcluidos = response;
    return listaDeProductosExcluidos;
  });
};

export {
  CrearProductoExcluido,
  ObtenerProductosExcluidos,
  EliminarProductoExcluido,
  ObtenerListaDeProductosExcluidos,
};
