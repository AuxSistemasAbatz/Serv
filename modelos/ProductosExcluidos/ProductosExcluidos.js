import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const URI8 = process.env.URI8;

const conectarConProductosExcluidos = async () => {
  mongoose.createConnection(URI8, {
    bufferCommands: false,
  });
};

const ProductosExcluidosEsquema = mongoose.Schema({
  item: {
    type: String,
    required: true,
  },
  unidad: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  precio: {
    type: String,
    required: true,
  },
});

const ProductosExcluidos = mongoose.model(
  "ProductosExcluidos",
  ProductosExcluidosEsquema
);

export default conectarConProductosExcluidos;
export { ProductosExcluidos };
