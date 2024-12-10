const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");

const mensagens = require("./data/mensagens.json");
const authRoutes = require("./routes/auth");
const usuariosRoutes = require("./routes/usuarios");

const app = express();

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

  const usuariosPath = path.join(__dirname, "./data/usuarios.json");
  const usuarios = JSON.parse(fs.readFileSync(usuariosPath, "utf-8")).map(
    (usuario) => ({
      nickname: usuario.nickname,
    })
  );

  res.render("batePapo", {
    usuarios,
    mensagens,
    usuarioAtual: req.session.usuario,
    error: null,
  });
});

app.post("/mensagens/batePapo", (req, res) => {
  if (!req.session.usuario) {
    return res.redirect("/auth/login");
  }

  const { usuario, mensagem } = req.body;

  if (!usuario || !mensagem) {
    return res.render("batePapo", {
      usuarios,
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


