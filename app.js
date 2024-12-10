const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");

const mensagens = require("./data/mensagens.json");
const authRoutes = require("./routes/auth");
const usuariosRoutes = require("./routes/usuarios");

const app = express();

// Configuração de middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: "salaBatePapo",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 30 * 60 * 1000 },
  })
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Caminho do arquivo de usuários
const usuariosPath =
  process.env.NODE_ENV === "production"
    ? path.join("/tmp", "usuarios.json")
    : path.join(__dirname, "./data/usuarios.json");

// Inicializa o arquivo de usuários se não existir
if (!fs.existsSync(usuariosPath)) {
  fs.writeFileSync(usuariosPath, JSON.stringify([]));
}

// Rotas principais
app.use("/auth", authRoutes);
app.use("/usuarios", usuariosRoutes);

app.get("/menu", (req, res) => {
  if (!req.session.usuario) {
    return res.redirect("/auth/login");
  }
  res.render("menu", {
    ultimoAcesso: req.cookies.ultimoAcesso || "Primeiro acesso",
  });
});

app.get("/mensagens/batePapo", (req, res) => {
  if (!req.session.usuario) {
    return res.redirect("/auth/login");
  }

  try {
    const usuarios = JSON.parse(fs.readFileSync(usuariosPath, "utf-8"));
    res.render("batePapo", {
      usuarios,
      mensagens,
      usuarioAtual: req.session.usuario,
      error: null,
    });
  } catch (error) {
    console.error("Erro ao carregar usuários:", error);
    res.status(500).render("error", { message: "Erro ao carregar o bate-papo." });
  }
});

app.post("/mensagens/batePapo", (req, res) => {
  if (!req.session.usuario) {
    return res.redirect("/auth/login");
  }

  const { usuario, mensagem } = req.body;

  if (!usuario || !mensagem) {
    return res.render("batePapo", {
      usuarios: JSON.parse(fs.readFileSync(usuariosPath, "utf-8")),
      mensagens,
      usuarioAtual: req.session.usuario,
      error: "Todos os campos são obrigatórios!",
    });
  }

  mensagens.push({
    usuario,
    texto: mensagem,
    data: new Date().toLocaleString(),
  });

  res.redirect("/mensagens/batePapo");
});

app.get("/", (req, res) => res.redirect("/auth/login"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

