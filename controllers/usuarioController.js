const fs = require("fs");
const path = require("path");

// Caminho do arquivo de usuários
const usuariosPath =
  process.env.NODE_ENV === "production"
    ? path.join("/tmp", "usuarios.json") // Diretório temporário no Vercel
    : path.join(__dirname, "../data/usuarios.json");

// Inicializa o arquivo de usuários se não existir
if (!fs.existsSync(usuariosPath)) {
  fs.writeFileSync(usuariosPath, JSON.stringify([]));
}

// Carrega os usuários do arquivo JSON com proteção contra erros
let usuarios = [];
try {
  usuarios = JSON.parse(fs.readFileSync(usuariosPath, "utf-8"));
} catch (error) {
  console.error("Erro ao ler o arquivo de usuários:", error);
  fs.writeFileSync(usuariosPath, JSON.stringify([]));
  usuarios = [];
}

const listarUsuarios = (req, res) => {
  res.render("cadastroUsuario", { usuarios, erro: null });
};

const adicionarUsuario = (req, res) => {
  const { nome, dataNascimento, nickname, email, senha } = req.body;

  // Validações de campos obrigatórios
  if (!nome || !dataNascimento || !nickname || !email || !senha) {
    return res.render("cadastroUsuario", {
      usuarios,
      erro: "Todos os campos são obrigatórios!",
    });
  }

  // Verifica se o e-mail já está cadastrado
  const emailExistente = usuarios.find((u) => u.email === email);
  if (emailExistente) {
    return res.render("cadastroUsuario", {
      usuarios,
      erro: "E-mail já cadastrado!",
    });
  }

  // Cria um novo usuário
  const novoUsuario = { nome, dataNascimento, nickname, email, senha };
  usuarios.push(novoUsuario);

  try {
    // Salva no arquivo JSON
    fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2));
    console.log("Usuário cadastrado com sucesso:", novoUsuario);
    res.redirect("/auth/login");
  } catch (error) {
    console.error("Erro ao salvar usuário no arquivo JSON:", error);
    res.render("error", { message: "Erro ao salvar o usuário." });
  }
};

module.exports = { listarUsuarios, adicionarUsuario };

module.exports = { listarUsuarios, adicionarUsuario };
