const { register_user, login, logout } = require("./auth.controller");

const authRouter = require("express").Router();

authRouter.post("/register-user", register_user);
authRouter.post("/login", login);
authRouter.get("/logout", logout);
authRouter.post()
module.exports = authRouter;
