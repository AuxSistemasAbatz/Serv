import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const uri2 = process.env.URI2;

const conectarConUsuarios = async () => {
  mongoose.createConnection(uri2, {
    bufferCommands: false,
  });
};
const PersonalSchema = mongoose.Schema({
  usuario: {
    type: String,
    required: true,
  },
  contrasena: {
    type: String,
    required: true,
  },
  rol: {
    type: String,
    required: true,
  },
});

const Personal = mongoose.model("Personal", PersonalSchema);

export default conectarConUsuarios;
export { Personal };
