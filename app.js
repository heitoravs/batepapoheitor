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

// Função para formatar data e hora
function formatarDataHora(data) {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  return new Intl.DateTimeFormat("pt-BR", options).format(data);
}

// Rota do menu
app.get("/menu", (req, res) => {
  if (!req.session.usuario) {
    return res.redirect("/auth/login");
  }

  const ultimoAcesso = req.cookies.ultimoAcesso
    ? formatarDataHora(new Date(req.cookies.ultimoAcesso))
    : "Primeiro acesso";

  res.render("menu", {
    ultimoAcesso,
  });
});

// Rota do bate-papo
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

// Define o último acesso
app.use((req, res, next) => {
  res.cookie("ultimoAcesso", new Date().toISOString());
  next();
});

app.get("/", (req, res) => res.redirect("/auth/login"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


