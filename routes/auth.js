const express = require("express");
const router = express.Router();
const { login, logout } = require("../controllers/authController");


router.get("/login", (req, res) => {
  res.render("login", { error: null });
});


router.post("/login", (req, res) => {
  try {
    login(req, res);
  } catch (error) {
    console.error("Erro no login:", error);
    res.render("login", { error: "Erro ao processar o login." });
  }
});


router.get("/logout", (req, res) => {
  try {
    logout(req, res);
  } catch (error) {
    console.error("Erro no logout:", error);
    res.redirect("/auth/login");
  }
});

module.exports = router;
