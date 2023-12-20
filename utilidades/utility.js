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
  arrayDeProductos.forEach((producto) => {
    let idDelProducto = producto.id;
    if (nuevoArrayDeProductos.length > 1) {
      let seEncontroProducto = false;
      let indiceDondeSeEncontro = 0;
      nuevoArrayDeProductos.forEach((productoYaAgregado, indice) => {
        if (productoYaAgregado.id.includes(idDelProducto)) {
          seEncontroProducto = true;
          indiceDondeSeEncontro = indice;
        }
      });
      if (seEncontroProducto) {
        let descripcion =
          nuevoArrayDeProductos[indiceDondeSeEncontro].desc_prod;
        let unidad = nuevoArrayDeProductos[indiceDondeSeEncontro].unidad;
        let precio = nuevoArrayDeProductos[indiceDondeSeEncontro].precio;
        let factor = nuevoArrayDeProductos[indiceDondeSeEncontro].factor;
        let unidadYaAgregada = false;
        if (Array.isArray(unidad)) {
          for (let cont = 0; cont < unidad.length; cont++) {
            if (producto.unidad === unidad[cont]) {
              unidadYaAgregada = true;
            }
          }
        } else {
          if (producto.unidad === unidad) {
            unidadYaAgregada = true;
          }
        }
        if (!unidadYaAgregada) {
          if (Array.isArray(descripcion)) {
            nuevoArrayDeProductos[indiceDondeSeEncontro].desc_prod = [
              ...descripcion,
              producto.desc_prod,
            ];
          } else {
            nuevoArrayDeProductos[indiceDondeSeEncontro].desc_prod = [
              descripcion,
              producto.desc_prod,
            ];
          }
          if (Array.isArray(unidad)) {
            nuevoArrayDeProductos[indiceDondeSeEncontro].unidad = [
              ...unidad,
              producto.unidad,
            ];
          } else {
            nuevoArrayDeProductos[indiceDondeSeEncontro].unidad = [
              unidad,
              producto.unidad,
            ];
          }
          if (Array.isArray(precio)) {
            nuevoArrayDeProductos[indiceDondeSeEncontro].precio = [
              ...precio,
              producto.precio,
            ];
          } else {
            nuevoArrayDeProductos[indiceDondeSeEncontro].precio = [
              precio,
              producto.precio,
            ];
          }
          if (Array.isArray(factor)) {
            nuevoArrayDeProductos[indiceDondeSeEncontro].factor = [
              ...factor,
              producto.factor,
            ];
          } else {
            nuevoArrayDeProductos[indiceDondeSeEncontro].factor = [
              factor,
              producto.factor,
            ];
          }
        }
      } else {
        nuevoArrayDeProductos.push(producto);
      }
    } else {
      nuevoArrayDeProductos.push(producto);
    }
  });
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

const ActualizarTotalDeProductosDelCarrito = (
  ArrayDeProductos,
  idDelCarrito,
  mostrarCarrito,
  tipo
) => {
  let total = 0;
  let ahorrado = 0;
  let cantidadDeProductos = 0;
  let mostrarCarritoAnt = mostrarCarrito;
  for (let cont = 0; cont < ArrayDeProductos.length; cont++) {
    cantidadDeProductos++;
    let unidadActual = ArrayDeProductos[cont].unidadSeleccionada;
    let ofertaActual = ArrayDeProductos[cont].oferta;
    let ahorroActual = Array.isArray(ArrayDeProductos[cont].ahorro)
      ? ArrayDeProductos[cont].ahorro[unidadActual]
      : ArrayDeProductos[cont].ahorro;
    let cantidadActual = ArrayDeProductos[cont].cantidad;
    let precioActual = 0;
    if (ofertaActual) {
      let porcentaje = ArrayDeProductos[cont].porcentaje;
      precioActual = Array.isArray(ArrayDeProductos[cont].precios)
        ? ObtenerPrecioConDescuento(
            ArrayDeProductos[cont].precios[unidadActual],
            porcentaje
          )
        : ObtenerPrecioConDescuento(ArrayDeProductos[cont].precio, porcentaje);
    } else {
      precioActual = Array.isArray(ArrayDeProductos[cont].precios)
        ? ArrayDeProductos[cont].precios[unidadActual]
        : ArrayDeProductos[cont].precio;
    }
    precioActual = Array.isArray(ArrayDeProductos[cont].precios)
      ? ArrayDeProductos[cont].precios[unidadActual]
      : ArrayDeProductos[cont].precio;
    total = total + precioActual * cantidadActual;
    if (ofertaActual) {
      ahorrado = ahorrado + ahorroActual * cantidadActual;
    }
  }
  let ArrayOrdenado = ArrayDeProductos.sort((a, b) => {
    let idA = parseInt(a.id);
    let idB = parseInt(b.id);
    if (idA < idB) {
      return -1;
    }
    if (idA === idB) {
      return 0;
    }
    if (idA > idB) {
      return 1;
    }
  });
  let carritoADevolver = {
    total: total,
    ahorrado: ahorrado,
    productos: [...ArrayOrdenado],
    idDeCompra: idDelCarrito,
    cantidadDeProductos: cantidadDeProductos,
    mostrarCarrito: mostrarCarritoAnt,
    tipo: tipo,
  };
  return carritoADevolver;
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
      precio,
      descripcion1,
      clase,
      codigo,
      inventario,
      presentacion,
      factor,
    } = productos[cont];
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
    };
    for (let cont2 = 0; cont2 < ofertas.length - 1; cont2++) {
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

export default ObtenerListaDeProductosEnTexto;

export {
  EnglobarProductos,
  ValidarSiExisteUnProducto,
  ObtenerProductosPorCategoria,
  ObtenerNuevasExistenciasDeUnProducto,
  ActualizarTotalDeProductosDelCarrito,
  JuntarOfertasConProductos,
  ObtenerFechaFormateada,
};
