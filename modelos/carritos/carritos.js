import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const URI11 = process.env.URI11;

const ConectarConCarritos = async () => {
  mongoose.createConnection(URI11, {
    bufferCommands: false,
  });
};

const CarritosSchema = mongoose.Schema({
  productos: Array,
});

const Carritos = mongoose.model("Carritos", CarritosSchema);

export default ConectarConCarritos;

export { Carritos };
