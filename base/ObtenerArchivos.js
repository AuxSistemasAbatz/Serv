import cjson from "compressed-json";
import fs from "fs";

const ObtenerArchivoDeOfertas = () => {
  try {
    const data = fs.readFileSync("./base/ofertas.json", "utf-8");
    if (data) {
      try {
        const jsonData = JSON.parse(data);
        const ofertasComprimidas = cjson.compress.toString(jsonData);
        return ofertasComprimidas;
      } catch (err) {
        console.log("Error al intentar leer el archivo json", err);
      }
    } else {
      GuardarOfertas();
    }
  } catch (err) {
    console.log(err);
    GuardarOfertas();
  }
};

const ObtenerArchivoDeProductos = () => {
  try {
    const data = fs.readFileSync("./base/productos.json", "utf-8");
    if (data) {
      try {
        const jsonData = JSON.parse(data);
        const ofertasComprimidas = cjson.compress.toString(jsonData);
        return ofertasComprimidas;
      } catch (err) {
        console.log("Error al intentar leer el archivo json", err);
      }
    } else {
      GuardarProductos();
    }
  } catch (err) {
    console.log(err);
    GuardarProductos();
  }
};

export { ObtenerArchivoDeOfertas, ObtenerArchivoDeProductos };
