import dotenv from "dotenv";
dotenv.config();

const CrearMapaDeDatos = (datos) => {
  let plantillaDeMapaDeDatos = {
    merchantId: 0,
    name: "",
    password: "",
    mode: "",
    controlNumber: "",
    terminalId: "",
    amount: 0,
    customerRef1: "", //Opcional
    customerRef2: "", //Opcional
    customerRef3: "", //Opcional
    customerRef4: "", //Opcional
    customerRef5: "", //Opcional
    merchantName: "",
    merchantCity: "",
    lang: "ES",
  };

  const datosClave = {
    merchantId: parseInt(process.env.ID_AFILIACION_BANORTE),
    name: process.env.NOMBRE_BANORTE,
    password: process.env.CONTRA_DE_BAN,
    mode: process.env.MODO_BANORTE,
    controlNumber: "1234567890",
    terminalId: process.env.TERMINAL_ID_BANORTE,
    merchantName: process.env.NOMBRE_COMERCIO_BANORTE,
    merchantCity: process.env.CIUDAD_COMERCIO_BANORTE,
  };

  let mapaDeDatos = { ...plantillaDeMapaDeDatos, ...datosClave };
  mapaDeDatos.amount = datos.total;
  mapaDeDatos.customerRef1 = datos.customerRef1;
  mapaDeDatos.customerRef2 = datos.customerRef2;
  mapaDeDatos.customerRef3 = datos.customerRef3;
  mapaDeDatos.customerRef4 = datos.customerRef4;
  mapaDeDatos.customerRef5 = datos.customerRef5;
  return mapaDeDatos;
};

export default CrearMapaDeDatos;
