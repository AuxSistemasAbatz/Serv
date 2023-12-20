import { Connection, Request } from "tedious";
const Rq = Request;
let productos = [];
import cjson from "compressed-json";

const ObtenerConsulta = (categoria) => {
  let consultaBase = `select lpd.Lista, lpd.Articulo as id, lpd.Unidad as unidad,lpd.Precio as precio, a.Descripcion1 as desc_prod, a.Linea as clase, cb.Codigo, Inventario, ArtU.Factor from 
ListaPreciosDUnidad lpd 
join Art a on a.Articulo = lpd.Articulo join CB cb on cb.Cuenta = lpd.Articulo and cb.Unidad = lpd.Unidad
join ArtExistenciaInv ArtE on lpd.Articulo = ArtE.Articulo and ArtE.Sucursal = 0
join ArtUnidad ArtU on ArtE.Articulo = ArtU.Articulo and lpd.Unidad = ArtU.Unidad
where Lista = '(precio 3)' AND a.Estatus = 'ALTA' and a.Tipo <> 'SERVICIO' AND a.Linea <> 'null' AND a.Linea <> 'FRUTYVERD' AND a.Linea = '${categoria}' ORDER BY precio`;
  return consultaBase;
};

const ObtenerConsultaDeProductos = () => {
  let consultaBase = `select lpd.Lista, lpd.Articulo as id, lpd.Unidad as unidad,lpd.Precio as precio, a.Descripcion1 as desc_prod, a.Linea as clase, cb.Codigo, Inventario, a.Presentacion , ArtU.Factor from 
ListaPreciosDUnidad lpd 
join Art a on a.Articulo = lpd.Articulo join CB cb on cb.Cuenta = lpd.Articulo and cb.Unidad = lpd.Unidad
join ArtExistenciaInv ArtE on lpd.Articulo = ArtE.Articulo and ArtE.Sucursal = 0
join ArtUnidad ArtU on ArtE.Articulo = ArtU.Articulo and lpd.Unidad = ArtU.Unidad
where Lista = '(precio 3)' AND a.Estatus = 'ALTA' and a.Tipo <> 'SERVICIO' ORDER BY precio`;
  return consultaBase;
};

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

const ofertas = (req, res) => {
  const buscarAlgo = () => {
    productos = [];
    const peticion = new Rq(busqueda, (err, rowCount) => {
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
      let productosComprimidos = cjson.compress.toString(productos);
      res.status(202).send(productosComprimidos);
      conexionDeOfertas.close();
    });
    conexionDeOfertas.execSql(peticion);
  };

  const conexionDeOfertas = new Connection(config);
  conexionDeOfertas.on("connect", (err) => {
    if (err) {
      console.log("No se pudo conectar", err);
    } else {
      console.log("conectado");
      buscarAlgo();
    }
  });

  conexionDeOfertas.connect();
};

const obtenerProductos = (req, res) => {
  console.log("pidieron productos");
  const buscarAlgo = () => {
    productos = [];
    const peticion = new Rq(ObtenerConsultaDeProductos(), (err, rowCount) => {
      console.log(rowCount);
    });

    peticion.on("row", (columns) => {
      let producto = {};
      columns.forEach((column) => {
        let tipoDeValor = typeof column.value;
        let valor =
          tipoDeValor === "number" ? column.value.toString() : column.value;
        switch (column.metadata.colName) {
          case "Descripcion1":
            producto["desc_prod"] = valor;
            break;
          default:
            producto["" + column.metadata.colName.toLowerCase()] = valor;
        }
      });
      productos.push(producto);
    });
    peticion.on("requestCompleted", () => {
      let productosComprimidos = cjson.compress.toString(productos);
      res.status(202).send(productosComprimidos);
      conexion.close();
    });
    conexion.execSql(peticion);
  };

  const conexion = new Connection(config);
  conexion.on("connect", (err) => {
    if (err) {
      console.log("No se pudo conectar", err);
    } else {
      console.log("conectado");
      buscarAlgo();
    }
  });

  conexion.connect();
};

export { obtenerProductos, ofertas };
