const fs = require("fs");
const path = require("path");

// Caminho do arquivo de usuários
const usuariosPath =
  process.env.NODE_ENV === "production"
    ? path.join("/tmp", "usuarios.json")
    : path.join(__dirname, "../data/usuarios.json");

// Carrega os usuários
let usuarios = [];
try {
  usuarios = JSON.parse(fs.readFileSync(usuariosPath, "utf-8"));
} catch (error) {
  console.error("Erro ao carregar usuários:", error);
}

// Função de login
const login = (req, res) => {
  const { email, senha } = req.body;

  // Validações de campos obrigatórios
  if (!email || !senha) {
    return res.render("login", { error: "E-mail e senha são obrigatórios!" });
  }

  // Verifica se o usuário existe e a senha está correta
  const usuario = usuarios.find(
    (u) => u.email === email && u.senha === senha
  );

  if (!usuario) {
    return res.render("login", { error: "E-mail ou senha inválidos!" });
  }

  // Configura a sessão e redireciona para o menu
  req.session.usuario = usuario.nickname; // Armazena o nickname na sessão
  res.cookie("ultimoAcesso", new Date().toLocaleString());
  res.redirect("/menu");
};

// Função de logout
const logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.redirect("/auth/login");
  });
};

module.exports = { login, logout };
