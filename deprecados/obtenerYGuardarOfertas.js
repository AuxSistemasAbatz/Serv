import { Request } from "tedious";
const Rq = Request;
let productos = [];
import cjson from "compressed-json";
import fs from "fs";
import conexionCentral from "./conexionCentral.js";
const busqueda = `SELECT
	oferta.ID,
	oferta.Articulo,
	unidadReal.Lista,
	unidadReal.Precio,
	vigencia.Estatus,
	vigencia.Concepto,
	CONVERT ( VARCHAR, vigencia.FechaD, 6 ) AS [fechaInicio],
	CONVERT ( VARCHAR, vigencia.FechaA, 6 ) AS [fechaFin],
	articulo.Descripcion1,
	articulo.Linea,
	UnidadReal.Unidad,
	oferta.Porcentaje,
	cb.Codigo,
	au.Factor,
	aei.Inventario
FROM
	[ABATZ].[dbo].OfertaD AS oferta
	INNER JOIN [ABATZ].[dbo].Oferta AS vigencia ON ( oferta.ID = vigencia.ID )
	INNER JOIN [ABATZ].[dbo].Art AS articulo ON articulo.Articulo = oferta.Articulo
	INNER JOIN [ABATZ].[dbo].ListaPreciosDUnidad AS unidadReal ON ( articulo.Articulo= UnidadReal.Articulo ) 
	INNER JOIN [ABATZ].[dbo].CB cb ON cb.Cuenta = articulo.Articulo and cb.Unidad = unidadReal.Unidad
	INNER JOIN [ABATZ].[dbo].ArtUnidad AS au ON oferta.Unidad = au.Unidad and au.Articulo = articulo.Articulo
	INNER JOIN [ABATZ].[dbo].ArtExistenciaInv as aei on articulo.Articulo = aei.Articulo and aei.Sucursal = '0'
WHERE
	vigencia.Estatus = 'VIGENTE'
	AND ( vigencia.Concepto= 'GENERAL' AND unidadReal.Unidad= oferta.Unidad AND unidadReal.Lista= '(Precio 3)' ) 
ORDER BY
	articulo.Descripcion1 ASC`;

const GuardarOfertas = () => {
  productos = [];
  try {
    const peticion = new Rq(busqueda, (err, rowCount) => {
      if (err) {
        console.log(err);
        conexionCentral.connect();
      }
      console.log(rowCount);
    });

    peticion.on("row", (columns) => {
      let producto = {};
      columns.forEach((column) => {
        let valor = column.value.toString();
        switch (column.metadata.colName) {
          case "Descripcion1":
            producto["descripcion"] = valor;
            break;
          default:
            producto["" + column.metadata.colName.toLowerCase()] =
              column.value.toString();
        }
      });
      productos.push(producto);
    });
    peticion.on("requestCompleted", () => {
      let datosEnString = JSON.stringify(productos);
      fs.writeFileSync("./base/ofertas.json", datosEnString, "utf-8", (err) => {
        if (err) {
          console.log("No se pudo guardar el archivo de ofertas", err);
        } else {
          console.log("Archivo JSON de ofertas guardado correctamente");
        }
      });
      return true;
    });
    conexionCentral.execSql(peticion);
  } catch (err) {
    console.log(err);
    conexionCentral.connect();
  }
};

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

export { GuardarOfertas, ObtenerArchivoDeOfertas };
