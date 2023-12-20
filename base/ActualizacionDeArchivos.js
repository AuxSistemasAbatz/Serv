import { Connection } from "tedious";
const config = {
  server: process.env.HOST,
  host: process.env.HOST,
  port: process.env.PUERTO_DB,
  authentication: {
    type: "default",
    options: {
      userName: process.env.USUARIO, //update me
      password: process.env.CONTRASENA,
    },
  },
  options: {
    encrypt: false,
    database: process.env.DB, //update me
  },
};

import { Request } from "tedious";
const Rq = Request;
const Rq2 = Request;
import fs from "fs";
import { JuntarOfertasConProductos } from "../utilidades/utility.js";
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

const busquedaDeOfertas = `SELECT
	oferta.ID,
	oferta.Articulo,
	unidadReal.Lista,
	unidadReal.Precio,
	vigencia.Estatus,
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
	AND (vigencia.Concepto= 'GENERAL' AND unidadReal.Unidad= oferta.Unidad AND unidadReal.Lista= '(Precio 3)') 
ORDER BY
	articulo.Descripcion1 ASC`;

const busquedaDeProductos = `SELECT a.Articulo AS id, lpd.Unidad as unidad,lpd.Precio as precio
, a.Descripcion1, a.Linea as clase, cb.Codigo, Inventario, a.Presentacion , ArtU.Factor
FROM Art a
JOIN ListaPreciosDUnidad lpd on a.Articulo = lpd.Articulo 
join CB cb on cb.Cuenta = lpd.Articulo and cb.Unidad = lpd.Unidad
join ArtExistenciaInv ArtE on lpd.Articulo = ArtE.Articulo and ArtE.Sucursal = 0
join ArtUnidad ArtU on ArtE.Articulo = ArtU.Articulo and lpd.Unidad = ArtU.Unidad
where Lista = '(precio 3)' AND a.Estatus = 'ALTA' and a.Tipo <> 'SERVICIO' and a.Grupo <> 'CIGARROS' and lpd.Unidad <> 'PUNTODEVENTA' ORDER BY precio;`;
let productosGlobales = [];

const GuardarProductos = () => {
  let productos = [];
  try {
    const peticion = new Rq2(busquedaDeProductos, (err, rowCount) => {
      console.log("Numero de productos: " + rowCount);
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
      let archivoOfertas = fs.readFileSync("./base/ofertas.json", "utf-8");
      let ofertas = JSON.parse(archivoOfertas);
      let productosConOfertas = productos;
      productosConOfertas = JuntarOfertasConProductos(productos, ofertas);
      productosGlobales = productosConOfertas;
      let datosEnString = JSON.stringify(productosConOfertas);
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
    conexionPrincipal.execSql(peticion);
  } catch (err) {
    console.log(err);
  }
};

const GuardarOfertas = () => {
  let productos = [];
  try {
    const peticion = new Rq(busquedaDeOfertas, (err, rowCount) => {
      console.log("Numero de ofertas: " + rowCount);
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
      GuardarProductos();
      fs.writeFileSync("./base/ofertas.json", datosEnString, "utf-8", (err) => {
        if (err) {
          console.log("No se pudo guardar el archivo de ofertas", err);
        } else {
          console.log("Archivo JSON de ofertas guardado correctamente");
        }
      });
      return true;
    });
    conexionPrincipal.execSql(peticion);
  } catch (err) {
    console.log(err);
  }
};

const conexionPrincipal = new Connection(config);
conexionPrincipal.on("connect", (err) => {
  if (err) {
    console.log("No se pudo conectar", err);
  } else {
    let fecha = new Date();
    let dia = fecha.getDay();
    if (dia === 0) {
      console.log("Actualizacion de ofertas");
      GuardarOfertas();
    } else {
      GuardarProductos();
    }
  }
});

const ActualizarArchivos = (actualizar) => {
  console.log(conexionPrincipal.state.name);
  if (conexionPrincipal.state.name === "LoggedIn") {
    let fecha = new Date();
    let dia = fecha.getDay();
    if (actualizar || dia === 0) {
      console.log("Actualizacion de ofertas");
      GuardarOfertas();
    } else {
      GuardarProductos();
    }
  } else {
    conexionPrincipal.connect();
  }
};

export default ActualizarArchivos;

export { productosGlobales };
