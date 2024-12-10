const express = require("express");
const router = express.Router();
const usuarios = require("../data/usuarios.json");
const mensagens = require("../data/mensagens.json");

router.get("/batePapo", (req, res) => {
  if (!req.session.usuario) {
    return res.redirect("/auth/login"); 
  }

  res.render("batePapo", {
    usuarios, 
    mensagens, 
    usuarioAtual: req.session.usuario, 
    error: null 
  });
});

module.exports = router;

