//DEPENDENCIAS
const express = require("express");
//DEPENDENCIAS PARA WEBSOCKETS
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
//DEPENDENCIA PARA ROUTER DE PLANTILLA DE LOGIN================================
const plantillaLogin = require("./web/login")
//DEPENDENCIA PARA PLANTILLA INDEX
const plantillaIndex = require("./web/index")
//DEPENDENCIA PARA ROUTER DE PLANTILLA USUARIO-DESLOG==========================
const platillaUserDeslog = require("./web/usuario-deslog")
//DEPENDENCIA PARA SESSIONES EN MONGO=================================
const connectSession = require("./conection/conectionMongo/config/config-connect-mongo")
//DEPENDENCIA DE MONGO================================================
//configuracion
const configConectionMongo = require("./conection/conectionMongo/config/configMongo")
//import daos de mongo
const mensajesMongo = require("./conection/conectionMongo/daos/mensajesMongoDaos");
const productosMongo = require("./conection/conectionMongo/daos/productosMongoDaos");
//DEPENDENCIAS DE FIREBASE===========================================
const mensajesFireBase = require("./conection/conectionFireBase/daos/mensajesFireDaos")
//import daos de firebase
const productosFireBase = require("./conection/conectionFireBase/daos/productosFireDaos")
//DEPENDENCIA PARA TRABAJAR CON MOOKS================================
const faker = require("faker");
faker.locale = "es";
const { commerce, image } = faker;

//DEPENDENCIAS PARA NORMALIZAR Y NORMALIZAR==========================
const {normalizeFormat, denormalizeFormat} = require("./normalizee/normalizeFormat");
//DEPENDENCIAS DAOS DE FILE SISTEM===================================
const mensajesFs = require("./conection/conectionFs/daos/mensajesFs");
const productosFs = require("./conection/conectionFs/daos/productosFs");

//instancia de clases
const mensajesFile = new mensajesFs();
const productosFile = new productosFs();

//MONGO==============================================================
//estableciendo conección con su configuración
configConectionMongo()
//istancia de clases
const mensajesMongo_ = new mensajesMongo
const productosMongo_ = new productosMongo
//FIRE BASE===========================================================
//instancias de clases
const mensajesFireBase_ = new mensajesFireBase
const productosFireBase_ = new productosFireBase
//necesarios para el servidor=========================================
const app = express();
const puerto = 8080;
//====================================================================
//configuración de sockets
const htmlserver = new HttpServer(app);
const io = new IOServer(htmlserver);
//====================================================================

//se levanta el servidor
const server = htmlserver.listen(puerto, () => {
  console.log(
    `Servidor levantado con exito en puerto: ${server.address().port}`
  );
});
//====================================================================
app.use(express.json());
//para usar post y put con html
app.use(express.urlencoded({ extended: true }));
//para usar la plantilla index html
app.use(express.static('public'))
//para el connect-mongo(de config)
app.use(connectSession())
//para los motores de plantillas
app.set("views", __dirname + "/web/views");
app.set("view engine", "ejs");
//plantilla index
app.use(plantillaIndex)
//para usar route login
app.use(plantillaLogin)
//para usar route usuario-deslog
app.use(platillaUserDeslog)

//=====================================================================
//conección de sockets
io.on("connection", async (socket) => {
  console.log("\nCliente conectado");
  const listProd = await productosFile.getAll();
  socket.emit("canalProductos", listProd);

  socket.on("nuevoProducto", async (prod) => {
    const prdInMongo = await productosMongo_.savee(prod)
    await productosFireBase_.saveeFb(prod, prdInMongo)
    await productosFile.save({id: prdInMongo,...prod});
    io.sockets.emit("actualizacionPrd", prod);
  });
  //APARTADO DE MENSAJES
  const listMessage = await mensajesFile.getAll();
  if (listMessage.length > 0) {
    const recivoMensajeNormalizo_1 = await normalizeFormat(listMessage);
    const recivoMensajeDenormalizo_1 = await denormalizeFormat(recivoMensajeNormalizo_1)
    //porcentaje de compreción de mennsajes
    const tamano_mensajesNormalizado = JSON.stringify(recivoMensajeNormalizo_1).length
    const tamano_mesajesDesnormalizado = JSON.stringify(recivoMensajeDenormalizo_1).length
    // const porcentaje = ((1 - (tamano_mensajesNormalizado / tamano_mesajesDesnormalizado )) * 100) 
    const porcentaje = (tamano_mesajesDesnormalizado * 100) / tamano_mensajesNormalizado

    //envio el porcentaje de compreción
    socket.emit("porcenntajeComprecion", Math.round(porcentaje) )

    //envio la lista de mensajes normalizada
    socket.emit("mensajes", recivoMensajeNormalizo_1);
  }

  socket.on("nuevoMensaje", async (msjRecib) => {
    const msjInMongo = await mensajesMongo_.savee(msjRecib)
    await mensajesFireBase_.saveeFb(msjRecib, msjInMongo)
    await mensajesFile.save({id: msjInMongo,...msjRecib});
    io.sockets.emit("nuevoMensajeAtodos", msjRecib);
  });
});


//==============================================================================================
//ruta nueva para mooks
app.get("/api/productos-test", (req, res) => {
  const randomProducts = [];
  for (let i = 0; i < 5; i++) {
    randomProducts.push({
      id: i + 1,
      title: commerce.product(),
      price: commerce.price(),
      thumbnail: image.imageUrl(),
    });
  }
  res.json(randomProducts);
});

server.on("error", (error) => {
  console.log(`Ah ocurrido un ${error}`);
});
