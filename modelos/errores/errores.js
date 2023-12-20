import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const uri6 = process.env.URI6;

const conectarConBaseDeErrores = async () => {
  mongoose.createConnection(uri6, {
    bufferCommands: false,
  });
};
const ErrorSchema = mongoose.Schema({
  error: {
    type: Object,
  },
  parte: {
    type: String,
  },
});

const Errores = mongoose.model("Errores", ErrorSchema);

export default conectarConBaseDeErrores;
export { Errores };
