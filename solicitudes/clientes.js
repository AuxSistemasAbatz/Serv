import dotenv from "dotenv";
import { Cliente } from "../modelos/clientes/clientes.js";
import { response } from "express";
import {
  EncriptarDatosDeCliente,
  EncriptarDatosDeEnvio,
  EncriptarDatosDeFacturacion,
  desencriptarCorreo,
  encriptarContra,
  encriptarCorreo,
  DesencriptarDatosDeFacturacion,
  DesencriptarDatosDeEnvio,
} from "../utilidades/encriptado.js";
dotenv.config();

const registrarCliente = async (req, res) => {
  let { infodeenvio, correo, contrasena, infodefacturacion } = req.body;
  let infoDeEnvioEnc = EncriptarDatosDeEnvio(infodeenvio);
  let infoDeFacturacionEncrip = EncriptarDatosDeFacturacion(infodefacturacion);
  let { rfc, regimen, calle, numero, codigopostal, localidad } =
    infoDeFacturacionEncrip;

  let correoEncriptado = encriptarCorreo(correo.toLowerCase());
  let contraEncriptada = encriptarContra(contrasena);
  const nuevoCliente = new Cliente({
    correo: correoEncriptado,
    contrasena: contraEncriptada,
    infodeenvio: {
      nombre: infoDeEnvioEnc.nombre,
      calle: infoDeEnvioEnc.calle,
      numero: infoDeEnvioEnc.numero,
      codigopostal: infoDeEnvioEnc.codigopostal,
      colonia: infoDeEnvioEnc.colonia,
      localidad: infoDeEnvioEnc.localidad,
      telefono: infoDeEnvioEnc.telefono,
    },
    infodefacturacion: {
      rfc: rfc === "" ? "XAXX010101000" : rfc,
      regimen: regimen === "" ? "SIN OBLIGACIONES FISCALES" : regimen,
      calle: calle,
      numero: numero,
      codigopostal: codigopostal,
      localidad: localidad,
    },
    pedidos: [],
    encriptado: true,
  });

  try {
    nuevoCliente
      .save()
      .then(() => {
        res.status(200).send({ status: "ok" });
      })
      .catch((err) => {
        console.log(err);
        res.status(200).send({ status: "notok", err });
      });
  } catch (err) {
    console.log(err);
    res.status(404).send({ status: "notok", err });
  }
};

const revisarSiExisteUnCliente = async (req, res) => {
  let correoBuscado = req.body.correo;
  try {
    const data = await Cliente.find({
      correo: encriptarCorreo(correoBuscado)
        ? encriptarCorreo(correoBuscado.toLowerCase())
        : "",
    });
    if (data) {
      if (data.length >= 1) {
        res.status(200).send({ status: "encontrado", data: data[0] });
      } else {
        res.status(200).send({ status: "no encontrado" });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const iniciarSesion = async (req, res) => {
  let { correo, contra } = req.body;
  try {
    const data = await Cliente.find({
      correo: encriptarCorreo(correo.toLowerCase()),
      contrasena: encriptarContra(contra),
    });
    if (data) {
      if (data.length >= 1) {
        let datosADevolver = {
          correo: desencriptarCorreo(data[0].correo),
          infodeenvio: DesencriptarDatosDeEnvio(data[0].infodeenvio),
          infodefacturacion: DesencriptarDatosDeFacturacion(
            data[0].infodefacturacion
          ),
          pedidos: data[0].pedidos,
        };
        res.status(200).send({
          status: "ok",
          datos: { ...datosADevolver },
        });
      } else {
        res.status(200).send({ status: "no se encontro" });
      }
    } else {
      res.status(200).send({ status: "notok" });
    }
  } catch (err) {
    console.log(err);
  }
};

const actualizarPedidosDelCliente = async (correoDelCliente, pedido) => {
  try {
    let correoEncriptado = encriptarCorreo(correoDelCliente);
    let data = await Cliente.findOne({
      correo: correoEncriptado,
    });
    if (data) {
      if (data.pedidos.length > 0) {
        let pedidosAnteriores = data.pedidos;
        pedidosAnteriores.push(pedido);
        await Cliente.findOneAndUpdate(
          { correo: correoEncriptado },
          { pedidos: [...pedidosAnteriores] }
        );
      } else {
        await Cliente.findOneAndUpdate(
          { correo: correoEncriptado },
          { pedidos: [{ ...pedido }] }
        );
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const modificarDatosDeEnvioDelCliente = async (req, res) => {
  let { correoDelCliente, nuevosDatosDeEnvio } = req.body;
  try {
    Cliente.findOneAndUpdate(
      { correo: encriptarCorreo(correoDelCliente) },
      {
        infodeenvio: nuevosDatosDeEnvio,
      }
    )
      .then((respuesta) => {
        res.status(200).send({ estatus: "ok" });
      })
      .catch((err) => {
        console.log(err);
        res.status(200).send({ estatus: "mal" });
      });
  } catch (err) {
    console.log(err);
  }
};

const modificarDatosDeFacturacionDelCliente = async (req, res) => {
  let { correoDelCliente, nuevosDatosDeFacturacion } = req.body;
  try {
    let correoEncriptado = encriptarCorreo(correoDelCliente);
    Cliente.findOneAndUpdate(
      { correo: correoEncriptado },
      {
        infodefacturacion: { ...nuevosDatosDeFacturacion },
      }
    )
      .then((respuesta) => {
        res.status(200).send({ estatus: "ok" });
      })
      .catch((err) => {
        console.log(err);
        res.status(200).send({ estatus: "mal" });
      });
  } catch (err) {
    console.log(err);
  }
};

const cambiarContrasena = async (req, res) => {
  let { correo, contrasena, nuevaContrasena } = req.body;
  let correoConFormato = encriptarCorreo(correo.toLowerCase());
  let contrasenaEncriptada = encriptarContra(contrasena);
  let nuevaContrasenaEncriptada = encriptarContra(nuevaContrasena);
  try {
    Cliente.findOneAndUpdate(
      { correo: correoConFormato, contrasena: contrasenaEncriptada },
      { contrasena: nuevaContrasenaEncriptada }
    )
      .then((response) => {
        res.status(200).send({ estatus: "ok" });
      })
      .catch((err) => {
        res.status(400);
      });
  } catch (err) {
    console.log(err);
  }
};

const reencriptarCorreoYContraDeClientesYaGuardados = (req, res) => {
  try {
    Cliente.find({})
      .then((res) => {
        res.map((dato) => {
          Cliente.findOneAndUpdate(
            { infodeenvio: dato.infodeenvio },
            { correo: encriptarCorreo(dato.correo), encriptado: true }
          ).then((res) => {
            console.log(res);
          });
        });
      })
      .catch((err) => {
        console.log("error ", err);
      });
  } catch (err) {
    console.log(err);
  }
};

const ObtenerTodosLosClientes = async (req, res) => {
  try {
    let data = await Cliente.find({});
    res.send(data);
  } catch (err) {
    res.send(err);
  }
};

const EncriptarDatosExtrasDeClientes = async (req, res) => {
  try {
    Cliente.find({})
      .then((clientes) => {
        clientes.map((cliente) => {
          let infoDeEnvioEncriptada = EncriptarDatosDeEnvio(
            cliente.infodeenvio
          );
          let infoDeFacturacionEncriptada = EncriptarDatosDeFacturacion(
            cliente.infodefacturacion
          );
          Cliente.findOneAndUpdate(
            { correo: cliente.correo, contrasena: cliente.contrasena },
            {
              infodeenvio: infoDeEnvioEncriptada,
              infodefacturacion: infoDeFacturacionEncriptada,
            }
          )
            .then((response) => {
              console.log(response);
            })
            .catch((err) => {
              res.send(err);
            });
        });
        res.send({ status: "ok" });
      })
      .catch((err) => {
        res.send(err);
      });
  } catch (err) {
    res.send(err);
  }
};

const ObtenerListaDeClientesDesencriptados = async (req, res) => {
  try {
    Cliente.find({}).then((clientesEncontrados) => {
      let clientesDesencriptados = [];
      clientesEncontrados.map((cliente) => {
        let infoDeEnvioDesencriptada = DesencriptarDatosDeEnvio(
          cliente.infodeenvio
        );
        let infoDeFacturacionDesencriptada = DesencriptarDatosDeFacturacion(
          cliente.infodefacturacion
        );
        let correo = desencriptarCorreo(cliente.correo);
        clientesDesencriptados.push({
          correo: correo,
          infodeenvio: infoDeEnvioDesencriptada,
          infodefacturacion: infoDeFacturacionDesencriptada,
          pedidos: cliente.pedidos,
        });
      });
      let data = clientesDesencriptados;
      res.send(data);
    });
  } catch (err) {
    res.send(err);
  }
};

export {
  registrarCliente,
  revisarSiExisteUnCliente,
  iniciarSesion,
  actualizarPedidosDelCliente,
  modificarDatosDeEnvioDelCliente,
  modificarDatosDeFacturacionDelCliente,
  cambiarContrasena,
  reencriptarCorreoYContraDeClientesYaGuardados,
  ObtenerTodosLosClientes,
  EncriptarDatosExtrasDeClientes,
  ObtenerListaDeClientesDesencriptados,
};
