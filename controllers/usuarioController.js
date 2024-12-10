const fs = require("fs");
const path = require("path");


const usuariosPath =
  process.env.NODE_ENV === "production"
    ? path.join("/tmp", "usuarios.json") // Diretório temporário no Vercel
    : path.join(__dirname, "../data/usuarios.json");


if (!fs.existsSync(usuariosPath)) {
  fs.writeFileSync(usuariosPath, JSON.stringify([]), "utf-8");
}


let usuarios = [];
try {
  usuarios = JSON.parse(fs.readFileSync(usuariosPath, "utf-8"));
} catch (error) {
  console.error("Erro ao carregar o arquivo de usuários:", error);
  fs.writeFileSync(usuariosPath, JSON.stringify([]), "utf-8");
  usuarios = [];
}


const listarUsuarios = (req, res) => {
  try {
    usuarios = JSON.parse(fs.readFileSync(usuariosPath, "utf-8")); // Atualiza a lista de usuários
    res.render("cadastroUsuario", { usuarios, erro: null });
  } catch (error) {
    console.error("Erro ao listar os usuários:", error);
    res.render("error", { message: "Erro ao carregar os usuários cadastrados." });
  }
};


const adicionarUsuario = (req, res) => {
  const { nome, dataNascimento, nickname, email, senha } = req.body;

  
  if (!nome || !dataNascimento || !nickname || !email || !senha) {
    return res.render("cadastroUsuario", {
      usuarios,
      erro: "Todos os campos são obrigatórios!",
    });
  }

 
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

  
  const novoUsuario = { nome, dataNascimento, nickname, email, senha };
  usuarios.push(novoUsuario);

 
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



