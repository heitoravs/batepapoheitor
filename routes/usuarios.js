const express = require("express");
const router = express.Router();
const { listarUsuarios, adicionarUsuario } = require("../controllers/usuarioController");


const verificarSessao = (req, res, next) => {
  if (!req.session.usuario) {
    return res.redirect("/auth/login"); 
  }
  next(); 
};


router.get("/cadastro", (req, res) => {
  try {
    listarUsuarios(req, res); 
  } catch (error) {
    console.error("Erro ao listar usuários:", error); 
    res.render("error", { message: "Erro ao carregar a página de cadastro." }); 
  }
});


router.post("/cadastro", (req, res) => {
    try {
      adicionarUsuario(req, res); 
    } catch (error) {
      console.error("Erro ao adicionar usuário:", error);
      res.render("error", { message: "Erro ao cadastrar o usuário." });
    }
  });
  

module.exports = router;
