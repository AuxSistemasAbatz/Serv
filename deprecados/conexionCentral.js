import { Connection } from "tedious";
const config = {
  server: process.env.HOST,
  host: process.env.HOST,
  port: process.env.PUERTO_DB,
  authentication: {
    type: "default",
    options: {
      userName: process.env.USUARIO, //update me
      password: process.env.CONTRASENA,
    },
  },
  options: {
    encrypt: false,
    database: process.env.DB, //update me
  },
};

const conexionCentral = new Connection(config);
conexionCentral.on("connect", (err) => {
  if (err) {
    console.log("No se pudo conectar", err);
  } else {
    console.log("conectado");
  }
});

conexionCentral.connect();

export default conexionCentral;
