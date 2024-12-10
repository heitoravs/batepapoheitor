const mensagens = require("../data/mensagens.json");

const listarMensagens = (req, res) => {
  res.render("batePapo", { mensagens, error: null });
};

const adicionarMensagem = (req, res) => {
  const { mensagem } = req.body;

  if (!mensagem) {
    return res.render("batePapo", { mensagens, error: "A mensagem não pode ser vazia!" });
  }

  mensagens.push({ texto: mensagem, data: new Date().toLocaleString() });
  res.redirect("/mensagens/batePapo");
};

module.exports = { listarMensagens, adicionarMensagem };
