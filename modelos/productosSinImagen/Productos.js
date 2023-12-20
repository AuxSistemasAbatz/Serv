import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const uri4 = process.env.URI4;

const conectarConProductos = async () => {
  mongoose.createConnection(uri4, {
    bufferCommands: false,
  });
};
const ProductosSchema = mongoose.Schema({
  item: {
    type: String,
    require: true,
  },
  descripcion: {
    type: String,
    require: true,
  },
});

const Productos = mongoose.model("ProductosSinImagenes", ProductosSchema);

export default conectarConProductos;
export { Productos };
