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
import {
  EnglobarProductos,
  ExisteProducto,
  JuntarOfertasConProductos,
} from "../utilidades/utility.js";
import { ObtenerListaDeProductosExcluidos } from "../solicitudes/ProductosExcluidos.js";
import { ProductosExcluidos } from "../modelos/ProductosExcluidos/ProductosExcluidos.js";

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
	AND ((vigencia.Referencia = 'OFERTAS ALMACEN' OR vigencia.Referencia = 'ALMACEN GENERAL' OR vigencia.Concepto = 'GENERAL') AND unidadReal.Unidad= oferta.Unidad AND unidadReal.Lista= '(Precio 3)') 
ORDER BY
	articulo.Descripcion1 ASC`;

//Esta es la nueva por si no te acuerdas
const BusquedaDeOfertasNueva = `SELECT
	oferta.Articulo,
	unidadReal.Precio,
	vigencia.Estatus,
	UnidadReal.Unidad,
	oferta.Porcentaje,
	vigencia.Referencia,
	vigencia.Concepto
FROM
	[ABATZ].[dbo].OfertaD AS oferta
	INNER JOIN [ABATZ].[dbo].Oferta AS vigencia ON ( oferta.ID = vigencia.ID )
	INNER JOIN [ABATZ].[dbo].Art AS articulo ON articulo.Articulo = oferta.Articulo
	INNER JOIN [ABATZ].[dbo].ListaPreciosDUnidad AS unidadReal ON ( articulo.Articulo= UnidadReal.Articulo ) 
	INNER JOIN [ABATZ].[dbo].ArtUnidad AS au ON oferta.Unidad = au.Unidad and au.Articulo = articulo.Articulo
WHERE
	vigencia.Estatus = 'VIGENTE'
	AND ((vigencia.Referencia = 'OFERTAS ALMACEN' OR vigencia.Concepto = 'GENERAL' OR vigencia.Referencia = 'OFERTA MOSTRADOR Y SUPER' OR vigencia.Concepto = 'MOST Y SUP') 
	AND unidadReal.Unidad= oferta.Unidad AND unidadReal.Lista= '(Precio 3)') 
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

const BusquedaDeProductosConMostrador = `select * from (
	Select L.Articulo as id, L.Unidad as unidad, A.Descripcion1, A.Linea as clase, cb.Codigo,
	L.Precio as Precio, L.Lista as PrecioMostrador,	ArtE.Inventario as Inventario, A.Presentacion , ArtU.Factor, ArtM.Inventario as InvMostrador
	from ListaPreciosDUnidad L
	Join Art A ON A.Articulo = L.Articulo
	JOIN CB cb on cb.Cuenta = L.Articulo AND cb.Unidad = L.Unidad
	JOIN ArtExistenciaInv ArtE on L.Articulo = ArtE.Articulo and ArtE.Sucursal = 0
	JOIN ArtUnidad ArtU on ArtE.Articulo = ArtU.Articulo and L.Unidad = ArtU.Unidad
	LEFT JOIN ArtExistenciaInv ArtM on L.Articulo = ArtM.Articulo AND ArtM.Sucursal = 1
	where (L.Lista = '(Precio 3)' OR L.Lista = '(Precio Lista)') AND Not (A.Linea = 'FRUTYVERD') 
	And A.Estatus = 'ALTA' AND NOT A.Unidad = 'SERVICIO' 
	AND L.Unidad <> 'PUNTODEVENTA' 
	AND A.Grupo <> 'CIGARRO'
AND ((A.Familia='ACEITES') OR (A.Familia = 'LATERIA') OR (A.Grupo = 'MERMELADAS') OR (A.Familia='CHILES') OR (A.Grupo = 'BEB FRUTAS')
OR (A.Familia = 'SOLUBLES' AND L.Unidad <> 'SOBRE' AND L.Unidad <> 'PIEZA') OR (A.Familia ='ESPECIAS' AND A.Grupo <> 'CONSOMES') 
OR (A.Grupo = 'CONSOMES' AND L.Unidad <> 'PIEZA') OR ( A.Grupo = 'AGUA' AND L.Unidad <> 'BOTELLA')
OR (L.Unidad = 'CAJA') OR (L.Unidad = 'BULTO') OR (L.Unidad = 'CUBETA') OR (L.Unidad = 'EXHIBIDOR') 
OR (L.Unidad = 'TAMBO') OR (L.Unidad = 'CUBETA') OR (L.Unidad = 'LATA') OR (L.Unidad = 'FRASCOS') 
OR (L.Unidad = 'BARRA') OR (L.Unidad = 'PAQUETE' AND A.Familia <> 'TOALLAS') OR (L.Unidad = 'GARRAFON') OR (L.Unidad = 'TARRO') 
OR (L.Unidad = 'KG') OR (L.Unidad = 'TETRA') OR (L.Unidad = 'TETRA') OR (L.Unidad = 'BIDON') 
OR (L.Unidad = 'GALON') OR (L.Unidad = 'VITROLERO') OR (L.Unidad = 'BOTE') OR (L.Unidad = 'BOLSA') OR (L.Unidad = 'DOCENA'))
) AS SourceTable PIVOT(AVG ([Precio]) FOR [PrecioMostrador] IN ([(Precio 3)], [(Precio Lista)])) As PivotTable ORDER BY PivotTable.[(Precio Lista)];`;

let productosGlobales = [];

const GuardarProductos = async () => {
  let productos = [];
  let listaDeProductosExcluidos = [];
  await ProductosExcluidos.find({})
    .then((response) => {
      listaDeProductosExcluidos = response;
    })
    .catch((err) => {
      console.log(err);
    });
  try {
    const peticion = new Rq2(
      BusquedaDeProductosConMostrador,
      (err, rowCount) => {
        console.log("Numero de productos: " + rowCount);
      }
    );

    peticion.on("row", (columns) => {
      let producto = {};
      columns.forEach((column) => {
        let valor = column.value;
        if (valor !== null) {
          valor = valor.toString();
        }
        producto["" + column.metadata.colName.toLowerCase()] = valor;
      });
      let productoEsExcluido = ExisteProducto(
        listaDeProductosExcluidos,
        producto
      );
      if (productoEsExcluido.esExcluido) {
        producto["excluido"] = true;
        producto["unidadExcluida"] = productoEsExcluido.unidad;
      }
      productos.push(producto);
    });
    peticion.on("requestCompleted", () => {
      let archivoOfertas = fs.readFileSync("./base/ofertas.json", "utf-8");
      let ofertas = JSON.parse(archivoOfertas);
      console.log(ofertas.length);
      let productosConOfertas = productos;
      productosConOfertas = JuntarOfertasConProductos(productos, ofertas);
      productosGlobales = EnglobarProductos(productosConOfertas);
      let datosEnString = JSON.stringify(productosGlobales);
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
