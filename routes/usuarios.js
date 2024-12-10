const express = require("express");
const router = express.Router();
const { listarUsuarios, adicionarUsuario } = require("../controllers/usuarioController");

router.get("/cadastro", (req, res) => {
  try {
    listarUsuarios(req, res);
  } catch (error) {
    console.error("Erro ao carregar a página de cadastro:", error);
    res.render("error", { message: "Erro ao carregar a página de cadastro." });
  }
});

router.post("/cadastro", (req, res) => {
  try {
    adicionarUsuario(req, res);
  } catch (error) {
    console.error("Erro ao processar o cadastro:", error);
    res.render("error", { message: "Erro ao processar o cadastro." });
  }
});

module.exports = router;

