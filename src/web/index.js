const { Router } = require("express");
const router = Router();


//endpoint que retorna la vista principal(index.ejs)
router.get("/", (req, res) => {
  try {
    const { nombre } = req.session;
    if (!nombre) {
      console.log(
        "desde index.js - no existe nombre: el usuario debe logearse"
      );
      return res.redirect("/login");
    }
    res.render("index", {nombre : req.session.nombre})

  } catch (error) {
    console.log("Error index.js en router.get('/'):\n", error);
  }
});

router.post("/-",(req,res)=>{
  try {
    if(!req.session.nombre){
      return res.redirect("/login")
    }
    console.log("redireccion a usario-deslog")
    res.redirect("/usuario-deslog")
  } catch (error) {
    console.log("Error en index.js router.post('-/'):\n", error)
  }
})
module.exports = router;
