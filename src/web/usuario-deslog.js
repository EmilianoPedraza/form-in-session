const {Router} = require("express")
const route= Router()

route.get("/usuario-deslog",async (req, res)=>{
    const {nombre} = req.session
    if(nombre){
      req.session.destroy((err) => {
          if (!err) {
              return res.render("usuario-deslog",{nombre});
          }
          res.status(500).json({
            error: "Ha ocurrido un error durante al eliminar la session",
          });
        });
    }
})

module.exports = route