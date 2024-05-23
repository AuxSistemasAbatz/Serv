import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import bodyParser from "body-parser";
import axios from "axios";
import multer from "multer";
import {
  GestionarEstatusDePedido,
  ValidarLosProductosDelCarrito,
  hacerPing,
  obtenerExcelDePedido,
  obtenerInfoDeProducto,
  obtenerListaDeProductosRealacionados,
  obtenerOfertasDeArchivo,
  obtenerPedidoPorId,
  obtenerPedidos,
  obtenerProductosDeArchivo,
  obtenerQR,
  obtenidoDeImagen,
  pagar,
  pagarv2,
  pedirId,
  realizarpedido,
  subidoDeImagen,
  validarUsuarioPorNombreYContr,
} from "./solicitudes.js";
import {
  agregarProductoSinImagen,
  obtenerProductosSinImagen,
  eliminarProductoSinImagen,
  EliminarVariosProductosSinImagen,
  AgregarProductosSinImagenNuevo,
  CrearExcelDeProductosSinImagen,
} from "./solicitudes/productosSinImagen.js";
import {
  eliminarVacante,
  obternerTodasLasVacantes,
  modificarVacante,
  crearNuevaVacante,
} from "./solicitudes/vacantes.js";
import { obtenerProductos, ofertas } from "./conexiones/consultas.js";
import conectar from "./modelos/pedidos/conexionconm.js";
import conectarConUsuarios from "./modelos/usuarios/usuarios.js";
import conectarConVacantes from "./modelos/vacantes/vacantes.js";
import conectarConProductos from "./modelos/productosSinImagen/Productos.js";
import conectarConClientes from "./modelos/clientes/clientes.js";
import {
  EncriptarDatosExtrasDeClientes,
  ObtenerListaDeClientesDesencriptados,
  ObtenerPedidosDeUnCliente,
  ObtenerTodosLosClientes,
  cambiarContrasena,
  iniciarSesion,
  modificarDatosDeEnvioDelCliente,
  modificarDatosDeFacturacionDelCliente,
  reencriptarCorreoYContraDeClientesYaGuardados,
  registrarCliente,
  revisarSiExisteUnCliente,
} from "./solicitudes/clientes.js";
import conectarConBaseDeErrores from "./modelos/errores/errores.js";
import {
  AgregarError,
  ObtenerListaDeErrores,
  RemoverError,
} from "./solicitudes/errores.js";
import conectarConSolicitudes from "./modelos/solicitudes/solicitudes.js";
import {
  cambiarContraConCorreo,
  recuperarDatos,
} from "./solicitudes/solicitudes.js";
import {
  EncriptarDatosDeCliente,
  desencriptarContra,
  desencriptarCorreo,
  encriptarCorreo,
} from "./utilidades/encriptado.js";
import ActualizarArchivos from "./base/ActualizacionDeArchivos.js";
import {
  ActualizarLasOfertas,
  ObtenerCantidadDeParteProductos,
  ObtenerHojaDeProductos,
  ObtenerInformacionDeProductos,
  ObtenerProductosDeVariable,
  ObtenerProductosDeVariableConCategoria,
} from "./solicitudes/productos.js";
import { CrearOrdenDePago, crearCobro } from "./solicitudes/Pagos.js";
import FinalizarPedido from "./solicitudes/Pedido.js";
import CrearPago from "./solicitudes/PagosV3.js";
import conectarConProductosExcluidos from "./modelos/ProductosExcluidos/ProductosExcluidos.js";
import {
  CrearProductoExcluido,
  EliminarProductoExcluido,
  ObtenerProductosExcluidos,
} from "./solicitudes/ProductosExcluidos.js";
import { ObtenerImagenDeQr } from "./conexiones/ws.js";
import MostrarQrEnTerminal from "./solicitudes/Qr.js";
import ConectarConConfiguracion from "./modelos/Configuraciones/configuraciones.js";
import {
  AjustarConfiguracion,
  ConfigurarPorPrimeraVez,
  ObtenerConfiguracion,
} from "./solicitudes/Configuracion.js";
import EnviarEmail, { EnviarEmailDeContra } from "./conexiones/emailNode.js";
import { EnviarMensajeDeSolicitudDeTransferidoDeMercanciaPorWhatsApp } from "./solicitudes/Mensajes.js";
import {
  EnviarAvisoDeDiaDeEnvio,
  enviarEmailDeContra,
} from "./solicitudes/emails.js";

//import { AESEncryptString } from "./encriptado/Encriptadov3.js";
import GenerarClave from "./encriptado/NuevoEncriptadoFinal.js";
import { EncriptarDatosDeBN } from "./encriptado/NuevoEncriptadoFinalModificado.js";
import conectarConVisitas from "./modelos/analiticas/visitas.js";
import {
  AplicarVisita,
  InicializarTodasLasVisitas,
} from "./solicitudes/analiticas.js";
import ConectarConCarritos from "./modelos/carritos/carritos.js";
import {
  ActualizarCarrito,
  CrearCarrito,
  ObtenerCarritoYValidar,
} from "./solicitudes/carritos.js";

dotenv.config();
const PUERTO1 = process.env.PUERTO;

const App = express();
const upload = multer({ dest: "imagenes/" });
const listaDeDominios = [
  process.env.URL1,
  process.env.URL2,
  process.env.URL3,
  process.env.URL4,
  process.env.URL5,
  process.env.URL6,
  process.env.URL7,
  process.env.URL8,
  process.env.URL9,
  process.env.URL10,
  process.env.URL11,
  process.env.URL12,
  process.env.URL13,
  process.env.URL14,
  process.env.URL15,
  process.env.URL16,
  process.env.URL17,
  process.env.URL18,
  process.env.URL19,
  process.env.URL20,
];

const opcionesDeCors = {
  origin: listaDeDominios,
  optionSuccessStatus: 200,
};

App.use(express.json());
App.use(cors(opcionesDeCors));
App.use(morgan("common"));
App.use(bodyParser.json());

App.get("/obtenerProductosSinImagen", obtenerProductosSinImagen);
App.get("/ofertas", ofertas);
App.get("/productos", obtenerProductos);
App.get("/obtenerPedidos", obtenerPedidos);
App.get("/imagenDeQr", obtenerQR);
App.get("/ping", hacerPing);
App.get("/obtenerTodasLasVacantes", obternerTodasLasVacantes);
App.get("/imagenes/:id", obtenidoDeImagen);
App.get("/obtenerOfertasDeArchivo", obtenerOfertasDeArchivo);
App.get("/obtenerProductosDeArchivo", obtenerProductosDeArchivo);
App.get("/obtenerlistadeerrores", ObtenerListaDeErrores);
App.get("/producto/:id", obtenerInfoDeProducto);
App.get(
  "/productosRelacionados/:categoria",
  obtenerListaDeProductosRealacionados
);
App.get("/productosDeVariable", ObtenerProductosDeVariable);
App.get("/ObtenerImagenDeQr", ObtenerImagenDeQr);
App.get("/ObtenerConfiguracion", ObtenerConfiguracion);
App.get(
  "/ObtenerReporteEnExcelDeProductosSinImagen",
  CrearExcelDeProductosSinImagen
);
App.get("/obtenerClientes", ObtenerTodosLosClientes);
App.get("/obtenerClientesDes", ObtenerListaDeClientesDesencriptados);
App.get("/obtenerProductosExcluidos", ObtenerProductosExcluidos);
App.get(
  "/productosDeVariable/:categoria",
  ObtenerProductosDeVariableConCategoria
);
/*
Este endpoint permite inicializar a 0 las visitas de todas las paginas
App.get("/InicializarTodasLasVisitas", InicializarTodasLasVisitas);
*/

App.post("/pagar", pagar);
App.post("/pagarv2", pagarv2);
App.post("/EnviarEmail", EnviarEmail);
App.post("/agregarProductoSinImagen", AgregarProductosSinImagenNuevo);
App.post("/realizarpedido", realizarpedido);
App.post("/pedirId", pedirId);
App.post("/obtenerPedido", obtenerPedidoPorId);
App.post("/obtenerExcel", obtenerExcelDePedido);
App.post("/validarUsuario", validarUsuarioPorNombreYContr);
App.post("/crearVacante", crearNuevaVacante);
App.post("/modificarVacante", modificarVacante);
App.post("/eliminarVacante", eliminarVacante);
App.post("/subirImagen", upload.single("image"), subidoDeImagen);
App.post("/eliminarProductoSinImagen", EliminarVariosProductosSinImagen);
App.post("/registrarCliente", registrarCliente);
App.post("/revisarSiExisteUnCliente", revisarSiExisteUnCliente);
App.post("/iniciarSesion", iniciarSesion);
App.post("/modificarDatosDeEnvioDelCliente", modificarDatosDeEnvioDelCliente);
App.post(
  "/modificarDatosDeFacturacionDelCliente",
  modificarDatosDeFacturacionDelCliente
);
App.post("/modificarcontra", cambiarContrasena);
App.post("/agregarerror", AgregarError);
App.post("/removererror", RemoverError);
App.post("/enviarEmailDeContra", enviarEmailDeContra);
App.post("/recuperarDatos", recuperarDatos);
App.post("/cambiarContraConCorreo", cambiarContraConCorreo);
App.post("/encriptarTodos", (req, res) => {
  reencriptarCorreoYContraDeClientesYaGuardados();
  res.send({ estatus: "ok" });
});
App.post("/desencriptadoDeCorreo", (req, res) => {
  let { correo } = req.body;
  let correoDes = desencriptarCorreo(correo);
  res.status(200).send({ correo: correoDes });
});
App.post("/desencriptado", (req, res) => {
  let { contra } = req.body;
  let contraDes = desencriptarContra(contra);
  res.status(200).send({ contra: contraDes });
});
App.post("/encriptadoDeCorreo", (req, res) => {
  let { correo } = req.body;
  let correoEnc = encriptarCorreo(correo);
  res.status(200).send({ correo: correoEnc });
});
App.post("/validarLosProductosDelCarrito", ValidarLosProductosDelCarrito);
App.post("/cambiarEstadoDePedido", GestionarEstatusDePedido);
App.post("/crearOrdenDePago", CrearOrdenDePago);
App.post("/crearCobro", crearCobro);
App.post("/finalizarPedido", FinalizarPedido);
App.post("/efectuarPago", CrearPago);
App.post("/actualizarofertas", ActualizarLasOfertas);
App.post("/crearProductoExcluido", CrearProductoExcluido);
App.post("/eliminarProductoExcluido", EliminarProductoExcluido);
App.post("/obtenerPedidosDeUnCliente", ObtenerPedidosDeUnCliente);
App.post("/GenerarQr", MostrarQrEnTerminal);
App.post("/AjustarConfiguracion", AjustarConfiguracion);
App.post(
  "/EnviarSolicitudDeTransferenciaDeMercancia",
  EnviarMensajeDeSolicitudDeTransferidoDeMercanciaPorWhatsApp
);
App.post("/EnviarAvisoDeDiaDeEnvio", EnviarAvisoDeDiaDeEnvio);
App.post("/ObtenerHojaDeProductos", ObtenerHojaDeProductos);
App.post("/GenerarClaveBN", GenerarClave);
App.post("/EncriptarDatosDeBN", EncriptarDatosDeBN);
App.post("/ObtenerCantidadDeParteProductos", ObtenerCantidadDeParteProductos);
App.post("/visita", AplicarVisita);
App.post("/ObtenerListadoDeProductos", ObtenerInformacionDeProductos);
App.post("/CrearCarrito", CrearCarrito);
App.post("/ObtenerCarrito", ObtenerCarritoYValidar);
App.post("/ActualizarCarrito", ActualizarCarrito);
App.listen(PUERTO1, () => {
  console.log("Servidor escuchando en el puerto: " + PUERTO1);
});

conectar().catch((err) => console.log(err));
conectarConUsuarios().catch((err) => console.log(err));
conectarConVacantes().catch((err) => console.log(err));
conectarConProductos().catch((err) => console.log(err));
conectarConClientes().catch((err) => console.log(err));
conectarConBaseDeErrores().catch((err) => console.log(err));
conectarConSolicitudes().catch((err) => console.log(err));
conectarConProductosExcluidos().catch((err) => console.log(err));
ConectarConConfiguracion().catch((err) => console.log(err));
conectarConVisitas().catch((err) => console.log(err));
ConectarConCarritos().catch((err) => console.log(err));

ActualizarArchivos();

setInterval(() => {
  ActualizarArchivos(false);
}, 2 * 60 * 1000);

setInterval(() => {
  axios
    .get(process.env.URL_DE_PING)
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err));
}, 60000 * 5);
