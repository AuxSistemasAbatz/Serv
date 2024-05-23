const crearFormatoDeTextoDeProducto = (producto) => {
  let {
    codigo,
    descripcion,
    unidades,
    precios,
    cantidad,
    precio,
    unidad,
    unidadSeleccionada,
  } = producto;
  let parrafoDeTexto;
  if (Array.isArray(descripcion)) {
    parrafoDeTexto = `Codigo: ${codigo}\nDescripcion de producto: \n${descripcion[unidadSeleccionada]}\nCantidad: ${cantidad} ${unidades[unidadSeleccionada]}\nPrecio: ${precios[unidadSeleccionada]}\n`;
  } else {
    parrafoDeTexto = `Codigo: ${codigo}\nDescripcion de producto: \n${
      Array.isArray(descripcion) ? descripcion[0] : descripcion
    }\nCantidad: ${cantidad} ${unidad}\nPrecio: ${precio}\n`;
  }
  return parrafoDeTexto;
};

const ObtenerListaDeProductosEnTexto = (listaDeProductos) => {
  let arrayCompleto = listaDeProductos.map((producto) =>
    crearFormatoDeTextoDeProducto(producto)
  );
  arrayCompleto = arrayCompleto.join(
    "\n-----------------------------------------\n\n"
  );
  return arrayCompleto;
};

const ObtenerTresInicialesDeProductos = (productos) => {
  let iniciales = "";
  let caracters = "ABCDEFGHIJKLMNOPQRSTU";
  let cont = 0;
  productos.map((producto) => {
    if (cont < 3) {
      if (Array.isArray(producto.descripcion)) {
        iniciales += producto.descripcion[0][0];
      } else {
        iniciales += producto.descripcion[0];
      }
      cont++;
    }
  });
  if (iniciales.length < 3) {
    let posicionAleatoria = Math.floor(Math.random() * caracters.length);
    iniciales += caracters.charAt(posicionAleatoria);
    if (iniciales.length < 3) {
      posicionAleatoria = Math.floor(Math.random() * caracters.length);
      iniciales += caracters.charAt(posicionAleatoria);
    }
  }
  return iniciales;
};

export const obtenerProductosSinLosDosDigitosSobrantes = (productos) => {
  let nuevosProductos = [];
  productos.map((producto) => {
    let nuevoProducto = {
      ...producto,
      id: producto.id.slice(0, producto.id.length - 2),
    };
    nuevosProductos.push(nuevoProducto);
  });
  return nuevosProductos;
};

export const ObtenerId = (productos, total) => {
  let fecha = new Date();
  let fechaEnMilisegundos = fecha.getUTCMilliseconds().toString();
  let parteDeMilisegundos = fechaEnMilisegundos.slice(
    fechaEnMilisegundos.length - 3,
    fechaEnMilisegundos.length
  );
  let dia = fecha.getDate().toString();
  let mes = fecha.getMonth() + 1;
  if (mes < 10) {
    mes = mes.toString();
    mes = "0" + mes;
  }
  let anno = fecha.getFullYear().toString();
  let dosDigitosDeAnno = anno.slice(anno.length - 2, anno.length);
  let stringDeFecha = dia + mes + dosDigitosDeAnno;
  let inicialesDeProductos = ObtenerTresInicialesDeProductos(productos);
  let idObtenido = inicialesDeProductos + stringDeFecha + parteDeMilisegundos;
  return idObtenido;
};

const EnglobarProductos = (arrayDeProductos) => {
  let nuevoArrayDeProductos = [];
  if (Array.isArray(arrayDeProductos)) {
    arrayDeProductos.map((producto) => {
      let productoYaAgregado = nuevoArrayDeProductos.findIndex(
        (prod) => prod.id === producto.id
      );
      if (productoYaAgregado === -1) {
        let nuevoProducto = {
          ...producto,
        };
        nuevoArrayDeProductos.push(nuevoProducto);
      } else {
        let indice = productoYaAgregado;
        let unidadEncontrada = Array.isArray(
          nuevoArrayDeProductos[indice].unidad
        )
          ? nuevoArrayDeProductos[indice].unidad.find(
              (unidad) => unidad === producto.unidad
            )
          : nuevoArrayDeProductos[indice].unidad === producto.unidad;
        if (!unidadEncontrada) {
          let unidadesEsArray = Array.isArray(
            nuevoArrayDeProductos[indice].unidad
          );
          let nuevasUnidades = unidadesEsArray
            ? [...nuevoArrayDeProductos[indice].unidad, producto.unidad]
            : [nuevoArrayDeProductos[indice].unidad, producto.unidad];
          let nuevosPrecios = unidadesEsArray
            ? [...nuevoArrayDeProductos[indice].precio, producto.precio]
            : [nuevoArrayDeProductos[indice].precio, producto.precio];
          let nuevosPreciosDeMostrador = unidadesEsArray
            ? [
                ...nuevoArrayDeProductos[indice].precioMostrador,
                producto.precioMostrador,
              ]
            : [
                nuevoArrayDeProductos[indice].precioMostrador,
                producto.precioMostrador,
              ];
          let nuevosFactores = unidadesEsArray
            ? [...nuevoArrayDeProductos[indice].factor, producto.factor]
            : [nuevoArrayDeProductos[indice].factor, producto.factor];
          let nuevoProductoActualizado = {
            ...nuevoArrayDeProductos[indice],
            unidad: nuevasUnidades,
            precio: nuevosPrecios,
            precioMostrador: nuevosPreciosDeMostrador,
            factor: nuevosFactores,
          };
          nuevoArrayDeProductos[indice] = nuevoProductoActualizado;
        }
      }
    });
  }
  return nuevoArrayDeProductos;
};

const ValidarSiExisteUnProducto = (arrayDeProductos, producto) => {
  let encontrado = false;
  if (Array.isArray(arrayDeProductos)) {
    arrayDeProductos.map((productoAnalizado) => {
      if (productoAnalizado.id === producto.id) {
        encontrado = true;
      }
    });
  }
  return encontrado;
};

const numeroEnteroAleatorio = (maximo) => {
  let numero = Math.floor(Math.random() * maximo);
  return numero;
};
const ObtenerProductosPorCategoria = (productosPorCategoria) => {
  let nuevosProductosAleatorios = [];
  if (Array.isArray(productosPorCategoria)) {
    let contador = 0;
    let maximo = productosPorCategoria.length;
    do {
      let indiceAleatorio = numeroEnteroAleatorio(
        productosPorCategoria.length - 1
      );
      let inventario = parseInt(
        productosPorCategoria[indiceAleatorio].inventario
      );
      let factor = parseInt(productosPorCategoria[indiceAleatorio].factor);
      let existencia = Math.floor(inventario / factor);
      if (existencia > 0) {
        if (
          !ValidarSiExisteUnProducto(
            nuevosProductosAleatorios,
            productosPorCategoria[indiceAleatorio]
          )
        ) {
          nuevosProductosAleatorios.push(
            productosPorCategoria[indiceAleatorio]
          );
        }
      }
      contador++;
    } while (nuevosProductosAleatorios.length < 10 && contador < maximo);
  }
  return nuevosProductosAleatorios;
};

const ActualizarTotalDeProductosDelCarrito = (carrito, productos) => {
  let total = 0;
  let ahorro = 0;
  let cantidadDeProductos = 0;
  let subtotal = 0;
  productos.forEach((producto) => {
    if (producto !== undefined) {
      let {
        precios,
        preciosMostrador,
        cantidad,
        unidadSeleccionada,
        unidadOferta,
        unidades,
        porcentaje,
      } = producto;
      let preciosActuales = precios;
      if (
        carrito.tipo === "sucursal" &&
        preciosMostrador !== undefined &&
        preciosMostrador.length > 0
      ) {
        preciosActuales = producto.preciosMostrador;
      }
      let precioActual = Array.isArray(preciosActuales)
        ? preciosActuales[unidadSeleccionada]
        : preciosActuales;
      let subtotalActual = parseFloat(precioActual) * parseFloat(cantidad);
      subtotal += subtotalActual;
      let ahorroActual = 0;
      if (
        unidadOferta === unidades[unidadSeleccionada] &&
        carrito.tipo !== "sucursal"
      ) {
        ahorroActual =
          parseFloat(precioActual) * (parseFloat(porcentaje) / 100) * cantidad;
      }
      ahorro += ahorroActual;
      total += subtotalActual - ahorroActual;
      cantidadDeProductos += 1;
    }
  });
  if (
    carrito.costoDeEnvio !== 0 &&
    carrito.costoDeEnvio !== undefined &&
    carrito.tipo !== "sucursal"
  ) {
    total += carrito.costoDeEnvio;
  }
  return {
    ...carrito,
    total,
    subtotal,
    ahorrado: ahorro,
    cantidadDeProductos,
    productos,
  };
};

const ObtenerPrecioSinDescuento = (precio) => {
  let nuevoPrecio = parseFloat(precio);
  let porcentaje = parseFloat(2 / 100);
  nuevoPrecio = nuevoPrecio + parseFloat(precio * porcentaje);
  let nuevoPrecioConFormato = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(nuevoPrecio);
  return nuevoPrecioConFormato;
};

const ObtenerPrecioConDescuento = (precio, porcentaje) => {
  const resultado = precio - (precio * porcentaje) / 100;
  return resultado.toFixed(2);
};

const ObtenerNuevasExistenciasDeUnProducto = (productos, productoBuscado) => {
  let productoEncontrado = {};
  if (Array.isArray(productos)) {
    productoEncontrado = productos.find(
      (producto) => producto.id === productoBuscado.linkDeImagen
    );
    if (productoEncontrado.inventario !== undefined) {
      return productoEncontrado.inventario;
    } else {
      return [];
    }
  }
};

const ObtenerProductoValidadoActual = (productos, productoActual) => {
  let productoEncontradoYActualizado = { ...productoActual, oferta: false };
  if (Array.isArray(productos)) {
    let indiceActual = 0;
    let ahorros = [];
    productos.map((producto) => {
      if (producto.id === productoActual.linkDeImagen) {
        productoEncontradoYActualizado.descripcion = producto.descripcion1;
        productoEncontradoYActualizado.unidades[indiceActual] = producto.unidad;
        productoEncontradoYActualizado.factor[indiceActual] = producto.factor;
        productoEncontradoYActualizado.precioSinDescuento[indiceActual] =
          producto.precio;
        productoEncontradoYActualizado.precios[indiceActual] = producto.precio;
        if (
          productoActual.unidades[productoActual.unidadSeleccionada] ===
          productoActual.unidad
        ) {
          producto.unidadSeleccionada = indiceActual;
        }
        if (producto.porcentaje !== "0") {
          productoEncontradoYActualizado.oferta = true;
          productoEncontradoYActualizado.porcentaje = producto.porcentaje;
          productoEncontradoYActualizado.unidadOferta = producto.unidadoferta;
          let precioEnNumero = parseFloat(producto.precio);
          let porcentajeEnNumero = parseFloat(producto.porcentaje);
          let ahorro = (precioEnNumero * porcentajeEnNumero) / 100;
          ahorros[indiceActual] = ahorro.toFixed(2).toString();
        } else {
          ahorros[indiceActual] = "0.00";
        }
        indiceActual = indiceActual + 1;
      }
    });
    productoEncontradoYActualizado.ahorro = ahorros;
    productoEncontradoYActualizado.unidad =
      productoEncontradoYActualizado.unidades[
        productoEncontradoYActualizado.unidadSeleccionada
      ];
    let unidadSeleccionada = productoEncontradoYActualizado.unidadSeleccionada;
    let unidadOferta = productoEncontradoYActualizado.unidadOferta;
    let unidades = productoEncontradoYActualizado.unidades;
    if (unidades[unidadSeleccionada] === unidadOferta) {
      let porcentaje = productoEncontradoYActualizado.porcentaje;
      let precioSinDescuento =
        productoEncontradoYActualizado.precioSinDescuento[unidadSeleccionada];
      productoEncontradoYActualizado.precio = ObtenerPrecioConDescuento(
        precioSinDescuento,
        porcentaje
      );
    } else {
      productoEncontradoYActualizado.precio =
        productoEncontradoYActualizado.precios[
          productoEncontradoYActualizado.unidadSeleccionada
        ];
    }
  }
  return productoEncontradoYActualizado;
};

const ObtenerProductoValidado = (productos, productoActual) => {
  let productoEncontradoYActualizado = { ...productoActual, oferta: false };
  let encontrado = false;
  if (Array.isArray(productos)) {
    let idDeProducto = productoEncontradoYActualizado.linkDeImagen;
    productos.map((producto, index) => {
      let cont = index;
      if (producto.id === idDeProducto) {
        encontrado = true;
        productoEncontradoYActualizado.unidad = producto.unidad;
        productoEncontradoYActualizado.precio = producto.precio;
        productoEncontradoYActualizado.precioMostrador =
          producto.precioMostrador;
        productoEncontradoYActualizado.invmostrador = producto.invmostrador;
        productoEncontradoYActualizado.inventario = producto.inventario;
        productoEncontradoYActualizado.factor = producto.factor;
        if (producto.unidadOferta !== null) {
          productoEncontradoYActualizado.unidadOferta = producto.unidadOferta;
          productoEncontradoYActualizado.porcentaje = producto.porcentaje;
          productoEncontradoYActualizado.oferta = true;
        }
      }
    });
    if (encontrado === true) {
      return productoEncontradoYActualizado;
    } else {
      return undefined;
    }
  } else {
    if (encontrado === false) {
      return undefined;
    }
  }
};

const JuntarOfertasConProductos = (productos, ofertas) => {
  const nuevosProductos = [];
  let contadorDeOfertas = 0;
  if (ofertas.length === 0) {
    return productos;
  }
  for (let cont = 0; cont < productos.length; cont++) {
    let {
      id,
      unidad,
      descripcion1,
      clase,
      codigo,
      inventario,
      presentacion,
      factor,
      excluido,
      unidadExcluida,
      invmostrador,
    } = productos[cont];
    let precio = productos[cont]["(precio 3)"];
    let precioMostrador = productos[cont]["(precio lista)"];
    let productoActual = {
      id,
      unidad,
      precio,
      descripcion1,
      clase,
      codigo,
      inventario,
      presentacion,
      factor,
      unidadoferta: null,
      porcentaje: "0",
      excluido,
      unidadExcluida,
      precioMostrador,
      invmostrador,
    };
    for (let cont2 = 0; cont2 < ofertas.length - 1; cont2++) {
      let variasUnidades = Array.isArray(productoActual.unidad);
      let unidades = variasUnidades ? [...productoActual.unidad] : [unidad];
      if (productoActual.id === ofertas[cont2].articulo) {
        contadorDeOfertas++;
        productoActual.unidadoferta = ofertas[cont2].unidad;
        productoActual.porcentaje = ofertas[cont2].porcentaje;
        break;
      }
    }
    nuevosProductos.push(productoActual);
  }
  console.log("Ofertas encontradas: " + contadorDeOfertas);
  return nuevosProductos;
};

const ObtenerFechaFormateada = (fecha) => {
  let diaObtenido = fecha.getDate();
  let mesObtenido = fecha.getMonth();
  let anno = fecha.getFullYear();
  let diaEnFormato =
    diaObtenido < 10 ? "0" + diaObtenido : diaObtenido.toString();
  let mesEnFormato =
    mesObtenido < 10 ? "0" + mesObtenido : mesObtenido.toString();
  return diaEnFormato + "/" + mesEnFormato + "/" + anno;
};

const ExisteProducto = (productos, producto) => {
  let { id, unidad } = producto;
  if (Array.isArray(productos) && productos.length > 0) {
    let productoEncontrado = productos.find(
      (producto) => producto.item === id && producto.unidad === unidad
    );
    if (productoEncontrado !== undefined) {
      return { esExcluido: true, unidad: productoEncontrado.unidad };
    } else {
      return { esExcluido: false, unidad: "" };
    }
  } else {
    return { esExcluido: false, unidad: "" };
  }
};
const OrdenarArrayAleatoriamente = (array) => {
  let arrayOrdenadoAleatoriamente = array.sort((a, b) => {
    let numeroAleatorio = Math.floor(Math.random() * 2) - 1;
    return numeroAleatorio;
  });
  return arrayOrdenadoAleatoriamente;
};

const ObtenerSubClasesDeUnaClase = (clase) => {
  if (clase === "dulcesybotanas") {
    return ["botanaagranel", "dulces", "galletas"];
  } else if (clase === "cuidadopersonal") {
    return ["perfumeria", "jabondetocador"];
  } else if (clase === "lacteos") {
    return ["lacteos"];
  } else if (clase === "mascotas") {
    return ["alimanima"];
  } else if (clase === "salchichoneria") {
    return ["carnesfrias"];
  } else if (clase === "bebidas") {
    return ["bebidasalcoholicas", "bebidas", "solubles", "jugos"];
  } else if (clase === "farmacia") {
    return ["medicament"];
  } else if (clase === "veladoras") {
    return ["veladoras"];
  } else if (clase === "limpieza") {
    return ["articulosdelimpieza", "detergente"];
  } else if (clase === "basicosdelhogar") {
    return [
      "aceites",
      "especias",
      "basicos",
      "pan",
      "desechable",
      "postres",
      "enlatados",
      "sopas",
      "cereales",
      "accesorios",
      "chiles",
      "granel",
    ];
  }
};

const removerAcentos = (palabra) => {
  let nuevaPalabra = palabra.replace(new RegExp(/[ùúûü]/g), "u");
  nuevaPalabra = nuevaPalabra.replace(new RegExp(/[àáâãäå]/g), "a");
  nuevaPalabra = nuevaPalabra.replace(new RegExp(/[èéêë]/g), "e");
  nuevaPalabra = nuevaPalabra.replace(new RegExp(/[ìíîï]/g), "i");
  nuevaPalabra = nuevaPalabra.replace(new RegExp(/[òóôõö]/g), "o");

  return nuevaPalabra;
};

const SeparaProductosPorTipo = (productos) => {
  let productosDeRuta = [];
  let productosDePuntoDeVenta = [];
  productos.map((producto) => {
    if (producto.presentacion === "RUTA") {
      productosDeRuta.push(producto);
    } else {
      productosDePuntoDeVenta.push(producto);
    }
  });
  const productosSeparadosPorTipo = {
    productosDeRuta,
    productosDePuntoDeVenta,
  };
  return productosSeparadosPorTipo;
};

const SepararProductosConExistenciaYSinExistencia = (productos) => {
  let productosConExistencia = [];
  let productosSinExistencia = [];
  productos.map((producto) => {
    let inventario = parseFloat(producto.inventario);
    let factor = 1;
    if (Array.isArray(producto.factor)) {
      factor = parseFloat(producto.factor[0]);
    } else {
      factor = parseFloat(producto.factor);
    }
    let existencia = inventario / factor;
    if (existencia >= 1) {
      productosConExistencia.push(producto);
    } else {
      productosSinExistencia.push(producto);
    }
  });
  const productosSeparadosPorExistencia = {
    productosConExistencia,
    productosSinExistencia,
  };

  return productosSeparadosPorExistencia;
};

const OrdernarProductosPorPrecio = (arrayDeProductos) => {
  let nuevoArrayOrdenado = arrayDeProductos.sort((a, b) => {
    let precioUno = 0;
    let precioDos = 0;
    let unidadPrincipalA = 0;
    let unidadPrincipalB = 0;
    if (a.unidadExcluida) {
      unidadPrincipalA = 1;
    }
    if (b.unidadExcluida) {
      unidadPrincipalB = 1;
    }
    if (Array.isArray(a.precio)) {
      precioUno = a.precio[unidadPrincipalA];
    } else {
      precioUno = a.precio;
    }
    if (Array.isArray(b.precio)) {
      precioDos = b.precio[unidadPrincipalB];
    } else {
      precioDos = b.precio;
    }
    return precioUno - precioDos;
  });
  return nuevoArrayOrdenado;
};

const ObtenerProductosYOfertasOrdenadas = (productos) => {
  let { productosDeRuta, productosDePuntoDeVenta } =
    SeparaProductosPorTipo(productos);
  let productosDePuntoDeVentaSeparadosPorExistencia =
    SepararProductosConExistenciaYSinExistencia(productosDePuntoDeVenta);
  let productosDePuntoDeVentaConExistencia =
    productosDePuntoDeVentaSeparadosPorExistencia.productosConExistencia;
  let { productosConExistencia, productosSinExistencia } =
    SepararProductosConExistenciaYSinExistencia(productosDeRuta);
  let productosSinExistenciaGenerales = productosSinExistencia.concat(
    productosDePuntoDeVentaSeparadosPorExistencia.productosSinExistencia
  );
  let productosDePuntoDeVentaOrdenadosPorPrecio = OrdernarProductosPorPrecio(
    productosDePuntoDeVentaConExistencia
  );
  let productosEnglobados = productosConExistencia;
  let productosSinExistenciaOrdenadosPorPrecio = OrdernarProductosPorPrecio(
    productosSinExistenciaGenerales
  );
  let productosDeRutaYPuntoDeVenta = productosEnglobados.concat(
    productosDePuntoDeVentaOrdenadosPorPrecio
  );
  let productosOrdenados = productosDeRutaYPuntoDeVenta.concat(
    productosSinExistenciaOrdenadosPorPrecio
  );
  return productosOrdenados;
};

export default ObtenerListaDeProductosEnTexto;

export {
  EnglobarProductos,
  ValidarSiExisteUnProducto,
  ObtenerProductosPorCategoria,
  ObtenerNuevasExistenciasDeUnProducto,
  ActualizarTotalDeProductosDelCarrito,
  JuntarOfertasConProductos,
  ObtenerFechaFormateada,
  ExisteProducto,
  ObtenerProductoValidadoActual,
  ObtenerProductoValidado,
  ObtenerSubClasesDeUnaClase,
  removerAcentos,
  OrdenarArrayAleatoriamente,
  ObtenerProductosYOfertasOrdenadas,
};
