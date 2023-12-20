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
import { enviarEmail, enviarEmailDeContra } from "./solicitudes/emails.js";
import {
  EncriptarDatosDeCliente,
  desencriptarContra,
  desencriptarCorreo,
  encriptarCorreo,
} from "./utilidades/encriptado.js";
import ActualizarArchivos from "./base/ActualizacionDeArchivos.js";
import {
  ActualizarLasOfertas,
  ObtenerProductosDeVariable,
} from "./solicitudes/productos.js";
import { CrearOrdenDePago, crearCobro } from "./solicitudes/Pagos.js";
import FinalizarPedido from "./solicitudes/Pedido.js";
import CrearPago from "./solicitudes/PagosV3.js";

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

App.post("/pagar", pagar);
App.post("/pagarv2", pagarv2);
App.post("/EnviarEmail", enviarEmail);
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
App.get("/obtenerClientes", ObtenerTodosLosClientes);
App.get("/obtenerClientesDes", ObtenerListaDeClientesDesencriptados);
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

setInterval(() => {
  ActualizarArchivos(false);
}, 4 * 60 * 1000);

setInterval(() => {
  axios
    .get(process.env.URL_DE_PING)
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err));
}, 60000 * 5);
