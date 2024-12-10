const fs = require("fs");
const path = require("path");

// Determina o caminho do arquivo de usuários dependendo do ambiente
const usuariosPath =
  process.env.NODE_ENV === "production"
    ? path.join("/tmp", "usuarios.json")
    : path.join(__dirname, "../data/usuarios.json");

// Carrega os usuários do arquivo JSON com proteção contra erros
let usuarios = [];
try {
  usuarios = JSON.parse(fs.readFileSync(usuariosPath, "utf-8"));
  console.log(`Usuários carregados: ${usuarios.length}`);
} catch (error) {
  console.error("Erro ao carregar o arquivo de usuários:", error);
  usuarios = [];
}

// Função de login
const login = (req, res) => {
  const { email, senha } = req.body;

  // Validações de campos obrigatórios
  if (!email || !senha) {
    console.log("Tentativa de login sem email ou senha.");
    return res.render("login", { error: "E-mail e senha são obrigatórios!" });
  }

  // Verifica se o usuário existe e a senha está correta
  const usuario = usuarios.find(
    (u) => u.email === email && u.senha === senha
  );

  if (!usuario) {
    console.log(`Tentativa de login falhou. Email: ${email}`);
    return res.render("login", { error: "E-mail ou senha inválidos!" });
  }

  // Configura a sessão e redireciona para o menu
  req.session.usuario = usuario.nickname; // Armazena o nickname na sessão
  res.cookie("ultimoAcesso", new Date().toLocaleString());
  console.log(`Login bem-sucedido para o usuário: ${usuario.nickname}`);
  res.redirect("/menu");
};

// Função de logout
const logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    console.log("Usuário deslogado com sucesso.");
    res.redirect("/auth/login");
  });
};

module.exports = { login, logout };
