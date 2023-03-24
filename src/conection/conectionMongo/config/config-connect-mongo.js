const session = require("express-session");
const mongoStore = require("connect-mongo");
//configuración de opciones avanzadas de connect-mongo-----------------------------------------------------------------
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };

//aplicación de middleware-------------------------------------------------------------------------------------------
module.exports = () => {
  try {
    return session({
        store: mongoStore.create({
          mongoUrl:
            "mongodb+srv://root:1234@for-in-formulario.bdmm9h2.mongodb.net/sesiones?retryWrites=true&w=majority",
          mongoOptions: advancedOptions,
          ttl: 600
        }),
        secret: "session_practica",
        resave: true,
        saveUninitialized: true,
      })
  } catch (error) {
    console.log("Error en config-connect-mongo:\n", error);
  }
};
