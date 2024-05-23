import XLSX from "xlsx-populate";

const CrearLibroDeProductosSinImagen = (productos, res) => {
  XLSX.fromBlankAsync().then(async (workbook) => {
    workbook.sheet(0).name("Productos");
    workbook.sheet(0).cell("A1").value("Item");
    workbook.sheet(0).cell("B1").value("Descripcion");
    productos.map((producto, index) => {
      let indexActual = index + 2;
      let { item, descripcion } = producto;
      workbook
        .sheet(0)
        .cell("A" + indexActual)
        .value(item);
      workbook
        .sheet(0)
        .cell("B" + indexActual)
        .value(descripcion);
    });
    const CrearFormatoDeLibro = await workbook.outputAsync();
    res.status(200).send(CrearFormatoDeLibro);
  });
};

export { CrearLibroDeProductosSinImagen };
