import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const URI10 = process.env.URI10;

const conectarConVisitas = async () => {
  mongoose.createConnection(URI10, {
    bufferCommands: false,
  });
};

const VisitasSchema = mongoose.Schema({
  inicio: {
    numVisitas: Number,
    fechaUltimaVisita: String,
  },
  productos: {
    numVisitas: Number,
    fechaUltimaVisita: String,
  },
  nosotros: {
    numVisitas: Number,
    fechaUltimaVisita: String,
  },
  sucursales: {
    numVisitas: Number,
    fechaUltimaVisita: String,
  },
  rutas: {
    numVisitas: Number,
    fechaUltimaVisita: String,
  },
  contacto: {
    numVisitas: Number,
    fechaUltimaVisita: String,
  },
  bolsadetrabajo: {
    numVisitas: Number,
    fechaUltimaVisita: String,
  },
  sesion: {
    numVisitas: Number,
    fechaUltimaVisita: String,
  },
  perfil: {
    numVisitas: Number,
    fechaUltimaVisita: String,
  },
  registro: {
    numVisitas: Number,
    fechaUltimaVisita: String,
  },
  pago: {
    numVisitas: Number,
    fechaUltimaVisita: String,
  },
});

const Visita = mongoose.model("Visitas", VisitasSchema);

export default conectarConVisitas;
export { Visita };
