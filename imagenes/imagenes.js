import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.NOMBRE_CLOUDI,
  api_key: process.env.LLAVE_CLOUDI,
  api_secret: process.env.SECRETO_CLOUDI,
  secure: true,
});

const subirImagenACloudi = async (direccion, res) => {
  await cloudinary.uploader
    .upload(direccion)
    .then((result) => {
      console.log("Imagen guardada");
      res.send({ status: "ok", nombre: result.public_id });
    })
    .catch((err) => {
      console.log(err);
    });
};

export default subirImagenACloudi;
