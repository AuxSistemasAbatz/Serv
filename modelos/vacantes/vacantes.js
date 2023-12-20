import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const uri3 = process.env.URI3;

const conectarConVacantes = async () => {
  mongoose.createConnection(uri3, {
    bufferCommands: false,
  });
};
const VacanteSchema = mongoose.Schema({
  id: {
    type: String,
    require: true,
  },
  img: {
    type: String,
    require: true,
  },
  titulo: {
    type: String,
    require: true,
  },
  rol: {
    type: String,
    require: true,
  },
  horarios: {
    type: String,
    require: true,
  },
  recomendacion: {
    type: String,
    require: true,
  },
});

const Vacante = mongoose.model("Vacante", VacanteSchema);

export default conectarConVacantes;
export { Vacante };
