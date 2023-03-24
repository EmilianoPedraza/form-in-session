const { Router } = require("express");
const router = new Router();

router.post("/login", (req, res)=>{
  try {
    console.log("se ejecuto metodo post /login")
    const {nameSesion} =  req.body;
    req.session.nombre = nameSesion
    res.redirect("/")
  } catch (error) {
    console.log("Error en login.js router.post('/login')")
  }
})
router.get("/login", (req, res) => {
    try {
        res.render("login")
    } catch (error) {
      console.log("Error en login.js router.get('/login'):\n", error)
    }
});


module.exports = router