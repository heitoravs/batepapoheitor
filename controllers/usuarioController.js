const fs = require("fs");
const path = require("path");

// Determina o caminho do arquivo de usuários dependendo do ambiente
const usuariosPath =
  process.env.NODE_ENV === "production"
    ? path.join("/tmp", "usuarios.json") // Diretório temporário no Vercel
    : path.join(__dirname, "../data/usuarios.json");

// Inicializa o arquivo de usuários se não existir
if (!fs.existsSync(usuariosPath)) {
  fs.writeFileSync(usuariosPath, JSON.stringify([]), "utf-8");
}

// Carrega os usuários do arquivo JSON
let usuarios = JSON.parse(fs.readFileSync(usuariosPath, "utf-8"));

// Função para listar os usuários cadastrados
const listarUsuarios = (req, res) => {
  res.render("cadastroUsuario", { usuarios, erro: null });
};

// Função para adicionar um novo usuário
const adicionarUsuario = (req, res) => {
  const { nome, dataNascimento, nickname, email, senha } = req.body;

  // Validações de campos obrigatórios
  if (!nome || !dataNascimento || !nickname || !email || !senha) {
    return res.render("cadastroUsuario", {
      usuarios,
      erro: "Todos os campos são obrigatórios!",
    });
  }

  // Verifica se o e-mail ou nickname já estão cadastrados
  if (usuarios.find((u) => u.email === email)) {
    return res.render("cadastroUsuario", {
      usuarios,
      erro: "E-mail já cadastrado!",
    });
  }

  if (usuarios.find((u) => u.nickname === nickname)) {
    return res.render("cadastroUsuario", {
      usuarios,
      erro: "Nickname já está em uso!",
    });
  }

  // Adiciona o novo usuário
  const novoUsuario = { nome, dataNascimento, nickname, email, senha };
  usuarios.push(novoUsuario);

  // Salva o novo usuário no arquivo JSON
  try {
    fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2), "utf-8");
    console.log("Usuário cadastrado com sucesso:", novoUsuario);
    res.redirect("/auth/login");
  } catch (error) {
    console.error("Erro ao salvar o usuário:", error);
    res.render("error", { message: "Erro ao salvar o usuário." });
  }
};

module.exports = { listarUsuarios, adicionarUsuario };


module.exports = { listarUsuarios, adicionarUsuario };



