import nodemailer from "nodemailer";
import dotenv from "dotenv";
import client from "./ws.js";
import ObtenerListaDeProductosEnTexto from "../utilidades/utility.js";
dotenv.config();

const ObtenerPlantillaConMensajePersonalizado = (titulo, mensaje, estado) => {
  let mensajeFinal = mensaje.replaceAll("\n", "<br />");
  if (estado) {
    let pasos = ["Procesado", "Confirmado", "Enviado", "Entregado"];
    let index = pasos.indexOf(estado);
    if (false) {
      return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>${titulo}</title>
    <style type="text/css">
    body{
      margin: 0;
      background-color: #000000;
      color: #ffffff;
      font-family: Verdana 'sans-serif';

    }
    h2{
      margin: 0;
      font-size: 26px;
    }
    .ImagenYEncabezado{
      background-color: #d63d3d;
      display: flex;
      padding: 20px;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      gap: 10px;
    }
    .ContenedorDeMensaje{
      display: grid;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .ContenedorDeInfo{
      background-color: #111111;
      padding: 40px;
      border-radius: 5px;
      min-width: 200px;
      display: grid;
      justify-content: center;
      align-items: center;
      text-aling: center;
      }
    p, h2{
      text-align: center;
    }
    .Mensaje{
      font-size: 18px;
    }
    .DatosDeContactoEspecificos{
      display: inline;
      color: #d63d3d;
      text-decoration: none;
      font-weight: 600;
    }
    .PasoDePedido:nth-child(1){
      font-weight: 600;
    }
    .PasoSeleccionado{
      background-color: #ffae1a;
    }
    .PasoDePedido:nth-child(4){
      border-radius: 0 5px 5px 0;
    }
    .PasoDePedido{
      margin: 0;
      text-align: center;
      padding: 5px 0;
      font-size: 14px;
    }
    .ListaDePasosDePedido{
      width: 100%;
    }
    .EstadoDelPedido{
      text-align: center;
    }
    </style>
  </head>
  <body>
    <header class="ImagenYEncabezado">
      <img src="https://www.abattz.com/assets/Icono-83f7dd00.png" width="100px" />
      <h2>ABARROTERA DE PÁTZCUARO</h2>
    </header>
    <div class="ContenedorDeMensaje">
      <div class="ContenedorDeInfo">
        <h2>${titulo}</h2>
        <p class="Mensaje">${mensajeFinal}</p>
        <div>
        <p class="DatosDeContacto">Si tienes dudas sobre tu pedido puedes contactarnos a través de <a href="mailto:facturaciondeabatz@hotmail.com" class="DatosDeContactoEspecificos">facturaciondeabatz@gmail.com</a> o al numero: <a href="tel:+524343422648"  class="DatosDeContactoEspecificos">434 342 26 48.</a></p>
        <section>
          <h3 class="EstadoDelPedido">Estado de tu pedido:</h3>
          <table class="ListaDePasosDePedido" cellspacing="0" cellpadding="0">
            <tr>
            <th class="PasoDePedido ${
              pasos.indexOf("Procesado") <= index ? "PasoSeleccionado" : ""
            }">Procesado</th>
            <th class="PasoDePedido ${
              pasos.indexOf("Confirmado") <= index ? "PasoSeleccionado" : ""
            }">Confirmado</th>
            <th class="PasoDePedido ${
              pasos.indexOf("Enviado") <= index ? "PasoSeleccionado" : ""
            }">Enviado</th>
            <th class="PasoDePedido ${
              pasos.indexOf("Entregado") <= index ? "PasoSeleccionado" : ""
            }">Entregado</th>
            </tr>
          </table>
        </section>
        <p>Somos Abarrotera de Pátzcuaro donde tus ganancias llegan rápido.</p>
        </div>
      </div>
    </div>
  </body>
</html>`;
    }
  }
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>${titulo}</title>
    <style type="text/css">
    body{
      margin: 0;
      background-color: #000000;
      color: #ffffff;
      font-family: Verdana 'sans-serif';

    }
    h2{
      margin: 0;
      font-size: 26px;
    }
    .ImagenYEncabezado{
      background-color: #d63d3d;
      display: flex;
      padding: 20px;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      gap: 10px;
    }
    .ContenedorDeMensaje{
      display: grid;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .ContenedorDeInfo{
      background-color: #111111;
      padding: 40px;
      border-radius: 5px;
      min-width: 200px;
      display: grid;
      justify-content: center;
      align-items: center;
      text-aling: center;
      }
    p, h2{
      text-align: center;
    }
    .Mensaje{
      font-size: 18px;
    }
    .DatosDeContactoEspecificos{
      display: inline;
      color: #d63d3d;
      text-decoration: none;
      font-weight: 600;
    }
    </style>
  </head>
  <body>
    <header class="ImagenYEncabezado">
      <img src="https://www.abattz.com/assets/Icono-83f7dd00.png" width="100px" />
      <h2>ABARROTERA DE PÁTZCUARO</h2>
    </header>
    <div class="ContenedorDeMensaje">
      <div class="ContenedorDeInfo">
        <h2>${titulo}</h2>
        <p class="Mensaje">${mensajeFinal}</p>
        <div>
        <p class="DatosDeContacto">Si tienes dudas sobre tu pedido puedes contactarnos a través de <a href="mailto:facturaciondeabatz@hotmail.com" class="DatosDeContactoEspecificos">facturaciondeabatz@gmail.com</a> o al numero: <a href="tel:+524343422648"  class="DatosDeContactoEspecificos">434 342 26 48.</a></p>
        <p>Somos Abarrotera de Pátzcuaro donde tus ganancias llegan rápido.</p>
        </div>
      </div>
    </div>
  </body>
</html>`;
};

const Transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.USUARIO_DE_NODEMAILER,
    pass: process.env.CONTRASENA_DE_NODEMAILER,
    clientId: process.env.ID_DE_NODEMAILER,
    clientSecret: process.env.CLIENTE_SECRET_DE_NODEMAILER,
    refreshToken: process.env.TOKEN_REFRESCADO_DE_NODEMAILER,
  },
});

let formatoDeInfoDeEmails = {
  from: process.env.USUARIO_DE_NODEMAILER,
};

Transporter.verify((error, success) => {
  if (error) {
    console.log("emails", error);
  } else {
    console.log("Servicio de emails activado");
  }
});

const EnviarUnEmail = (mailOptions) => {
  try {
    Transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Email enviado");
      }
    });
  } catch (err) {
    console.log(err);
  }
};

const EnviarUnEmailConRespuesta = (mailOptions, res) => {
  let mailOptionsConPlantilla = {
    ...mailOptions,
    text: "",
    html: ObtenerPlantillaConMensajePersonalizado(
      mailOptions.subject,
      mailOptions.text,
      mailOptions.estado
    ),
  };
  try {
    Transporter.sendMail(mailOptionsConPlantilla, (err, data) => {
      if (err) {
        console.log(err);
        res.status(400).send({ estatus: "error" });
      } else {
        console.log("Email enviado");
        res.status(200).send({ estatus: "ok" });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({ estatus: "error" });
  }
};

const EnviarMensajeALogistica = async (mensaje) => {
  if (client.info) {
    const chats = await client.getChats();
    const groups = chats
      .filter((chat) => chat.isGroup && chat.name == "LogisticaPagina")
      .map((chat) => {
        return {
          id: chat.id._serialized,
          name: chat.name,
        };
      });
    client.sendMessage(groups[0].id, mensaje);
  } else {
    console.log("No has iniciado sesion en whatsapp");
  }
};

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
  let mailOptions = {
    ...formatoDeInfoDeEmails,
    to: email,
    subject: nombre,
    text: mensajeCompleto,
  };
  EnviarUnEmail(mailOptions);
};

const EnviarEmailDePedido = async (pedido) => {
  let { nombre, productos, email, telefono, total, fecha } = pedido;
  let listaDeProductos = ObtenerListaDeProductosEnTexto(productos);

  let mensaje =
    "Fecha: " +
    fecha +
    "\nTienes un nuevo pedido de " +
    nombre +
    "\nDatos del cliente:\nNombre: " +
    nombre +
    "\nEmail: " +
    email +
    "\nTeléfono: " +
    telefono +
    "\n\nDatos del pedido: Total: " +
    total +
    "\nProductos:" +
    listaDeProductos;

  let mailOptions = {
    ...formatoDeInfoDeEmails,
    to: "paginawebabatz@gmail.com",
    subject: "Nuevo pedido",
    text: mensaje,
  };
  EnviarUnEmail(mailOptions);
};

const EnviarEmailDeContra = async (correo, id) => {
  console.log(correo);
  let mensaje =
    "Si desea cambiar su contraseña puede dar click al siguiente enlace: https://www.abatz.com.mx/recuperar/" +
    id +
    "\n Si no solicitaste tu cambio entonces puedes ignorar este correo.";

  let mailOptions = {
    ...formatoDeInfoDeEmails,
    to: correo,
    subject: "Cambiar contraseña",
    text: mensaje,
  };
  EnviarUnEmail(mailOptions);
};

const EnviarEmailDeCambioDeContra = async (correo) => {
  let mensaje =
    "Este mensaje es para notificar su cambio de contraseña.\nSu contraseña se ha cambiado exitosamente.";

  let mailOptions = {
    ...formatoDeInfoDeEmails,
    to: correo,
    subject: "Contraseña cambiada",
    text: mensaje,
  };
  EnviarUnEmail(mailOptions);
};

const EnviarEmailDeProcesoDePedido = async (pedido, correo) => {
  let mensaje =
    "Realizaste un pedido en Abarrotera de Patzcuaro. Ahora mismo estamos procesando tu pedido y verificando tu pago por el total dé $" +
    pedido.total +
    ".\n\n En cuanto finalicemos este proceso te confirmaremos y te avisaremos cuando tu pedido este por enviarse.\n\nPara alguna duda o aclaración por favor contactanos a través del correo: \npaginawebabatz@gmail.com\no a través del número de teléfono:\n 434 342 26 48";

  let mailOptions = {
    ...formatoDeInfoDeEmails,
    to: correo,
    subject: "Realizaste un pedido en ABATZ",
    text: mensaje,
  };
  EnviarUnEmail(mailOptions);

  let mensajeDeProceso =
    "Hay un nuevo pedido con ID: " +
    pedido.id +
    " con el total de $" +
    pedido.total;
  mailOptions = {
    ...formatoDeInfoDeEmails,
    to: "facturaciondeabatz@gmail.com",
    subject: "Nuevo pedido en ABATZ",
    text: mensajeDeProceso,
  };
  EnviarUnEmail(mailOptions);
};

const EnviarEmailDeConfirmacionDePedido = async (res, total, id, correo) => {
  let mensaje =
    "Confirmamos tu pago de $" +
    total +
    " y tu pedido con ID:" +
    id +
    " sera enviado dentro de poco. \n\nPuedes revisar sobre la mercancía y el estatus de tu pedido al iniciar sesion en https://www.abatz.com.mx/sesion en la seccion de pedidos.\n\nRecuerda que te haremos llegar otro correo cuando tus productos esten por enviarse.";

  let mailOptions = {
    ...formatoDeInfoDeEmails,
    to: correo,
    subject: "Confirmación de tu pedido en ABATZ",
    text: mensaje,
  };
  EnviarUnEmail(mailOptions);

  let mensajeDeOperacion =
    "Hay un nuevo pedido procesado.El total del pedido es: " +
    total +
    " El ID es: " +
    id;
  mailOptions = {
    ...formatoDeInfoDeEmails,
    to: "logisticaenviosabatz@gmail.com",
    titulo: "Nuevo pedido en ABATZ con ID" + id,
    text: mensajeDeOperacion,
    estado: "Confirmado",
  };
  EnviarUnEmailConRespuesta(mailOptions, res);
};

const EnviarEmailDeEnvioDePedido = async (res, id, correo) => {
  let mensaje =
    "¡Tu pedido en ABATZ esta en camino! " +
    "\n\n" +
    "En el transcurso del día llegará un repartidor con tus productos del pedido de ID: " +
    id +
    ".";

  let mailOptions = {
    ...formatoDeInfoDeEmails,
    to: correo,
    subject: "Pronto llegara tu pedido",
    text: mensaje,
    estado: "Enviado",
  };

  EnviarUnEmailConRespuesta(mailOptions, res);
};

const EnviarEmailDeEntregaDePedido = async (res, id, correo) => {
  let mensaje =
    "Tu pedido ha sido entregado" +
    "\n\n" +
    "Tus productos del pedido con ID: " +
    id +
    " han sido entregados. Te esperamos de nuevo en https://www.abatz.com.mx ." +
    "\n\n" +
    "Que tengas un excelente día.";

  let mailOptions = {
    ...formatoDeInfoDeEmails,
    to: correo,
    subject: "Pedido entregado",
    text: mensaje,
    estado: "Entregado",
  };
  EnviarUnEmailConRespuesta(mailOptions, res);
};

const EnviarEmailDeRestablecimientoDePedido = async (
  res,
  id,
  correo,
  razon
) => {
  let mensaje =
    "Tu pedido no ha podido ser entregado." +
    "\n\n" +
    "Tus productos del pedido con ID: " +
    id +
    " no han sido entregados debido a algún problema. Contactaremos contigo pronto para intentar realizar tu entrega de forma adecuada." +
    "\n\n" +
    "Que tengas un excelente día.";

  let mailOptions = {
    ...formatoDeInfoDeEmails,
    to: correo,
    subject: "No se pudo realizar la entrega de tu pedido",
    text: mensaje,
    estado: "No entregado",
  };
  EnviarUnEmailConRespuesta(mailOptions, res);
};

const EnviarEmailDeDiaDeEnvio = async (res, id, correo, dia) => {
  let mensaje =
    "Actualización de tu pedido.\n" +
    "¡Tu pedido con el ID: " +
    id +
    " será enviado el día " +
    dia +
    "!" +
    "\n\n" +
    "Recuerda que nuestras entregas se realizan en el transcurso del día a partir de las 7:00AM.  ";
  let titulo = "Tu pedido será enviado el día " + dia;
  if (dia === "mañana") {
    titulo = "Tu pedido será enviado mañana";
    mensaje =
      "Actualización de tu pedido.\n" +
      "¡Tu pedido con el ID: " +
      id +
      " será enviado mañana!" +
      "\n\n" +
      "Recuerda que nuestras entregas se realizan en el transcurso del día a partir de las 7:00AM.  ";
  }

  let mailOptions = {
    ...formatoDeInfoDeEmails,
    to: correo,
    subject: titulo,
    text: mensaje,
    estado: "Confirmado",
  };
  EnviarUnEmailConRespuesta(mailOptions, res);
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
  EnviarEmailDeRestablecimientoDePedido,
  EnviarEmailDeDiaDeEnvio,
};
