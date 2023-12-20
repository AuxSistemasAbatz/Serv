import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const uri7 = process.env.URI7;

const conectarConSolicitudes = async () => {
  mongoose.createConnection(uri7, {
    bufferCommands: false,
  });
};
const SolicitudesSchema = mongoose.Schema({
  email: {
    type: String,
  },
  fecha: {
    type: String,
  },
  hora: {
    type: String,
  },
  estatus: {
    type: String,
  },
  codigo: {
    type: String,
  },
});

const Solicitudes = mongoose.model("Solicitudes", SolicitudesSchema);

export default conectarConSolicitudes;
export { Solicitudes };
