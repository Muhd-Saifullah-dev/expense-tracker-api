const {
  register_user,
  login,
  logout,
  forget_password,
  verify_otp,
  reset_password,
  refresh_token,
} = require("./auth.controller");

const authRouter = require("express").Router();

authRouter.post("/register", register_user);
authRouter.post("/login", login);
authRouter.get("/logout", logout);
authRouter.post("/forget-password", forget_password);
authRouter.post("/verify-otp", verify_otp);
authRouter.post("/reset-password", reset_password);
authRouter.get("/refresh-token", refresh_token);
module.exports = authRouter;
