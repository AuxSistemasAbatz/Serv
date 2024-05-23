import { ObtenerArchivoDeProductos } from "../base/ObtenerArchivos.js";
import { Carritos } from "../modelos/carritos/carritos.js";
import cjson from "compressed-json";

const CrearCarrito = async (req, res) => {
  let productos = req.body.productos;
  let carrito = new Carritos({
    productos: productos,
  });
  let token = "";
  await carrito.save().then((carrito) => {
    token = carrito._id;
  });
  res.send({ estatus: "ok", token: token });
};

const ObtenerCarritoYValidar = async (req, res) => {
  let token = req.body.token;
  try {
    let carrito = await Carritos.findOne({ _id: token });
    if (carrito) {
      let productos = carrito.productos;
      let productosAEntregar = [];
      let productosGuardados = await ObtenerArchivoDeProductos();
      let productosEnJSON = JSON.parse(productosGuardados);
      let productosDescomprimidos = cjson.decompress(productosEnJSON);
      productos.map((producto) => {
        let productoEncontrado = productosDescomprimidos.find(
          (productoActual) => {
            return productoActual.id === producto.id;
          }
        );
        if (productoEncontrado) {
          let productoCompleto = {
            ...productoEncontrado,
            ...producto,
          };
          productosAEntregar.push(productoCompleto);
        }
      });
      res.send({ productos: productosAEntregar, estatus: "ok" });
    } else {
      res.send({ estatus: "error" });
    }
  } catch (err) {
    res.send({ estatus: "error" });
  }
};

const ActualizarCarrito = async (req, res) => {
  let token = req.body.token;
  let productoAAgregar = req.body.producto;
  let carrito = await Carritos.findOne({ _id: token });
  let productoDuplicado = carrito.productos.findIndex((producto) => {
    return (
      producto.id === productoAAgregar.id &&
      producto.unidadPreseleccionada === productoAAgregar.unidadPreseleccionada
    );
  });
  if (carrito) {
    let carritoAEntregar = {
      productos: [],
    };
    if (productoDuplicado !== -1) {
      carritoAEntregar.productos = carrito.productos;
      let nuevaCantidad = carrito.productos[productoDuplicado].cantidad;
      nuevaCantidad += productoAAgregar.cantidad;
      carritoAEntregar.productos[productoDuplicado].cantidad = nuevaCantidad;
    } else {
      carritoAEntregar = {
        productos: [...carrito.productos, productoAAgregar],
      };
    }
    carrito.productos = [...carritoAEntregar.productos];
    await carrito.save();
    console.log(carrito.productos);
    let cantidad = carrito.productos.length;
    res.send({ estatus: "ok", cantidad });
  } else {
    res.send({ estatus: "error" });
  }
};

export { CrearCarrito, ObtenerCarritoYValidar, ActualizarCarrito };
