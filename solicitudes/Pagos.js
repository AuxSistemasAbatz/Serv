import api from "api";
import dotenv from "dotenv";
const sdk = api("@conekta-dev-center/v2.1.0#1ccq3nlp094on3");
sdk.auth(process.env.API_DE_CONEKTA);

dotenv.config();

const ObtenerLineasDeProductosFormateados = (productos) => {
  let productosFormateados = [];
  productos.map((producto) => {
    let cantidadFormateada = parseInt(producto.cantidad);
    let precioSeleccionado = producto.precios[producto.unidadSeleccionada];
    let precioFormateado = parseInt(parseFloat(precioSeleccionado) * 100);
    let productoFormateado = {
      name: producto.descripcion[producto.unidadSeleccionada],
      unit_price: precioFormateado,
      quantity: cantidadFormateada,
    };
    productosFormateados.push(productoFormateado);
  });
  return productosFormateados;
};

const CrearCliente = (cliente) => {
  let { nombre, email, telefono } = cliente;
  return {
    name: nombre,
    email,
    phone: telefono,
  };
};

const CrearOrdenDePagoDeConekta = (cliente, productos, res) => {
  sdk
    .createOrder(
      {
        customer_info: cliente,
        pre_authorize: false,
        currency: "MXN",
        line_items: productos,
      },
      { "accept-language": "es" }
    )
    .then(({ data }) => {
      console.log(data);
      res.send(data);
    })
    .catch((err) => {
      console.error(err);
      res.send(err);
    });
};

const CrearOrdenDePago = (req, res) => {
  let { cliente, pedido } = req.body;
  let listaDeProductosFormateados = ObtenerLineasDeProductosFormateados(
    pedido.productos
  );
  let clienteFormateado = CrearCliente(cliente);
  CrearOrdenDePagoDeConekta(
    clienteFormateado,
    listaDeProductosFormateados,
    res
  );
};

const crearCobro = (req, res) => {
  let { token, idDeOrden, total } = req.body;
  console.log(token, idDeOrden, total);
  let totalEntero = total * 100;
  sdk
    .ordersCreateCharge(
      {
        payment_method: {
          type: "card",
          token_id: token,
        },
        amount: totalEntero,
      },
      {
        id: idDeOrden,
        "accept-language": "es",
      }
    )
    .then(({ data }) => {
      res.send({ err: false, data });
    })
    .catch((err) => {
      console.log(err.data.details);
      if (err.data.type === "parameter_validation_error") {
        return res.send({
          err: true,
          mensajeDeError: "La tarjeta no es valida",
        });
      } else {
        res.send({ err: true, mensajeDeError: err.data.data.failure_code });
      }
    });
};

export { CrearOrdenDePago, crearCobro };
