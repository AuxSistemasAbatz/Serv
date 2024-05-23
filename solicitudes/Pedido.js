import { Pedido } from "../modelos/pedidos/conexionconm.js";
import {
  ObtenerFechaFormateada,
  obtenerProductosSinLosDosDigitosSobrantes,
} from "../utilidades/utility.js";
import client from "../conexiones/ws.js";

import {
  EnviarEmailDePedido,
  EnviarEmailDeProcesoDePedido,
} from "../conexiones/emailNode.js";
import { actualizarPedidosDelCliente } from "./clientes.js";
import ObtenerListaDeProductosEnTexto from "../utilidades/utility.js";

const EnviarMensajeDeWhatsAppDePedido = async (pedido) => {
  let { id, nombre, email, telefono, direccion, total, productos } = pedido;

  if (client.info) {
    const chats = await client.getChats();
    const groups = chats
      .filter((chat) => chat.isGroup && chat.name == "PedidosPagina")
      .map((chat) => {
        return {
          id: chat.id._serialized,
          name: chat.name,
        };
      });
    let telefonoFormateado = telefono ? "Telefono: " + telefono : "";
    let cadenaDeInformacionDelCliente =
      "Pedido: " +
      id +
      "\nCliente: " +
      nombre +
      "\nCorreo: " +
      email +
      "\n" +
      telefonoFormateado +
      "\n" +
      "Dirección: " +
      direccion +
      "\n\n";
    let cadenaConEncabezado =
      "Cantidad de productos: " +
      productos.length +
      "\nTotal: $" +
      total +
      "\n\n\n" +
      ObtenerListaDeProductosEnTexto(productos);
    client.sendMessage(
      groups[0].id,
      cadenaDeInformacionDelCliente + cadenaConEncabezado
    );
  } else {
    console.log("no has iniciado sesion en whatsapp");
  }
};

const FinalizarPedido = async (req, res) => {
  let { infodeenvio, total, ahorro, id, productos, email, tipo, horario } =
    req.body;
  let { nombre, calle, numero, codigopostal, colonia, localidad, telefono } =
    infodeenvio;
  total = parseFloat(total).toFixed(2);
  let direccionCompleta =
    calle +
    " #" +
    numero +
    ", " +
    colonia +
    ", " +
    localidad +
    ", " +
    codigopostal;
  let fecha = new Date();
  let fechaFormateada = ObtenerFechaFormateada(fecha);
  let formatoDePedido = {
    id: id,
    nombre: nombre,
    telefono: telefono,
    direccion: direccionCompleta,
    total: total,
    ahorro: ahorro,
    productos: obtenerProductosSinLosDosDigitosSobrantes(productos),
    email: email,
    fecha: fechaFormateada,
    referencia: "",
    recomendacion: "",
    estado: "Por procesar",
    tipo: tipo ? tipo : "envio",
    horario: horario ? horario : "",
  };
  EnviarEmailDePedido(formatoDePedido);
  EnviarEmailDeProcesoDePedido(formatoDePedido, email);
  const pedidoNuevo = new Pedido(formatoDePedido);
  try {
    await pedidoNuevo.save();
    actualizarPedidosDelCliente(email, formatoDePedido);
    EnviarMensajeDeWhatsAppDePedido(formatoDePedido);
    res.status(200).send({ estatus: "hecho" });
  } catch (err) {
    res.status(400).send({ estatus: "error" });
  }
};

export default FinalizarPedido;
