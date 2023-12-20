import XLSX from "xlsx-populate";
import fs from "fs";

const CrearLibroAPartirDePlantilla = (productos) => {
  let veamos = XLSX.fromFileAsync("./excel/PedidoPlantilla.xlsx").then(
    (workbook) => {
      productos.map((producto, index) => {
        let indexActual = index + 2;
        let { codigo, id, descripcion, unidad, cantidad, precio } = producto;
        workbook
          .sheet("FORMATO")
          .cell("A" + indexActual)
          .value(parseInt(id));

        workbook
          .sheet("FORMATO")
          .cell("C" + indexActual)
          .value(descripcion);
        workbook
          .sheet("FORMATO")
          .cell("D" + indexActual)
          .value(unidad);
        workbook
          .sheet("FORMATO")
          .cell("E" + indexActual)
          .value(parseInt(cantidad));
        workbook
          .sheet("FORMATO")
          .cell("F" + indexActual)
          .value(parseFloat(precio));
      });
      return workbook.toFileAsync("./PedidoWebABATZ2023.xlsx");
    }
  );
  return veamos;
};
const ObtenerLibroAPartirDePlantilla = (productos) => {
  XLSX.fromFileAsync("./excel/PedidoPlantilla.xlsx").then((workbook) => {
    productos.map((producto, index) => {
      let indexActual = index + 2;
      let { codigo, id, descripcion, unidad, cantidad, precio } = producto;
      workbook
        .sheet("FORMATO")
        .cell("A" + indexActual)
        .value(parseInt(id));

      workbook
        .sheet("FORMATO")
        .cell("C" + indexActual)
        .value(descripcion);
      workbook
        .sheet("FORMATO")
        .cell("D" + indexActual)
        .value(unidad);
      workbook
        .sheet("FORMATO")
        .cell("E" + indexActual)
        .value(parseInt(cantidad));
      workbook
        .sheet("FORMATO")
        .cell("F" + indexActual)
        .value(parseFloat(precio));
    });
    return workbook.toFileAsync("./PedidoWebABATZ2023.xlsx");
  });
};
const ObtenerNuevoLibro = (res) => {
  XLSX.fromFileAsync("./PedidoAppABATZ2023.xlsx").then(async (workbook) => {
    const data = await workbook.outputAsync();
    res.attachment("PedidoAppABATZ2023.xlsx");
    res.send(data);
    fs.unlink("./PedidoAppABATZ2023.xlsx", (err) => {
      if (err) {
        console.log("Hubo un error al borrar el anterior archivo de pedido");
      }
    });
  });
};

const ObtenerLibro = (productos, res, nombre) => {
  console.log(nombre);
  let nombreSinEspacios = nombre.replaceAll(" ", "");
  let nombreDeArchivo = "PedidoWebABATZ2023" + nombreSinEspacios;
  XLSX.fromFileAsync("./excel/PedidoPlantilla.xlsx").then(async (workbook) => {
    productos.map((producto, index) => {
      let indexActual = index + 2;
      let {
        codigo,
        id,
        descripcion,
        unidad,
        cantidad,
        precio,
        precios,
        unidadSeleccionada,
        unidades,
      } = producto;
      workbook
        .sheet("FORMATO")
        .cell("A" + indexActual)
        .value(parseInt(id));

      if (Array.isArray(descripcion)) {
        workbook
          .sheet("FORMATO")
          .cell("C" + indexActual)
          .value(parseInt(cantidad));
        workbook
          .sheet("FORMATO")
          .cell("D" + indexActual)
          .value(unidades[unidadSeleccionada]);
        workbook
          .sheet("FORMATO")
          .cell("E" + indexActual)
          .value(parseFloat(precios[unidadSeleccionada]));
      } else {
        workbook
          .sheet("FORMATO")
          .cell("C" + indexActual)
          .value(parseInt(cantidad));
        workbook
          .sheet("FORMATO")
          .cell("D" + indexActual)
          .value(unidad);
        workbook
          .sheet("FORMATO")
          .cell("E" + indexActual)
          .value(parseFloat(precio));
      }
    });
    return workbook
      .toFileAsync("./" + nombreDeArchivo + ".xlsx")
      .then((err) => {
        if (err) {
          console.log("hubo un error al guardar el archivo");
        } else {
          XLSX.fromFileAsync("./" + nombreDeArchivo + ".xlsx").then(
            async (workbook) => {
              const data = await workbook.outputAsync();
              res.attachment(nombreDeArchivo + ".xlsx");
              res.send(data);
              fs.unlink("./" + nombreDeArchivo + ".xlsx", (err) => {
                if (err) {
                  console.log(err);
                }
              });
            }
          );
        }
      });
  });
};

export { ObtenerLibro };
