import emailjs from "@emailjs/nodejs";
import ObtenerListaDeProductosEnTexto from "../utilidades/utility.js";

const EnviarEmail = async (tipodecliente, nombre, email, telefono, mensaje) => {
  let mensajeCompleto =
    "Un cliente llamado " +
    nombre +
    " con email " +
    email +
    " y telefono " +
    telefono +
    " escribio el siguiente mensaje: " +
    mensaje;
  let template_params = {
    para: "sistemasabarrotera@gmail.com",
    titulo: nombre,
    mensaje: mensajeCompleto,
  };

  emailjs
    .send(
      process.env.API_EMAILJS_USER_ID,
      process.env.API_EMAILJS_TEMPLATE_ID,
      template_params,
      {
        publicKey: process.env.API_EMAILJS_PUBLIC_KEY,
        privateKey: process.env.API_EMAILJS_PRIVATE_KEY,
      }
    )
    .then(
      (response) => {
        console.log("Hecho", response.status);
      },
      (error) => console.log(error)
    );
};

const EnviarEmailDePedido = async (pedido) => {
  let { nombre, productos, email, telefono, total, fecha } = pedido;
  let listaDeProductos = ObtenerListaDeProductosEnTexto(productos);

  let template_params = {
    nombre,
    productos,
    email,
    telefono,
    total,
    fecha,
    listadeproductos: listaDeProductos,
  };
  emailjs
    .send(
      process.env.API_EMAILJS_USER_ID,
      process.env.API_EMAILJS_TEMPLATE_ID2,
      template_params,
      {
        publicKey: process.env.API_EMAILJS_PUBLIC_KEY,
        privateKey: process.env.API_EMAILJS_PRIVATE_KEY,
      }
    )
    .then((response) => {
      console.log("Mensaje enviado", response.status);
    })
    .catch((error) => console.log(error));
};
const EnviarEmailDeContra = async (correo, id) => {
  let mensaje =
    "Si desea cambiar su contraseña puede dar click al siguiente enlace: https://www.abatz.com.mx/recuperar/" +
    id +
    "\n Si no solicitaste tu cambio entonces puedes ignorar este correo";

  let template_params = {
    para: correo,
    titulo: "Cambiar contraseña",
    mensaje: mensaje,
  };

  emailjs
    .send(
      process.env.API_EMAILJS_USER_ID,
      process.env.API_EMAILJS_TEMPLATE_ID,
      template_params,
      {
        publicKey: process.env.API_EMAILJS_PUBLIC_KEY,
        privateKey: process.env.API_EMAILJS_PRIVATE_KEY,
      }
    )
    .then(
      (response) => {
        console.log("Hecho", response.status);
      },
      (error) => console.log(error)
    );
};

const EnviarEmailDeCambioDeContra = async (correo) => {
  let mensaje =
    "Este mensaje es para notificar su cambio de contraseña.\nSu contraseña se ha cambiado exitosamente.";
  let template_params = {
    para: correo,
    titulo: "Contraseña cambiada",
    mensaje: mensaje,
  };
  emailjs
    .send(
      process.env.API_EMAILJS_USER_ID,
      process.env.API_EMAILJS_TEMPLATE_ID,
      template_params,
      {
        publicKey: process.env.API_EMAILJS_PUBLIC_KEY,
        privateKey: process.env.API_EMAILJS_PRIVATE_KEY,
      }
    )
    .then(
      (response) => {
        console.log("Hecho", response.status);
      },
      (error) => console.log(error)
    );
};

const EnviarEmailDeProcesoDePedido = async (pedido, correo) => {
  let mensaje =
    "Realizaste un pedido en Abarrotera de Patzcuaro. Ahora mismo estamos procesando tu pedido y verificando tu pago por el total dé $" +
    pedido.total +
    ". En cuanto finalicemos este proceso te confirmaremos y te avisaremos cuando tu pedido este por enviarse.\n\nPara alguna duda o aclaración por favor contactanos a través del correo: \npaginawebabatz@gmail.com\no a través del número de teléfono:\n 434 342 26 48";

  let template_params = {
    para: correo,
    titulo: "Realizaste un pedido en ABATZ",
    mensaje: mensaje,
  };

  emailjs
    .send(
      process.env.API_EMAILJS_USER_ID,
      process.env.API_EMAILJS_TEMPLATE_ID,
      template_params,
      {
        publicKey: process.env.API_EMAILJS_PUBLIC_KEY,
        privateKey: process.env.API_EMAILJS_PRIVATE_KEY,
      }
    )
    .then(
      (response) => {
        console.log("Hecho", response.status);
      },
      (error) => console.log(error)
    );
};

const EnviarEmailDeConfirmacionDePedido = async (res, total, id, correo) => {
  let mensaje =
    "Confirmamos tu pago de $" +
    total +
    " y tu pedido con ID:" +
    id +
    " sera enviado dentro de poco. \n\nPuedes revisar sobre la mercancía y el estatus de tu pedido al iniciar sesion en https://www.abatz.com.mx/sesion en la seccion de pedidos.\n\nRecuerda que te haremos llegar otro correo cuando tus productos esten por enviarse.";
  let template_params = {
    para: correo,
    titulo: "Confirmación de tu pedido en ABATZ",
    mensaje: mensaje,
  };

  emailjs
    .send(
      process.env.API_EMAILJS_USER_ID,
      process.env.API_EMAILJS_TEMPLATE_ID,
      template_params,
      {
        publicKey: process.env.API_EMAILJS_PUBLIC_KEY,
        privateKey: process.env.API_EMAILJS_PRIVATE_KEY,
      }
    )
    .then(
      (response) => {
        res.status(200).send({ estatus: "ok" });
      },
      (error) => {
        res.status(400).send({ estatus: "error" });
      }
    );
};

const EnviarEmailDeEnvioDePedido = async (res, id, correo) => {
  let mensaje =
    "¡Tu pedido en ABATZ esta en camino! " +
    "\n\n" +
    "En el transcurso del día llegará un repartidor con tus productos del pedido de ID: " +
    id;
  let template_params = {
    para: correo,
    titulo: "Pronto llegara tu pedido",
    mensaje: mensaje,
  };

  emailjs
    .send(
      process.env.API_EMAILJS_USER_ID,
      process.env.API_EMAILJS_TEMPLATE_ID,
      template_params,
      {
        publicKey: process.env.API_EMAILJS_PUBLIC_KEY,
        privateKey: process.env.API_EMAILJS_PRIVATE_KEY,
      }
    )
    .then(
      (response) => {
        res.status(200).send({ estatus: "ok" });
      },
      (error) => {
        res.status(400).send({ estatus: "error" });
      }
    );
};

const EnviarEmailDeEntregaDePedido = async (res, id, correo) => {
  let mensaje =
    "Tu pedido ha sido entregado" +
    "\n\n" +
    "Tus productos del pedido con ID: " +
    id +
    " han sido entregados. Te esperamos de nuevo en https://www.abatz.com.mx .+" +
    "\n\n" +
    "Que tengas un excelente día." +
    id;
  let template_params = {
    para: correo,
    titulo: "Pedido entregado",
    mensaje: mensaje,
  };

  emailjs
    .send(
      process.env.API_EMAILJS_USER_ID,
      process.env.API_EMAILJS_TEMPLATE_ID,
      template_params,
      {
        publicKey: process.env.API_EMAILJS_PUBLIC_KEY,
        privateKey: process.env.API_EMAILJS_PRIVATE_KEY,
      }
    )
    .then(
      (response) => {
        res.status(200).send({ estatus: "ok" });
      },
      (error) => {
        res.status(400).send({ estatus: "error" });
      }
    );
};

export default EnviarEmail;
export {
  EnviarEmailDePedido,
  EnviarEmailDeContra,
  EnviarEmailDeCambioDeContra,
  EnviarEmailDeProcesoDePedido,
  EnviarEmailDeConfirmacionDePedido,
  EnviarEmailDeEnvioDePedido,
  EnviarEmailDeEntregaDePedido,
};
