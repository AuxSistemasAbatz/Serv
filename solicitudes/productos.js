import { obtenerProductosDeArchivo } from "../solicitudes.js";
import ActualizarArchivos from "../base/ActualizacionDeArchivos.js";
import fs from "fs";
import {
  ObtenerProductosYOfertasOrdenadas,
  ObtenerSubClasesDeUnaClase,
  OrdenarArrayAleatoriamente,
  removerAcentos,
} from "../utilidades/utility.js";
import cjson from "compressed-json";

const ObtenerProductosDeVariable = (req, res) => {
  obtenerProductosDeArchivo(req, res);
};

const ObtenerHojaDeProductos = (req, res) => {
  let { cantidad, pagina, categorias } = req.body;
  const data = fs.readFileSync("./base/productos.json", "utf-8");
  let productosDescromprimidos = JSON.parse(data);
  let productosAEntregar = [];
  let categoriasAFiltrar = [];
  let productosPorCategoria = productosDescromprimidos;
  if (categorias.length > 0) {
    categorias.map((categoria) => {
      let categoriaFormateada = categoria.toLowerCase().replaceAll(" ", "");
      categoriaFormateada = removerAcentos(categoriaFormateada);
      let subCategorias = ObtenerSubClasesDeUnaClase(categoriaFormateada);
      categoriasAFiltrar = [...categoriasAFiltrar, ...subCategorias];
    });
    productosPorCategoria = productosDescromprimidos.filter((producto) => {
      let categoria = producto.clase.toLowerCase().replaceAll(" ", "");
      categoria = removerAcentos(categoria);
      return categoriasAFiltrar.includes(categoria);
    });
  }
  if (productosDescromprimidos) {
    for (
      let comienzo = cantidad * (pagina - 1);
      comienzo < productosPorCategoria.length && comienzo < cantidad * pagina;
      comienzo++
    ) {
      if (comienzo >= productosDescromprimidos.length) {
        break;
      } else {
        productosAEntregar.push(productosPorCategoria[comienzo]);
      }
    }
    res.send({ productos: productosAEntregar, estatus: "ok" });
  } else {
    res.send({ productos: [], estatus: "error" });
  }
};

const ActualizarLasOfertas = (req, res) => {
  console.log("Actualizando ofertas");
  ActualizarArchivos(true);
  res.send("ok");
};

const ObtenerCantidadDeParteProductos = (req, res) => {
  let { categorias, cantidad, inicio, ofertas } = req.body;
  inicio = cantidad = parseInt(cantidad);
  inicio = parseInt(inicio);
  const data = fs.readFileSync("./base/productos.json", "utf-8");
  let productosDescromprimidos = JSON.parse(data);
  if (ofertas) {
    productosDescromprimidos = productosDescromprimidos.filter(
      (producto) => producto.unidadoferta !== null
    );
  }
  let productosFiltradosPorCategoria = [];
  let productosAEntregar = [];
  if (categorias === "all") {
    productosFiltradosPorCategoria = productosDescromprimidos;
  } else {
    let subCategorias = [];
    categorias.map((categoria) => {
      let categoriaFormateada = categoria.toLowerCase().replaceAll(" ", "");
      categoriaFormateada = removerAcentos(categoriaFormateada);
      subCategorias = [
        ...subCategorias,
        ...ObtenerSubClasesDeUnaClase(categoriaFormateada),
      ];
    });
    productosFiltradosPorCategoria = productosDescromprimidos.filter(
      (producto) => {
        let categoria = producto.clase.toLowerCase().replaceAll(" ", "");
        categoria = removerAcentos(categoria);
        return subCategorias.includes(categoria);
      }
    );
  }
  if (inicio && cantidad) {
    for (
      let comienzo = inicio;
      comienzo < productosFiltradosPorCategoria.length &&
      comienzo < cantidad + inicio;
      comienzo++
    ) {
      if (comienzo >= productosDescromprimidos.length) {
        break;
      } else {
        productosAEntregar.push(productosFiltradosPorCategoria[comienzo]);
      }
    }
    res.send({ productos: productosAEntregar, estatus: "ok" });
  } else {
    res.send({ productos: productosFiltradosPorCategoria, estatus: "ok" });
  }
};

const ObtenerProductosDeVariableConCategoria = (req, res) => {
  let categoria = req.params.categoria;
  let categoriaReal = "";
  switch (categoria) {
    case "basicos":
      categoriaReal = "basicosdelhogar";
      break;
    case "bebidas":
      categoriaReal = "bebidas";
      break;
    case "cuidado":
      categoriaReal = "cuidadopersonal";
      break;
    case "dulces":
      categoriaReal = "dulcesybotanas";
      break;
    case "farmacia":
      categoriaReal = "farmacia";
      break;
    case "lacteos":
      categoriaReal = "lacteos";
      break;
    case "limpieza":
      categoriaReal = "limpieza";
      break;
    case "mascotas":
      categoriaReal = "mascotas";
      break;
    case "veladoras":
      categoriaReal = "veladoras";
      break;
    case "ofertas":
      categoriaReal = "all";
      break;
    default:
      categoriaReal = "all";
      break;
  }
  let subCategorias = [];
  if (categoriaReal !== "all") {
    subCategorias = ObtenerSubClasesDeUnaClase(categoriaReal);
  }
  const data = fs.readFileSync("./base/productos.json", "utf-8");
  let productosDescromprimidos = JSON.parse(data);
  let productosAEntregar = [];
  if (productosDescromprimidos) {
    productosAEntregar = productosDescromprimidos.filter((producto) => {
      let categoriaProducto = producto.clase.toLowerCase().replaceAll(" ", "");
      categoriaProducto = removerAcentos(categoriaProducto);
      if (categoria === "ofertas") {
        return producto.porcentaje !== "0";
      }
      return subCategorias.includes(categoriaProducto);
    });
    productosAEntregar = ObtenerProductosYOfertasOrdenadas(productosAEntregar);
    const productosCromprimidos = cjson.compress(productosAEntregar);

    res.send({ productos: productosCromprimidos, estatus: "ok" });
  } else {
    res.send({ productos: [], estatus: "error" });
  }
};
const ObtenerInformacionDeProductos = (req, res) => {
  let { lista } = req.body;
  let listaDeIdsDeProductos = lista;
  const data = fs.readFileSync("./base/productos.json", "utf-8");
  let productosDescromprimidos = JSON.parse(data);
  let productosAEntregar = [];
  productosDescromprimidos.map((producto) => {
    if (listaDeIdsDeProductos.includes(producto.id)) {
      productosAEntregar.push(producto);
    }
  });
  res.send({ productos: productosAEntregar, estatus: "ok" });
};

export {
  ObtenerProductosDeVariable,
  ActualizarLasOfertas,
  ObtenerHojaDeProductos,
  ObtenerCantidadDeParteProductos,
  ObtenerProductosDeVariableConCategoria,
  ObtenerInformacionDeProductos,
};
