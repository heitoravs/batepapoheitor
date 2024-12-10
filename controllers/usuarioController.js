const fs = require("fs");
const path = require("path");

// Determina o caminho do arquivo de usuários dependendo do ambiente
const usuariosPath =
  process.env.NODE_ENV === "production"
    ? path.join("/tmp", "usuarios.json") // Diretório temporário no Vercel
    : path.join(__dirname, "../data/usuarios.json");

// Inicializa o arquivo de usuários se não existir
if (!fs.existsSync(usuariosPath)) {
  try {
    fs.writeFileSync(usuariosPath, JSON.stringify([]), "utf-8");
    console.log("Arquivo de usuários criado com sucesso.");
  } catch (error) {
    console.error("Erro ao criar o arquivo de usuários:", error);
  }
}

// Carrega os usuários do arquivo JSON com proteção contra erros
let usuarios = [];
try {
  usuarios = JSON.parse(fs.readFileSync(usuariosPath, "utf-8"));
  console.log("Usuários carregados:", usuarios);
} catch (error) {
  console.error("Erro ao carregar o arquivo de usuários:", error);
  try {
    fs.writeFileSync(usuariosPath, JSON.stringify([]), "utf-8");
  } catch (writeError) {
    console.error("Erro ao reescrever o arquivo de usuários:", writeError);
  }
  usuarios = [];
}

// Função para listar os usuários cadastrados
const listarUsuarios = (req, res) => {
  try {
    res.render("cadastroUsuario", { usuarios, erro: null });
  } catch (error) {
    console.error("Erro ao renderizar a página de cadastro:", error);
    res.render("error", { message: "Erro ao carregar a página de cadastro." });
  }
};

// Função para adicionar um novo usuário
const adicionarUsuario = (req, res) => {
  const { nome, dataNascimento, nickname, email, senha } = req.body;

  console.log("Dados recebidos para cadastro:", {
    nome,
    dataNascimento,
    nickname,
    email,
    senha,
  });

  // Validações de campos obrigatórios
  if (!nome || !dataNascimento || !nickname || !email || !senha) {
    console.log("Erro: Campos obrigatórios ausentes.");
    return res.render("cadastroUsuario", {
      usuarios,
      erro: "Todos os campos são obrigatórios!",
    });
  }

  // Verifica se o e-mail já está cadastrado
  const emailExistente = usuarios.find((u) => u.email === email);
  if (emailExistente) {
    console.log("Erro: E-mail já cadastrado.");
    return res.render("cadastroUsuario", {
      usuarios,
      erro: "E-mail já cadastrado!",
    });
  }

  // Verifica se o nickname já está cadastrado
  const nicknameExistente = usuarios.find((u) => u.nickname === nickname);
  if (nicknameExistente) {
    console.log("Erro: Nickname já está em uso.");
    return res.render("cadastroUsuario", {
      usuarios,
      erro: "Nickname já está em uso!",
    });
  }

  // Cria um novo usuário
  const novoUsuario = { nome, dataNascimento, nickname, email, senha };
  usuarios.push(novoUsuario);

  try {
    // Salva os usuários atualizados no arquivo JSON
    fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2), "utf-8");
    console.log("Usuário cadastrado com sucesso:", novoUsuario);
    res.redirect("/auth/login");
  } catch (error) {
    console.error("Erro ao salvar o arquivo de usuários:", error);
    res.render("error", { message: "Erro ao salvar o usuário." });
  }
};

module.exports = { listarUsuarios, adicionarUsuario };



