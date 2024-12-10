const fs = require("fs");
const path = require("path");


const usuariosPath = path.join(__dirname, "../data/usuarios.json");
let usuarios = require(usuariosPath);

const login = (req, res) => {
  const { email, senha } = req.body;


  const usuario = usuarios.find((u) => u.email === email && u.senha === senha);
  if (!usuario) {
    return res.render("login", { error: "E-mail ou senha inválidos!" });
  }

  req.session.usuario = usuario.nickname; 
  res.cookie("ultimoAcesso", new Date().toLocaleString());
  res.redirect("/menu");
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect("/auth/login");
};

module.exports = { login, logout };
