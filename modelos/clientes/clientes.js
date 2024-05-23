import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const uri5 = process.env.URI5;

const conectarConClientes = async () => {
  mongoose.createConnection(uri5, {
    bufferCommands: false,
  });
};
const ClientesSchema = mongoose.Schema({
  correo: {
    type: String,
    required: true,
  },
  contrasena: {
    type: String,
    required: true,
  },
  infodeenvio: {
    nombre: String,
    calle: String,
    numero: String,
    codigopostal: String,
    colonia: String,
    localidad: String,
    telefono: String,
    correo: String,
  },
  infodefacturacion: {
    rfc: String,
    regimen: String,
    calle: String,
    colonia: String,
    numero: String,
    codigopostal: String,
    localidad: String,
    colonia: String,
    denominacion: String,
  },
  pedidos: {
    type: Array,
  },
  encriptado: {
    type: Boolean,
  },
  fechaDeUltimoAcceso: {
    type: String,
  },
});

const Cliente = mongoose.model("Clientes", ClientesSchema);

export default conectarConClientes;
export { Cliente };
