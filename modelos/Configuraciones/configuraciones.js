import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const URI9 = process.env.URI9;

const ConectarConConfiguracion = async () => {
  mongoose.createConnection(URI9, {
    bufferCommands: false,
  });
};

const ConfiguracionSchema = mongoose.Schema({
  minimoDeEnvioLocal: {
    type: Number,
    required: true,
  },
  minimoDeEnvioForaneo: {
    type: Number,
    required: true,
  },
  permitirPago: {
    type: Boolean,
    required: true,
  },
  permitirCualquierPago: {
    type: Boolean,
    required: true,
  },
});

const Configuracion = mongoose.model("Configuracion", ConfiguracionSchema);

export default ConectarConConfiguracion;

export { Configuracion };
