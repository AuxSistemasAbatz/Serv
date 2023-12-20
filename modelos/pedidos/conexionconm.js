import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const uri = process.env.URI;

const conectar = async () => {
  await mongoose.connect(uri);
};
const Pedido = mongoose.model("Pedido", {
  id: {
    type: String,
    required: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  telefono: {
    type: String,
    required: true,
  },
  direccion: {
    type: String,
    required: true,
  },
  total: {
    type: String,
    required: true,
  },
  ahorro: {
    type: String,
    required: true,
  },
  productos: {
    type: Array,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  fecha: {
    type: String,
    require: true,
  },
  referencia: {
    type: String,
    require: false,
  },
  recomendacion: {
    type: String,
    require: false,
  },
  estado: {
    type: String,
    require: true,
  },
  tipo: {
    type: String,
    require: true,
  },
});

export default conectar;
export { Pedido };
