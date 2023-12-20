import stripe from "stripe";
import client from "./conexiones/ws.js";
import ObtenerListaDeProductosEnTexto, {
  ActualizarTotalDeProductosDelCarrito,
  ObtenerNuevasExistenciasDeUnProducto,
  ObtenerProductosPorCategoria,
  ValidarSiExisteUnProducto,
  obtenerProductosSinLosDosDigitosSobrantes,
} from "./utilidades/utility.js";
import { ObtenerId } from "./utilidades/utility.js";
import dotenv from "dotenv";
import { Pedido } from "./modelos/pedidos/conexionconm.js";
import fs from "fs";
dotenv.config();
const ClaveStripe = process.env.CLAVE_DE_STRIPE;
const Stripe = stripe(ClaveStripe);
import QR from "qr-image";
import { qrAnterior } from "./conexiones/ws.js";
import { ObtenerLibro } from "./excel/creacionDeExcel2.js";
import { Personal } from "./modelos/usuarios/usuarios.js";
import { ObtenerArchivoDeOfertas } from "./base/ObtenerArchivos.js";
import { ObtenerArchivoDeProductos } from "./base/ObtenerArchivos.js";
import { actualizarPedidosDelCliente } from "./solicitudes/clientes.js";
import {
  EnviarEmailDeProcesoDePedido,
  EnviarEmailDePedido,
  EnviarEmailDeConfirmacionDePedido,
  EnviarEmailDeEnvioDePedido,
  EnviarEmailDeEntregaDePedido,
} from "./conexiones/email.js";
import cjson from "compressed-json";
import subirImagenACloudi from "./imagenes/imagenes.js";

const moneda = "MXN";
/*Deprecado porque es de stripe card */
const pagar = async (req, res) => {
  try {
    let { id, total } = req.body;
    let totalFormateado = parseInt(total * 100);
    const sesion = await Stripe.paymentIntents.create({
      currency: moneda,
      amount: totalFormateado,
      description: "Compra en Abattz.com",
      payment_method: id,
      confirm: true,
    });
    res.send({
      mensaje: "Hecho",
    });
  } catch (error) {
    console.log(error);
    res.send({ mensaje: error });
  }
};

/*Deprecado porque es de stripe elements */
const pagarv2 = async (req, res) => {
  try {
    let { total, productos, nombreDelCliente } = req.body;
    let totalFormateado = parseInt(total * 100);
    const sesion = await Stripe.paymentIntents.create({
      currency: moneda,
      amount: totalFormateado,
      description: "Compra en Abattz.com",
      automatic_payment_methods: {
        enabled: true,
      },
    });
    console.log(sesion.client_secret);
    res.send({
      clientSecret: sesion.client_secret,
    });
  } catch (error) {
    console.log(error);
    res.send({ mensaje: error });
  }
};
/*Deprecado porque es de stripe*/
const realizarpedido = async (req, res) => {
  let { nombre, telefono, direccion, total, id, productos, email, tipo } =
    req.body.data;

  total = parseFloat(total).toFixed(2);
  let nombreDeCliente = nombre ? nombre : " ";
  let calle = "";
  let ciudad = "";
  let codigoPostal = "";
  let estado = "";
  let referencia = "";
  let recomendacion = "";
  let tipoDePedido = "Envio";
  if (direccion) {
    calle = direccion.line1 ? direccion.line1 : "";
    ciudad = direccion.city ? direccion.city : "";
    codigoPostal = direccion.postal_code ? direccion.postal_code : "";
    estado = direccion.state ? direccion.state : "";
    referencia = direccion.referencia ? direccion.referencia : "";
    recomendacion = direccion.recomendacion ? direccion.recomendacion : "";
  }
  let direccionCompleta =
    calle + ", " + ciudad + ", " + estado + ", " + codigoPostal;
  let telefonoOpcional = telefono ? telefono : " ";
  let fecha = new Date();
  let numeroDeDia =
    fecha.getDate() < 10 ? "0" + fecha.getDate() : fecha.getDate();
  let numeroDelMes =
    fecha.getMonth() < 10 ? "0" + fecha.getMonth() : fecha.getMonth();
  let fechaFormateada =
    numeroDeDia.toString() +
    "/" +
    numeroDelMes.toString() +
    "/" +
    fecha.getFullYear().toString();
  let formatoDePedido = {
    id: id,
    nombre: nombreDeCliente,
    telefono: telefonoOpcional,
    direccion: direccionCompleta,
    ahorro: "0",
    total: total,
    productos: obtenerProductosSinLosDosDigitosSobrantes(productos),
    email: email,
    fecha: fechaFormateada,
    referencia: referencia,
    recomendacion: recomendacion,
    estado: "Por procesar",
    tipo: tipo ? tipo : tipoDePedido,
  };
  EnviarEmailDePedido(formatoDePedido);
  EnviarEmailDeProcesoDePedido(formatoDePedido, email);
  const pedidoNuevo = new Pedido(formatoDePedido);
  try {
    await pedidoNuevo.save();
    actualizarPedidosDelCliente(email, formatoDePedido);
  } catch (err) {
    console.error(err);
  }
  if (client.info) {
    const chats = await client.getChats();
    const groups = chats
      .filter((chat) => chat.isGroup && chat.name == "Pedidos beta")
      .map((chat) => {
        return {
          id: chat.id._serialized,
          name: chat.name,
        };
      });
    let cadenaDeInformacionDelCliente = `Pedido: ${id}\nCliente: ${nombre}\nCorreo: ${email}\n${
      telefono ? "Telefono: " + telefono + "\n" : ""
    }Dirección: ${direccionCompleta}\n\n`;
    let cadenaConEncabezado =
      `Cantidad de productos: ${productos.length}\nTotal: $${total}\n\n\n` +
      ObtenerListaDeProductosEnTexto(productos);
    client.sendMessage(
      groups[0].id,
      cadenaDeInformacionDelCliente + cadenaConEncabezado
    );
  } else {
    console.log("no has iniciado sesion");
  }
  res.status(200).send({ estatus: "hecho" });
};

const pedirId = (req, res) => {
  let { productos, total } = req.body;
  let idObtenido = ObtenerId(productos, total);
  res.send({ id: idObtenido });
};

const obtenerPedidos = async (req, res) => {
  try {
    const data = await Pedido.find({});
    if (!data) {
      res.send("No encontrado").status(404);
    } else {
      res.json(data).status(200);
    }
  } catch (err) {
    console.log(err);
  }
};

const obtenerPedidoPorId = async (req, res) => {
  let id = req.body.id;
  try {
    const pedido = await Pedido.findOne({ id: id });
    if (!pedido) {
      res.send("No encontrado").status(404);
    } else {
      res.send(pedido).status(200);
    }
  } catch (err) {
    console.log(err);
  }
};

const obtenerQR = (req, res) => {
  const qrImage = QR.imageSync(qrAnterior, { type: "svg" });
  console.log(qrAnterior);
  res.send(qrImage);
};

const hacerPing = (req, res) => {
  res.send("ok").status(200);
};

const obtenerExcelDePedido = async (req, res) => {
  let id = req.body.id;
  try {
    const pedido = await Pedido.findOne({ id: id });
    if (!pedido) {
      res.send("No encontrado").status(404);
    } else {
      ObtenerLibro(pedido.productos, res, pedido.nombre);
    }
  } catch (err) {
    console.log(err);
  }
};

const validarUsuarioPorNombreYContr = async (req, res) => {
  let { nombre, contrasena } = req.body;
  try {
    const personal = await Personal.find({
      usuario: nombre,
      contrasena: contrasena,
    });
    if (!personal) {
      res.status(404).send("No encontramos ni maiz de ese usuario");
    } else {
      if (personal.length === 0) {
        console.log("Intento de sesión: " + nombre);
        res.status(404).send("No encontramos ni maiz de ese usuario");
      }
      console.log("Sesion iniciada: " + nombre);
      res.status(200).send({ estatus: "ok", rol: "" + personal[0].rol });
    }
  } catch (err) {
    console.log(err);
  }
};

const subidoDeImagen = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No se mando ninguna imagen" });
  } else {
    let tempPath = req.file.path;
    let targetPath = "imagenes/" + req.file.originalname;
    fs.rename(tempPath, targetPath, (error) => {
      if (error) {
        res.status(500).json({ error: "No se pudo guardar la imagen" });
      } else {
        subirImagenACloudi(targetPath, res);
      }
    });
  }
};

const obtenidoDeImagen = (req, res) => {
  let { id } = req.params;
  fs.readFile("./imagenes/" + id, (err, data) => {
    if (err) {
      res.status(404).json({ status: "no encontrado" });
    } else {
      res.setHeader("Content-Type", "image/jpeg");
      res.status(200).send(data);
    }
  });
};

const obtenerOfertasDeArchivo = async (req, res) => {
  let ofertas = await ObtenerArchivoDeOfertas();
  res.status(200).send(ofertas);
};

const obtenerProductosDeArchivo = async (req, res) => {
  let productos = await ObtenerArchivoDeProductos();
  res.status(200).send(productos);
};

const obtenerInfoDeProducto = async (req, res) => {
  let { id } = req.params;
  let productos = ObtenerArchivoDeProductos();
  let productosEnJson = JSON.parse(productos);
  let productosDescomprimidos = cjson.decompress(productosEnJson);
  if (Array.isArray(productosDescomprimidos)) {
    let productosEncontrados = [];
    productosDescomprimidos.map((prod) => {
      if (prod.id === id) {
        productosEncontrados.push(prod);
      }
    });
    res.send({ productosEncontrados });
  } else {
    res.status(400);
  }
};

const obtenerListaDeProductosRealacionados = async (req, res) => {
  let { categoria } = req.params;
  categoria = categoria.replace("%20", "").replace(" ", "");
  const productos = JSON.parse(await ObtenerArchivoDeProductos());
  const productosDescomprimidos = cjson.decompress(productos);
  const productosPorCategoria = productosDescomprimidos.filter((producto) => {
    let claseDeProducto = producto.clase.replace(" ", "");
    return claseDeProducto === categoria;
  });
  let productosAleatoriosDeCategoria = ObtenerProductosPorCategoria(
    productosPorCategoria
  );
  res.json({ estatus: "ok", productos: productosAleatoriosDeCategoria });
};

const ValidarLosProductosDelCarrito = async (req, res) => {
  let { carrito } = req.body;
  let nuevoCarrito = { ...carrito };
  nuevoCarrito.productos = [];
  const productos = JSON.parse(await ObtenerArchivoDeProductos());
  const productosDescomprimidos = cjson.decompress(productos);
  carrito.productos.map((producto) => {
    let nuevasExistencias = ObtenerNuevasExistenciasDeUnProducto(
      productosDescomprimidos,
      producto
    );
    let productoValidado = { ...producto };
    productoValidado.inventario = nuevasExistencias;
    nuevoCarrito.productos.push(productoValidado);
  });
  let carritoActualizadoFinal = ActualizarTotalDeProductosDelCarrito(
    nuevoCarrito.productos,
    nuevoCarrito.id,
    false,
    nuevoCarrito.tipo
  );
  res.send(carritoActualizadoFinal);
};

const GestionarEstatusDePedido = async (req, res) => {
  let { idDePedido, email, nuevoEstado, total } = req.body;
  console.log(idDePedido, email, nuevoEstado);
  try {
    Pedido.findOneAndUpdate(
      { id: idDePedido, email: email },
      { estado: nuevoEstado }
    )
      .then((response) => {
        if (response) {
          if (nuevoEstado === "Procesado") {
            EnviarEmailDeConfirmacionDePedido(res, total, idDePedido, email);
          } else if (nuevoEstado === "Enviado") {
            EnviarEmailDeEnvioDePedido(res, idDePedido, email);
          } else if (nuevoEstado === "Entregado") {
            EnviarEmailDeEntregaDePedido(res, idDePedido, email);
          }
        } else {
          res.status(404).send({ estatus: "error" });
        }
      })
      .catch((err) => {
        res.status(404).send({ estatus: "error" });
      });
  } catch (err) {
    res.status(404).send({ estatus: "error" });
  }
};

export {
  pedirId,
  realizarpedido,
  pagarv2,
  pagar,
  obtenerPedidos,
  obtenerPedidoPorId,
  obtenerQR,
  hacerPing,
  obtenerExcelDePedido,
  validarUsuarioPorNombreYContr,
  subidoDeImagen,
  obtenidoDeImagen,
  obtenerOfertasDeArchivo,
  obtenerProductosDeArchivo,
  obtenerInfoDeProducto,
  obtenerListaDeProductosRealacionados,
  ValidarLosProductosDelCarrito,
  GestionarEstatusDePedido,
};
