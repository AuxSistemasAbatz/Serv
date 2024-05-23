import client from "../conexiones/ws.js";

const EnviarMensajeDeSolicitudDeTransferidoDeMercanciaPorWhatsApp = async (
  req,
  res
) => {
  let { productos } = req.body;

  const ObtenerListaDeProductosEnTexto = (productos) => {
    let mensaje = "*Se necesita un traspaso de la siguiente mercancía:*";
    productos.forEach((producto) => {
      let { id, descripcion, unidades, unidadSeleccionada, faltante } =
        producto;
      let descripcionActual = Array.isArray(descripcion)
        ? descripcion[unidadSeleccionada]
        : descripcion;
      let unidadActual = unidades[producto.unidadSeleccionada];
      mensaje +=
        "\n\nItem: *" +
        id +
        "*\nDescripcion: " +
        descripcionActual +
        "\nUnidad: *" +
        unidadActual +
        "*\nCantidad: *" +
        faltante +
        "*";
    });
    mensaje += "\n\nFavor de confirmar cuando se realice el traspaso.";
    return mensaje;
  };

  if (client.info) {
    const chats = await client.getChats();
    const groups = chats
      .filter((chat) => chat.isGroup && chat.name == "TransferPagina")
      .map((chat) => {
        return {
          id: chat.id._serialized,
          name: chat.name,
        };
      });
    let cadenaConEncabezado = ObtenerListaDeProductosEnTexto(productos);
    client.sendMessage(groups[0].id, cadenaConEncabezado);
    res.send({ estatus: "ok" });
  } else {
    res.send({ estatus: "notok" });
    console.log("no has iniciado sesion en whatsapp");
  }
};

export { EnviarMensajeDeSolicitudDeTransferidoDeMercanciaPorWhatsApp };
