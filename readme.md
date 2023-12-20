# Servidor principal de pagina web de Abatz
Este servidor hecho con nodejs nos permite obtener la informacion y conexiones con bases de datos para proveer el servicio de la pagina web.

## Dependencias:
El servidor tiene las siguientes dependencias:
- @emailjs/nodejs: nos permite conectar con la api de emailjs para permitirnos enviar correos.
- axios: nos permite hacer solicitudes a otros servidores.
- compressed-json: nos permite comprimir nuestros productos para hacer del envio del json mucho mas eficiente.
- cors: evita que se pueda utilizar el servidor desde lugares no autorizados.
- dotenv: nos ayuda a obtener las claves secretas del archivo .env.
- express: nos ayuda a crear un servidor de forma mas sencilla y directa.
- mongodb: Lo necesitamos para una conexion con mongodb.
- mongoose: nos provee de funciones para hacer sencillo el manejo de las bases de datos mongo.
- multer: nos permite obtener imagenes enviadas en una solicitud.
- mysql: nos permite crear una conexion con mysql.
- qr-image: nos permite crear una imagen a partir de un codigo qr.
- qrcode-terminal: nos presenta un qr en la terminal.
- stripe: nos provee de un metodo seguro junto con metodos para validacion de pagos.
- tedious: ayuda a crear una conexion segura con mysql server.
- whatsapp-web.js: permite crear una conexion con whatsapp para realizar envio de mensajes.
- xlsx-populate: nos permite crear, manejar y guardar excel para las consultas necesarias.

Otras dependencias:
- nodemon: nos permite realizar un reinicio del servidor cada vez que guardamos cambios.


## Estructura
Dentro de la estructura de nuestro proyecto nos encontramos con diferentes secciones y archivos. Los que se encuentran en este directorio seran presentados en este archivo pero los que estan dentro de carpetas tendran su propio readme dentro de ellas.

### Archivos y funciones:

##### index.js
Archivo que hace uso de express para crear el servidor. 
Necesita de las dependencias: express, cors, morgan, bodyParser, axios y multer.

El puerto lo obtiene de una variable de entorno la cual esta especificada en el archivo ".env". Tambien obtiene algunas mas del mismo archivo como la lista de dominios permitidos de cors.

En el tambien encontraras las rutas del servidor que permiten entregar y obtener informacion, estas solamente hacen llamado de una funcion que se encuentra en el archivo *solicitudes.js*. Dichas rutas son las siguientes:
- /pagar: permite validar el pago pero solo con componente cardelement de stripe.
- /pagarv2: permite validar un pago con el componente payment element que es mas completo.
- /EnviarEmail: permite enviar un email haciendo uso de emailjs.
- /agregarProductoSinImagen: permite agregar productos sin imagenes a la base de datos mongoDB.
- /realizarpedido: permite enviar pedidos por whatsapp cuando se esta conectado y tambien agregarlos a la base de datos de mongoDB.
- /obtenerProductosSinImagen: devuelve una lista de productos que no tienen imagen.
- /pedirId: te permite obtener un id para el pedido.
- /ofertas: Obtiene las ofertas de la base de datos.
- /productos: Obtiene los productos de la base de datos.
- /obtenerPedidos: obtiene los pedidos de la base de datos mongo.
- /obtenerPedido: permite obtener un pedido en especifico.
- /imagenDeQr: permite obtener una imagen del qr para iniciar sesion en whatsapp.
- /ping: permite hacer un ping al servidor para revisar que este funcionando.
- /obtenerExcel: te entrega el excel de un pedido en concreto.
- /validarUsuario: valida un usuario del panel de control.
- /crearVacante: permite crear una vacante en la base de datos mongo.
- /modificarVacante: permite modificar una vacante en la base de datos mongo.
- /eliminarVacante: permite eliminar una vacante en la base de datos mongo.
- /obtenerTodasLasVacantes: permite obtener la lista de vacantes guardadas en la base de datos mongo.
- /subirImagen: permite subir una imagen para la vacante pero actualmente esta en desuso porque el alojamiento que tenemos no permite guardar archivos.
- /imagenes/:id : permite obtener una imagen guardada en el servidor dependiendo de un nombre llamado id.
- /eliminarProductoSinImagen: permite eliminar un producto sin imagen. 
- /obtenerOfertasDeArchivo: permite obtener ofertas de un archivo tipo json que se guarda cada 30 min de todas las ofertas obtenidas del sistema. Esto permite que nuestra base de datos no se exponga a la gran carga de consultas sql que podria requerir en produccion.
- /obtenerProductosDeArchivo: permite obtener productos de un archivo tipo json que se guarda cada 30 min de todas los productos obtenidos del sistema. Esto permite que nuestra base de datos no se exponga a la gran carga de consultas sql que podria requerir en produccion.

Al final nos encontramos con el *App.listen* que se encarga de montar el servidor en un puerto en especifico. Tambien tenemos algunos metodos que obtenemos para conectar en cuanto se inicia el servidor con nuestras bases de datos donde:

- La funcion *conectar* se encarga de conectar con la base de pedidos.
- La funcion *conectarConUsuarios* se encarga de conectar con la base de usuarios del panel de control.
- La funcion *conectarConVacantes* se encarga de conectar con la base de vacantes.
- La funcion *conectarConProductos* se encarga de conectar con la base de productos que no tienen imagen.

Al final tenemos una funcion que nos permite mantener el servidor encendido ya que este se llama a si mismo cada 5 min para revisar que esta funcionando.

##### solicitudes.js
