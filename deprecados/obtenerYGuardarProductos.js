import { Request } from "tedious";
const Rq = Request;
let productos = [];
import cjson from "compressed-json";
import fs from "fs";
import conexionCentral from "./conexionCentral.js";
const busqueda = `select lpd.Lista, lpd.Articulo as id, lpd.Unidad as unidad,lpd.Precio as precio, a.Descripcion1 as desc_prod, a.Linea as clase, cb.Codigo, Inventario, a.Presentacion , ArtU.Factor from 
ListaPreciosDUnidad lpd 
join Art a on a.Articulo = lpd.Articulo join CB cb on cb.Cuenta = lpd.Articulo and cb.Unidad = lpd.Unidad
join ArtExistenciaInv ArtE on lpd.Articulo = ArtE.Articulo and ArtE.Sucursal = 0
join ArtUnidad ArtU on ArtE.Articulo = ArtU.Articulo and lpd.Unidad = ArtU.Unidad
where Lista = '(precio 3)' AND a.Estatus = 'ALTA' and a.Tipo <> 'SERVICIO' ORDER BY precio`;

const GuardarProductos = () => {
  productos = [];
  try {
    const peticion = new Rq(busqueda, (err, rowCount) => {
      if (err) {
        conexionCentral.connect();
      }
      console.log(rowCount);
    });

    peticion.on("row", (columns) => {
      let producto = {};
      columns.forEach((column) => {
        let valor = column.value;
        if (valor !== null) {
          valor = valor.toString();
        }
        producto["" + column.metadata.colName.toLowerCase()] = valor;
      });
      productos.push(producto);
    });
    peticion.on("requestCompleted", () => {
      let datosEnString = JSON.stringify(productos);
      fs.writeFileSync(
        "./base/productos.json",
        datosEnString,
        "utf-8",
        (err) => {
          if (err) {
            console.log("No se pudo guardar el archivo de productos", err);
          } else {
            console.log("Archivo JSON de ofertas guardado correctamente");
          }
        }
      );
    });
    conexionCentral.execSql(peticion);
  } catch (err) {
    console.log(err);
    conexionCentral.connect();
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

export { GuardarProductos, ObtenerArchivoDeProductos };
