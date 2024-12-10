const fs = require("fs");
const path = require("path");


const usuariosPath = path.join(__dirname, "../data/usuarios.json");
let usuarios = require(usuariosPath);

const listarUsuarios = (req, res) => {
  res.render("cadastroUsuario", { usuarios, erro: null });
};

const adicionarUsuario = (req, res) => {
  const { nome, dataNascimento, nickname, email, senha } = req.body;


  if (!nome || !dataNascimento || !nickname || !email || !senha) {
    return res.render("cadastroUsuario", {
      usuarios,
      erro: "Todos os campos são obrigatórios!",
    });
  }


  const emailExistente = usuarios.find((u) => u.email === email);
  if (emailExistente) {
    return res.render("cadastroUsuario", {
      usuarios,
      erro: "E-mail já cadastrado!",
    });
  }


  usuarios.push({ nome, dataNascimento, nickname, email, senha });


  fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2));

  res.redirect("/auth/login");
};

module.exports = { listarUsuarios, adicionarUsuario };
