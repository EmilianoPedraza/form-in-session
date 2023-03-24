const mongoose = require("mongoose")
module.exports = () => {
  //un callback por las dudas
  mongoose.set({ strictQuery: false });
  // const URL = "mongodb://localhost:27017/mook-data"
  const URL = "mongodb+srv://root:1234@for-in-formulario.bdmm9h2.mongodb.net/productos-mensajes"
  //para el proyecto actual"mongodb+srv://mook:mook@mook-data.3u5wutu.mongodb.net/mook-data"
  mongoose.connect(URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
  });
};
