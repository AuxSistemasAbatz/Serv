import dotenv from "dotenv";
dotenv.config();

const claveCon = process.env.ENC_CO;
const claveCE = process.env.ENC_CE;

const encriptarContra = (contra) => {
  let a = parseInt(claveCon.slice(0, 1));
  let b = parseInt(claveCon.slice(1, 2));
  let division = parseInt(claveCon.slice(2, 3));
  let contraCompleta = "";
  let contrase = contra.split("");
  let hasta = contra.length - division;
  contrase.map((caracter, index) => {
    let nuevoCaracter = "";
    let caracterAnterior = parseInt(caracter.charCodeAt(0));
    if (index < hasta) {
      nuevoCaracter = String.fromCharCode(caracterAnterior + a);
    } else {
      nuevoCaracter = String.fromCharCode(caracterAnterior + b);
    }
    contraCompleta = contraCompleta + nuevoCaracter;
  });
  return contraCompleta;
};

const encriptarCorreo = (correo) => {
  let a = parseInt(claveCE.slice(0, 1));
  let b = parseInt(claveCE.slice(1, 2));
  let c = parseInt(claveCE.slice(2, 3));
  let correoEnArray = correo.split("");
  let correoEncriptado = "";
  let encontrado = false;
  correoEnArray.map((caracter) => {
    let numeroDeCaracter = parseInt(caracter.charCodeAt(0));
    let nuevoCaracter = "";
    if (encontrado) {
      nuevoCaracter = String.fromCharCode(numeroDeCaracter + c);
    } else if (!encontrado && numeroDeCaracter === 64) {
      nuevoCaracter = String.fromCharCode(numeroDeCaracter + b);
      encontrado = true;
    } else {
      nuevoCaracter = String.fromCharCode(numeroDeCaracter - a);
    }
    correoEncriptado = correoEncriptado + nuevoCaracter;
  });
  return correoEncriptado;
};

const desencriptarCorreo = (correo) => {
  let a = parseInt(claveCE.slice(0, 1));
  let b = parseInt(claveCE.slice(1, 2));
  let c = parseInt(claveCE.slice(2, 3));
  let correoEnArray = correo.split("");
  let correoDesencriptado = "";
  let encontrado = false;
  correoEnArray.map((caracter) => {
    let numeroDeCaracter = parseInt(caracter.charCodeAt(0));
    let nuevoCaracter = "";
    if (encontrado) {
      nuevoCaracter = String.fromCharCode(numeroDeCaracter - c);
    } else if (!encontrado && numeroDeCaracter === 64 + b) {
      nuevoCaracter = String.fromCharCode(numeroDeCaracter - b);
      encontrado = true;
    } else {
      nuevoCaracter = String.fromCharCode(numeroDeCaracter + a);
    }
    correoDesencriptado = correoDesencriptado + nuevoCaracter;
  });
  return correoDesencriptado;
};
const desencriptarContra = (contra) => {
  let a = parseInt(claveCon.slice(0, 1));
  let b = parseInt(claveCon.slice(1, 2));
  let division = parseInt(claveCon.slice(2, 3));
  let contraCompleta = "";
  let contrase = contra.split("");
  let hasta = contra.length - division;
  contrase.map((caracter, index) => {
    let nuevoCaracter = "";
    let caracterAnterior = parseInt(caracter.charCodeAt(0));
    if (index < hasta) {
      nuevoCaracter = String.fromCharCode(caracterAnterior - a);
    } else {
      nuevoCaracter = String.fromCharCode(caracterAnterior - b);
    }
    contraCompleta = contraCompleta + nuevoCaracter;
  });
  return contraCompleta;
};

const EncriptarDato = (dato) => {
  const clave = parseInt(claveCon.slice(0, 1));
  let datoEncriptado = "";
  if (dato === undefined || dato === null || dato === "") {
    return datoEncriptado;
  } else {
    let datoEnArray = dato.split("");
    datoEnArray.map((caracter) => {
      let numeroDeCaracter = parseInt(caracter.charCodeAt(0));
      let nuevoCaracter = String.fromCharCode(numeroDeCaracter + clave);
      datoEncriptado = datoEncriptado + nuevoCaracter;
    });
    return datoEncriptado;
  }
};
const DesencriptarDato = (dato) => {
  const clave = claveCon.slice(0, 1);
  let datoDesencriptado = "";
  if (dato === undefined || dato === null || dato === "")
    return datoDesencriptado;
  let datoEnArray = dato.split("");
  datoEnArray.map((caracter) => {
    let numeroDeCaracter = parseInt(caracter.charCodeAt(0));
    let nuevoCaracter = String.fromCharCode(numeroDeCaracter - clave);
    datoDesencriptado = datoDesencriptado + nuevoCaracter;
  });
  return datoDesencriptado;
};

const EncriptarDatosDeEnvio = (datos) => {
  let datosEncriptados = {
    nombre: EncriptarDato(datos.nombre),
    calle: EncriptarDato(datos.calle),
    numero: EncriptarDato(datos.numero),
    colonia: EncriptarDato(datos.colonia),
    localidad: EncriptarDato(datos.localidad),
    codigopostal: EncriptarDato(datos.codigopostal),
    telefono: EncriptarDato(datos.telefono),
  };
  return datosEncriptados;
};

const DesencriptarDatosDeEnvio = (datos) => {
  let datosDesencriptados = {
    nombre: DesencriptarDato(datos.nombre),
    calle: DesencriptarDato(datos.calle),
    numero: DesencriptarDato(datos.numero),
    colonia: DesencriptarDato(datos.colonia),
    localidad: DesencriptarDato(datos.localidad),
    codigopostal: DesencriptarDato(datos.codigopostal),
    telefono: DesencriptarDato(datos.telefono),
  };
  return datosDesencriptados;
};

const EncriptarDatosDeFacturacion = (datos) => {
  let datosEncriptados = {
    rfc: EncriptarDato(datos.rfc),
    regimen: EncriptarDato(datos.regimen),
    calle: EncriptarDato(datos.calle),
    colonia: EncriptarDato(datos.colonia),
    numero: EncriptarDato(datos.numero),
    codigopostal: EncriptarDato(datos.codigopostal),
    localidad: EncriptarDato(datos.localidad),
  };
  return datosEncriptados;
};

const DesencriptarDatosDeFacturacion = (datos) => {
  let datosDescencriptados = {
    rfc: DesencriptarDato(datos.rfc),
    regimen: DesencriptarDato(datos.regimen),
    calle: DesencriptarDato(datos.calle),
    colonia: DesencriptarDato(datos.colonia),
    numero: DesencriptarDato(datos.numero),
    codigopostal: DesencriptarDato(datos.codigopostal),
    localidad: DesencriptarDato(datos.localidad),
  };
  return datosDescencriptados;
};

const EncriptarDatosDeCliente = (datos) => {
  let { infodeenvio, infodefacturacion, correo, contra, pedidos, encriptado } =
    datos;
  let clienteEncriptado = {
    correo: encriptarCorreo(correo),
    contra: encriptarContra(contra),
    infodeenvio: EncriptarDatosDeEnvio(infodeenvio),
    infodefacturacion: EncriptarDatosDeFacturacion(infodefacturacion),
    encriptado: true,
    pedidos: pedidos,
  };
  return clienteEncriptado;
};

const DesencriptarDatosDeCliente = (datos) => {
  let { infodeenvio, infodefacturacion, correo, contra, pedidos, encriptado } =
    datos;
  let clienteDesencriptado = {
    correo: desencriptarCorreo(correo),
    contra: desencriptarContra(contra),
    infodeenvio: DesencriptarDatosDeEnvio(infodeenvio),
    infodefacturacion: DesencriptarDatosDeFacturacion(infodefacturacion),
    encriptado: true,
    pedidos: pedidos,
  };
  return clienteDesencriptado;
};

export {
  encriptarContra,
  encriptarCorreo,
  desencriptarCorreo,
  desencriptarContra,
  DesencriptarDatosDeCliente,
  EncriptarDatosDeCliente,
  EncriptarDatosDeEnvio,
  EncriptarDatosDeFacturacion,
  DesencriptarDatosDeFacturacion,
  DesencriptarDatosDeEnvio,
};
